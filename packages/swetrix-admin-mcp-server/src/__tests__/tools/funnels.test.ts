import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { makeClient, getTool } from "../helpers.js";
import { registerFunnelTools } from "../../tools/funnels.js";

function setup() {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerFunnelTools(server, makeClient());
  return server;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_list_funnels", () => {
  it("returns funnel list", async () => {
    const result = await getTool(setup(), "swetrix_list_funnels").handler({ pid: "proj1" });
    expect(result.content[0].text).toContain("Sign-up");
  });
});

describe("swetrix_create_funnel", () => {
  it("returns created funnel", async () => {
    const result = await getTool(setup(), "swetrix_create_funnel").handler({
      pid: "proj1", name: "Sign-up", steps: ["/", "/signup"],
    });
    expect(result.content[0].text).toContain("Sign-up");
  });
});

describe("swetrix_update_funnel", () => {
  it("returns updated funnel", async () => {
    const result = await getTool(setup(), "swetrix_update_funnel").handler({
      id: "fun1", pid: "proj1", name: "Sign-up v2",
    });
    expect(result.content[0].text).toContain("fun1");
  });
});

describe("swetrix_delete_funnel", () => {
  it("returns success message", async () => {
    const result = await getTool(setup(), "swetrix_delete_funnel").handler({ id: "fun1", pid: "proj1" });
    expect(result.content[0].text).toContain("deleted");
  });
});
