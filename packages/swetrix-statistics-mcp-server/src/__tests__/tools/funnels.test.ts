import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { errorHandlers } from "../mocks/handlers.js";
import { makeClient, getTool } from "../helpers.js";
import { registerFunnelTools } from "../../tools/funnels.js";

function setup() {
  const s = new McpServer({ name: "test", version: "0.0.0" });
  registerFunnelTools(s, makeClient());
  return s;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_get_funnel", () => {
  it("returns funnel steps with dropoff", async () => {
    const r = await getTool(setup(), "swetrix_get_funnel").handler({ pid: "p1", pages: ["/", "/signup"], period: "7d" });
    expect(r.content[0].text).toContain("dropoff");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log/funnel"));
    const r = await getTool(setup(), "swetrix_get_funnel").handler({ pid: "p1", pages: ["/", "/signup"], period: "7d" });
    expect(r.content[0].text).toContain("401");
  });
});

describe("swetrix_get_funnel_sessions", () => {
  it("returns sessions for funnel step", async () => {
    const r = await getTool(setup(), "swetrix_get_funnel_sessions").handler({ pid: "p1", funnelId: "f1", step: 1, period: "7d" });
    expect(r.content[0].text).toContain("psid");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log/funnel-sessions"));
    const r = await getTool(setup(), "swetrix_get_funnel_sessions").handler({ pid: "p1", funnelId: "f1", step: 1, period: "7d" });
    expect(r.content[0].text).toContain("401");
  });
});

describe("swetrix_get_user_flow", () => {
  it("returns nodes and edges", async () => {
    const r = await getTool(setup(), "swetrix_get_user_flow").handler({ pid: "p1", timeBucket: "day", period: "7d" });
    expect(r.content[0].text).toContain("nodes");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log/user-flow"));
    const r = await getTool(setup(), "swetrix_get_user_flow").handler({ pid: "p1", timeBucket: "day", period: "7d" });
    expect(r.content[0].text).toContain("401");
  });
});
