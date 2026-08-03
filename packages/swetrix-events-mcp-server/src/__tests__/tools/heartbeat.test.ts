import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { errorHandlers, SWETRIX_API_BASE } from "../mocks/handlers.js";
import { createPublicClient } from "../../services/api-client.js";
import { registerHeartbeatTool } from "../../tools/heartbeat.js";

type RegisteredTool = { handler: (args: unknown) => Promise<{ content: Array<{ type: string; text: string }> }> };
type ServerWithTools = { _registeredTools: Record<string, RegisteredTool> };

function getTool(name: string) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerHeartbeatTool(server, createPublicClient());
  return (server as unknown as ServerWithTools)._registeredTools[name];
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_track_heartbeat", () => {
  it("returns confirmation for project", async () => {
    const result = await getTool("swetrix_track_heartbeat").handler({ pid: "abc123" });
    expect(result.content[0].text).toContain("Heartbeat sent");
    expect(result.content[0].text).toContain("abc123");
  });

  it("returns error message on 400", async () => {
    mswServer.use(errorHandlers.heartbeatBadRequest);
    const result = await getTool("swetrix_track_heartbeat").handler({ pid: "bad" });
    expect(result.content[0].text).toContain("400");
  });

  it("sends X-Client-IP-Address and User-Agent headers", async () => {
    const capturedHeaders: Record<string, string> = {};
    mswServer.use(
      http.post(`${SWETRIX_API_BASE}/log/hb`, ({ request }) => {
        request.headers.forEach((value, key) => { capturedHeaders[key] = value; });
        return HttpResponse.json({}, { status: 201 });
      })
    );

    await getTool("swetrix_track_heartbeat").handler({ pid: "abc", ip: "1.2.3.4", userAgent: "TestBot/1.0" });
    expect(capturedHeaders["x-client-ip-address"]).toBe("1.2.3.4");
    expect(capturedHeaders["user-agent"]).toBe("TestBot/1.0");
  });
});
