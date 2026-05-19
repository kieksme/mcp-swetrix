import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { makeClient, getTool } from "../helpers.js";
import { registerFilterTools } from "../../tools/filters.js";

function setup() {
  const s = new McpServer({ name: "test", version: "0.0.0" });
  registerFilterTools(s, makeClient());
  return s;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_get_filters", () => {
  it("returns available filter values", async () => {
    const r = await getTool(setup(), "swetrix_get_filters").handler({ pid: "p1", type: "br" });
    expect(r.content[0].text).toContain("Chrome");
  });
});

describe("swetrix_get_filter_versions", () => {
  it("returns browser versions", async () => {
    const r = await getTool(setup(), "swetrix_get_filter_versions").handler({ pid: "p1", type: "traffic", column: "br" });
    expect(r.content[0].text).toContain("120");
  });
});

describe("swetrix_get_heartbeats", () => {
  it("returns heartbeat data", async () => {
    const r = await getTool(setup(), "swetrix_get_heartbeats").handler({ pids: ["p1"] });
    expect(r.content[0].text).toBeDefined();
  });
});

describe("swetrix_get_keywords", () => {
  it("returns keywords data", async () => {
    const r = await getTool(setup(), "swetrix_get_keywords").handler({ pid: "p1", period: "7d" });
    expect(r.content[0].text).toBeDefined();
  });
});
