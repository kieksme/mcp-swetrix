import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { createPublicClient } from "../../services/api-client.js";
import { registerCustomEventTool } from "../../tools/custom-event.js";

type RegisteredTool = { handler: (args: unknown) => Promise<{ content: Array<{ type: string; text: string }> }> };
type ServerWithTools = { _registeredTools: Record<string, RegisteredTool> };

function getTool(name: string) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerCustomEventTool(server, createPublicClient());
  return (server as unknown as ServerWithTools)._registeredTools[name];
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_track_custom_event", () => {
  it("returns confirmation with event name", async () => {
    const result = await getTool("swetrix_track_custom_event").handler({
      pid: "abc123",
      ev: "signup",
      meta: { plan: "pro" },
    });
    expect(result.content[0].text).toContain("signup");
    expect(result.content[0].text).toContain("abc123");
  });
});
