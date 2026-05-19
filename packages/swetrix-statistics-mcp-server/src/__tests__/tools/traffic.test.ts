import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { errorHandlers } from "../mocks/handlers.js";
import { makeClient, getTool } from "../helpers.js";
import { registerTrafficTools } from "../../tools/traffic.js";

function setup() {
  const s = new McpServer({ name: "test", version: "0.0.0" });
  registerTrafficTools(s, makeClient());
  return s;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_get_traffic", () => {
  it("returns traffic data containing params and chart", async () => {
    const r = await getTool(setup(), "swetrix_get_traffic").handler({ pid: "p1", timeBucket: "day", period: "7d" });
    expect(r.content[0].text).toContain("params");
    expect(r.content[0].text).toContain("chart");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log"));
    const r = await getTool(setup(), "swetrix_get_traffic").handler({ pid: "p1", timeBucket: "day", period: "7d" });
    expect(r.content[0].text).toContain("401");
  });
});

describe("swetrix_get_traffic_chart", () => {
  it("returns chart data", async () => {
    const r = await getTool(setup(), "swetrix_get_traffic_chart").handler({ pid: "p1", timeBucket: "day", period: "7d" });
    expect(r.content[0].text).toContain("chart");
  });
});

describe("swetrix_get_sessions", () => {
  it("returns sessions list", async () => {
    const r = await getTool(setup(), "swetrix_get_sessions").handler({ pid: "p1", period: "7d" });
    expect(r.content[0].text).toContain("psid");
  });
});

describe("swetrix_get_session_detail", () => {
  it("returns session pages", async () => {
    const r = await getTool(setup(), "swetrix_get_session_detail").handler({ pid: "p1", psid: "s1" });
    expect(r.content[0].text).toContain("pages");
  });
});

describe("swetrix_get_live_visitors", () => {
  it("returns live visitor list", async () => {
    const r = await getTool(setup(), "swetrix_get_live_visitors").handler({ pid: "p1" });
    expect(r.content[0].text).toContain("desktop");
  });
});

describe("swetrix_get_birdseye", () => {
  it("returns period comparison", async () => {
    const r = await getTool(setup(), "swetrix_get_birdseye").handler({ pid: "p1", period: "7d" });
    expect(r.content[0].text).toContain("current");
  });
});
