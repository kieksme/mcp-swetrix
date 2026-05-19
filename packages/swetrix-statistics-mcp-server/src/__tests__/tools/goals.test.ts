import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { makeClient, getTool } from "../helpers.js";
import { registerGoalTools } from "../../tools/goals.js";

function setup() {
  const s = new McpServer({ name: "test", version: "0.0.0" });
  registerGoalTools(s, makeClient());
  return s;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_get_goal_stats", () => {
  it("returns conversion stats", async () => {
    const r = await getTool(setup(), "swetrix_get_goal_stats").handler({ goalId: "g1", period: "7d" });
    expect(r.content[0].text).toContain("conversions");
  });
});

describe("swetrix_get_goal_chart", () => {
  it("returns chart data", async () => {
    const r = await getTool(setup(), "swetrix_get_goal_chart").handler({ goalId: "g1", timeBucket: "day", period: "7d" });
    expect(r.content[0].text).toContain("chart");
  });
});

describe("swetrix_get_feature_flag_stats", () => {
  it("returns true/false counts", async () => {
    const r = await getTool(setup(), "swetrix_get_feature_flag_stats").handler({ flagId: "ff1", period: "7d" });
    expect(r.content[0].text).toContain("trueCount");
  });
});

describe("swetrix_get_feature_flag_profiles", () => {
  it("returns profiles for flag", async () => {
    const r = await getTool(setup(), "swetrix_get_feature_flag_profiles").handler({ flagId: "ff1", period: "7d" });
    expect(r.content[0].text).toContain("identified");
  });
});

describe("swetrix_get_captcha", () => {
  it("returns captcha stats", async () => {
    const r = await getTool(setup(), "swetrix_get_captcha").handler({ pid: "p1", period: "7d" });
    expect(r.content[0].text).toContain("count");
  });
});
