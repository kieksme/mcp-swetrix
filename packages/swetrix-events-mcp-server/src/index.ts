#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPublicClient, createAuthenticatedClient } from "./services/api-client.js";
import { registerPageviewTool } from "./tools/pageview.js";
import { registerCustomEventTool } from "./tools/custom-event.js";
import { registerHeartbeatTool } from "./tools/heartbeat.js";
import { registerErrorEventTool } from "./tools/error-event.js";
import { registerRevenueTool } from "./tools/revenue.js";

const server = new McpServer({
  name: "swetrix-events-mcp",
  version: "1.0.0",
});

const publicClient = createPublicClient();

// Revenue requires authentication; other event endpoints use only the project ID
const apiKey = process.env.SWETRIX_API_KEY;
const revenueClient = apiKey
  ? createAuthenticatedClient(apiKey)
  : publicClient; // Will return 403 at runtime if called without a key

registerPageviewTool(server, publicClient);
registerCustomEventTool(server, publicClient);
registerHeartbeatTool(server, publicClient);
registerErrorEventTool(server, publicClient);
registerRevenueTool(server, revenueClient);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("swetrix-events-mcp-server running via stdio");
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
