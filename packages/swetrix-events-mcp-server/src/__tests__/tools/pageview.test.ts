import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { errorHandlers, SWETRIX_API_BASE } from "../mocks/handlers.js";
import { createPublicClient } from "../../services/api-client.js";
import { registerPageviewTool } from "../../tools/pageview.js";

type RegisteredTool = { handler: (args: unknown) => Promise<{ content: Array<{ type: string; text: string }> }> };
type ServerWithTools = { _registeredTools: Record<string, RegisteredTool> };

function getTool(name: string) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerPageviewTool(server, createPublicClient());
  return (server as unknown as ServerWithTools)._registeredTools[name];
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_track_pageview", () => {
  it("returns confirmation on success", async () => {
    const tool = getTool("swetrix_track_pageview");
    expect(tool).toBeDefined();

    const result = await tool.handler({ pid: "abc123", pg: "/home" });
    expect(result.content[0].text).toContain("Pageview recorded");
    expect(result.content[0].text).toContain("abc123");
    expect(result.content[0].text).toContain("/home");
  });

  it("returns error message on 400", async () => {
    mswServer.use(errorHandlers.logBadRequest);
    const result = await getTool("swetrix_track_pageview").handler({ pid: "bad" });
    expect(result.content[0].text).toContain("400");
  });

  it("returns error message on 402", async () => {
    mswServer.use(errorHandlers.logQuotaExceeded);
    const result = await getTool("swetrix_track_pageview").handler({ pid: "abc" });
    expect(result.content[0].text).toContain("402");
  });

  it("sends X-Client-IP-Address and User-Agent headers", async () => {
    const capturedHeaders: Record<string, string> = {};
    mswServer.use(
      http.post(`${SWETRIX_API_BASE}/log`, ({ request }) => {
        request.headers.forEach((value, key) => { capturedHeaders[key] = value; });
        return HttpResponse.json({}, { status: 201 });
      })
    );

    await getTool("swetrix_track_pageview").handler({ pid: "abc", ip: "1.2.3.4", userAgent: "TestBot/1.0" });
    expect(capturedHeaders["x-client-ip-address"]).toBe("1.2.3.4");
    expect(capturedHeaders["user-agent"]).toBe("TestBot/1.0");
  });
});
