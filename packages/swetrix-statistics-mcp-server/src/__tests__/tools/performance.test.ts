import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { makeClient, getTool } from "../helpers.js";
import { registerPerformanceTools } from "../../tools/performance.js";

function setup() {
  const s = new McpServer({ name: "test", version: "0.0.0" });
  registerPerformanceTools(s, makeClient());
  return s;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_get_performance", () => {
  it("returns performance data", async () => {
    const r = await getTool(setup(), "swetrix_get_performance").handler({ pid: "p1", timeBucket: "day", period: "7d" });
    expect(r.content[0].text).toContain("chart");
  });
});

describe("swetrix_get_performance_chart", () => {
  it("returns chart data", async () => {
    const r = await getTool(setup(), "swetrix_get_performance_chart").handler({ pid: "p1", timeBucket: "day", period: "7d" });
    expect(r.content[0].text).toContain("chart");
  });
});

describe("swetrix_get_performance_birdseye", () => {
  it("returns birdseye data", async () => {
    const r = await getTool(setup(), "swetrix_get_performance_birdseye").handler({ pids: ["p1"], period: "7d" });
    expect(r.content[0].text).toContain("current");
  });
});
