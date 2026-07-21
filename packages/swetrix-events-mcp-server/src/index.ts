#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { createPublicClient, createAuthenticatedClient } from "./services/api-client.js";
import { registerPageviewTool } from "./tools/pageview.js";
import { registerCustomEventTool } from "./tools/custom-event.js";
import { registerHeartbeatTool } from "./tools/heartbeat.js";
import { registerErrorEventTool } from "./tools/error-event.js";
import { registerRevenueTool } from "./tools/revenue.js";

const publicClient = createPublicClient();

// Revenue requires authentication; other event endpoints use only the project ID
const apiKey = process.env.SWETRIX_API_KEY;
const revenueClient = apiKey
  ? createAuthenticatedClient(apiKey)
  : publicClient; // Will return 403 at runtime if called without a key

function buildServer(): McpServer {
  const server = new McpServer({
    name: "swetrix-events-mcp",
    version: "1.0.0",
  });

  registerPageviewTool(server, publicClient);
  registerCustomEventTool(server, publicClient);
  registerHeartbeatTool(server, publicClient);
  registerErrorEventTool(server, publicClient);
  registerRevenueTool(server, revenueClient);

  return server;
}

async function runStdio(): Promise<void> {
  const transport = new StdioServerTransport();
  await buildServer().connect(transport);
  console.error("swetrix-events-mcp-server running via stdio");
}

// Stateless streamable-HTTP transport for hosted deployments (e.g. Coolify): a
// fresh McpServer/transport pair per request avoids sharing session state
// across concurrent callers. Bearer auth is mandatory since this listens on
// all interfaces inside the container.
async function runHttp(): Promise<void> {
  const authToken = process.env.MCP_HTTP_AUTH_TOKEN;
  if (!authToken) {
    console.error(
      "ERROR: MCP_HTTP_AUTH_TOKEN environment variable is required for HTTP transport",
    );
    process.exit(1);
  }

  const port = Number(process.env.PORT ?? 3000);
  const app = createMcpExpressApp({ host: "0.0.0.0" });

  app.use((req, res, next) => {
    if (req.headers.authorization !== `Bearer ${authToken}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    next();
  });

  app.post("/mcp", async (req, res) => {
    const server = buildServer();
    try {
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      res.on("close", () => {
        transport.close();
        server.close();
      });
    } catch (error) {
      console.error("Error handling MCP request:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  app.get("/mcp", (_req, res) => {
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    });
  });

  app.delete("/mcp", (_req, res) => {
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    });
  });

  app.listen(port, () => {
    console.error(`swetrix-events-mcp-server listening on port ${port} (HTTP)`);
  });
}

async function main(): Promise<void> {
  // MCP_TRANSPORT overrides; otherwise HTTP is implied by the presence of an
  // auth token (only ever set for hosted deployments, never for local/npx use).
  const useHttp = process.env.MCP_TRANSPORT
    ? process.env.MCP_TRANSPORT === "http"
    : Boolean(process.env.MCP_HTTP_AUTH_TOKEN);

  if (useHttp) {
    await runHttp();
  } else {
    await runStdio();
  }
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
