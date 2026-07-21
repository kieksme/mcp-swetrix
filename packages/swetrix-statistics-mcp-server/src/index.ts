#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { createApiClient } from "./services/api-client.js";
import { registerTrafficTools } from "./tools/traffic.js";
import { registerPerformanceTools } from "./tools/performance.js";
import { registerFunnelTools } from "./tools/funnels.js";
import { registerEventTools } from "./tools/events.js";
import { registerErrorTools } from "./tools/errors.js";
import { registerProfileTools } from "./tools/profiles.js";
import { registerFilterTools } from "./tools/filters.js";
import { registerGoalTools } from "./tools/goals.js";

const apiKey = process.env.SWETRIX_API_KEY;
if (!apiKey) {
  console.error("ERROR: SWETRIX_API_KEY environment variable is required");
  process.exit(1);
}

const client = createApiClient(apiKey);

function buildServer(): McpServer {
  const server = new McpServer({
    name: "swetrix-statistics-mcp-server",
    version: "1.0.0",
  });

  registerTrafficTools(server, client);
  registerPerformanceTools(server, client);
  registerFunnelTools(server, client);
  registerEventTools(server, client);
  registerErrorTools(server, client);
  registerProfileTools(server, client);
  registerFilterTools(server, client);
  registerGoalTools(server, client);

  return server;
}

async function runStdio(): Promise<void> {
  const transport = new StdioServerTransport();
  await buildServer().connect(transport);
  console.error("swetrix-statistics-mcp-server running via stdio");
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
    console.error(`swetrix-statistics-mcp-server listening on port ${port} (HTTP)`);
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
