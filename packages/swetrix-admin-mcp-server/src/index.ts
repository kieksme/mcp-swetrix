#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createApiClient } from "./services/api-client.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerFunnelTools } from "./tools/funnels.js";
import { registerAnnotationTools } from "./tools/annotations.js";
import { registerViewTools } from "./tools/views.js";
import { registerOrganisationTools } from "./tools/organisations.js";
import { startHttpTransport } from "./http-transport.js";
import { MCP_TRANSPORT, HTTP_PORT, HTTP_ENDPOINT, HTTP_AUTH_TOKEN } from "./constants.js";

const apiKey = process.env.SWETRIX_API_KEY;
if (!apiKey) {
  console.error("ERROR: SWETRIX_API_KEY environment variable is required");
  process.exit(1);
}

const client = createApiClient(apiKey);

function buildServer(): McpServer {
  const server = new McpServer({
    name: "swetrix-admin-mcp-server",
    version: "1.0.0",
  });

  registerProjectTools(server, client);
  registerFunnelTools(server, client);
  registerAnnotationTools(server, client);
  registerViewTools(server, client);
  registerOrganisationTools(server, client);

  return server;
}

async function main(): Promise<void> {
  if (MCP_TRANSPORT === "http") {
    await startHttpTransport(buildServer, { port: HTTP_PORT, endpoint: HTTP_ENDPOINT, authToken: HTTP_AUTH_TOKEN });
    console.error(`swetrix-admin-mcp-server running via HTTP on port ${HTTP_PORT} (${HTTP_ENDPOINT})`);
  } else {
    const transport = new StdioServerTransport();
    await buildServer().connect(transport);
    console.error("swetrix-admin-mcp-server running via stdio");
  }
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
