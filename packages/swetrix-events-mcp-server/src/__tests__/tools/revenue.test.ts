import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { http, HttpResponse } from "msw";
import { mswServer } from "../mocks/server.js";
import { errorHandlers, SWETRIX_API_BASE } from "../mocks/handlers.js";
import { createAuthenticatedClient } from "../../services/api-client.js";
import { registerRevenueTool } from "../../tools/revenue.js";

type RegisteredTool = { handler: (args: unknown) => Promise<{ content: Array<{ type: string; text: string }> }> };
type ServerWithTools = { _registeredTools: Record<string, RegisteredTool> };

function getTool(name: string) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerRevenueTool(server, createAuthenticatedClient("test-key"));
  return (server as unknown as ServerWithTools)._registeredTools[name];
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_track_revenue", () => {
  it("returns confirmation with transaction ID", async () => {
    const result = await getTool("swetrix_track_revenue").handler({
      pid: "abc123",
      type: "sale",
      amount: 49.99,
      currency: "EUR",
      transactionId: "order_42",
    });
    expect(result.content[0].text).toContain("sale");
    expect(result.content[0].text).toContain("49.99");
    expect(result.content[0].text).toContain("EUR");
    expect(result.content[0].text).toContain("order_42");
  });

  it("falls back to N/A when no transaction ID is available", async () => {
    mswServer.use(
      http.post(`${SWETRIX_API_BASE}/log/revenue`, () => HttpResponse.json({ success: true }, { status: 201 }))
    );
    const result = await getTool("swetrix_track_revenue").handler({
      pid: "abc123",
      type: "sale",
      amount: 49.99,
      currency: "EUR",
    });
    expect(result.content[0].text).toContain("N/A");
  });

  it("returns error message on 403", async () => {
    mswServer.use(errorHandlers.revenueForbidden);
    const result = await getTool("swetrix_track_revenue").handler({
      pid: "abc",
      type: "sale",
      amount: 10,
      currency: "USD",
    });
    expect(result.content[0].text).toContain("403");
  });
});
