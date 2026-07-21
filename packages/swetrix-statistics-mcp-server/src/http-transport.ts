import { createServer, IncomingMessage, Server, ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const MAX_BODY_BYTES = 10 * 1024 * 1024;

export interface HttpTransportOptions {
  port: number;
  endpoint: string;
  authToken: string | undefined;
}

class BadRequestError extends Error {}

function isAuthorized(req: IncomingMessage, authToken: string): boolean {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return false;
  }
  const provided = Buffer.from(header.slice("Bearer ".length));
  const expected = Buffer.from(authToken);
  // Constant-time comparison guards against timing attacks; lengths must
  // match first since timingSafeEqual throws on mismatched buffer sizes.
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(payload);
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req as AsyncIterable<Buffer>) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new BadRequestError("Request body too large");
    }
    chunks.push(chunk);
  }
  if (chunks.length === 0) {
    return undefined;
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new BadRequestError("Invalid JSON body");
  }
}

/**
 * Starts a stateless Streamable HTTP transport (one StreamableHTTPServerTransport
 * per request, per the MCP SDK's documented stateless usage) bound to `server`,
 * which must already have all tools registered. Returns the underlying
 * http.Server so callers (and tests) can inspect its bound address or close it.
 */
export async function startHttpTransport(server: McpServer, options: HttpTransportOptions): Promise<Server> {
  const { port, endpoint, authToken } = options;

  if (!authToken) {
    console.error("ERROR: MCP_HTTP_AUTH_TOKEN environment variable is required when MCP_TRANSPORT=http");
    process.exit(1);
  }
  const token: string = authToken;

  async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (!isAuthorized(req, token)) {
      sendJson(res, 401, { error: "Unauthorized" });
      return;
    }

    const { pathname } = new URL(req.url ?? "/", "http://localhost");
    if (pathname !== endpoint) {
      sendJson(res, 404, { error: "Not Found" });
      return;
    }

    try {
      const parsedBody = req.method === "POST" ? await readJsonBody(req) : undefined;
      // enableJsonResponse: plain JSON responses instead of an SSE stream, since
      // this is a stateless single request/response endpoint (no server push).
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      res.on("close", () => {
        void transport.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, parsedBody);
    } catch (error) {
      if (res.headersSent) {
        return;
      }
      if (error instanceof BadRequestError) {
        sendJson(res, 400, {
          jsonrpc: "2.0",
          error: { code: -32700, message: error.message },
          id: null,
        });
        return;
      }
      console.error("Error handling MCP HTTP request:", error);
      sendJson(res, 500, {
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }

  const httpServer = createServer((req, res) => {
    void handleRequest(req, res);
  });

  await new Promise<void>((resolve) => {
    httpServer.listen(port, "0.0.0.0", resolve);
  });

  const shutdown = (): void => {
    httpServer.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return httpServer;
}
