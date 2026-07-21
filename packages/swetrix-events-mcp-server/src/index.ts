#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPublicClient, createAuthenticatedClient } from "./services/api-client.js";
import { registerPageviewTool } from "./tools/pageview.js";
import { registerCustomEventTool } from "./tools/custom-event.js";
import { registerHeartbeatTool } from "./tools/heartbeat.js";
import { registerErrorEventTool } from "./tools/error-event.js";
import { registerRevenueTool } from "./tools/revenue.js";
import { startHttpTransport } from "./http-transport.js";
import { MCP_TRANSPORT, HTTP_PORT, HTTP_ENDPOINT, HTTP_AUTH_TOKEN } from "./constants.js";

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

async function main(): Promise<void> {
  if (MCP_TRANSPORT === "http") {
    await startHttpTransport(buildServer, { port: HTTP_PORT, endpoint: HTTP_ENDPOINT, authToken: HTTP_AUTH_TOKEN });
    console.error(`swetrix-events-mcp-server running via HTTP on port ${HTTP_PORT} (${HTTP_ENDPOINT})`);
  } else {
    const transport = new StdioServerTransport();
    await buildServer().connect(transport);
    console.error("swetrix-events-mcp-server running via stdio");
  }
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
