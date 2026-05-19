import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { createApiClient } from "../services/api-client.js";

type ToolResult = { content: Array<{ type: string; text: string }>; structuredContent?: unknown };
type RegisteredTool = { handler: (args: unknown) => Promise<ToolResult> };
type ServerWithTools = { _registeredTools: Record<string, RegisteredTool> };

export function makeClient(): AxiosInstance {
  return createApiClient("test-key");
}

export function getTool(server: McpServer, name: string): RegisteredTool {
  const tool = (server as unknown as ServerWithTools)._registeredTools[name];
  if (!tool) throw new Error(`Tool '${name}' not registered`);
  return tool;
}
