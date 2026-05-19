#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("swetrix-statistics-mcp-server running via stdio");
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
