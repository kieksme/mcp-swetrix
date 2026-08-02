import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { errorHandlers } from "../mocks/handlers.js";
import { makeClient, getTool } from "../helpers.js";
import { registerEventTools } from "../../tools/events.js";

function setup() {
  const s = new McpServer({ name: "test", version: "0.0.0" });
  registerEventTools(s, makeClient());
  return s;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_get_event_meta", () => {
  it("returns metadata keys and values", async () => {
    const r = await getTool(setup(), "swetrix_get_event_meta").handler({ pid: "p1", event: "signup", period: "7d" });
    expect(r.content[0].text).toContain("plan");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log/meta"));
    const r = await getTool(setup(), "swetrix_get_event_meta").handler({ pid: "p1", event: "signup", period: "7d" });
    expect(r.content[0].text).toContain("401");
  });
});

describe("swetrix_get_property", () => {
  it("returns property aggregation", async () => {
    const r = await getTool(setup(), "swetrix_get_property").handler({ pid: "p1", property: "author", period: "7d" });
    expect(r.content[0].text).toContain("key");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log/property"));
    const r = await getTool(setup(), "swetrix_get_property").handler({ pid: "p1", property: "author", period: "7d" });
    expect(r.content[0].text).toContain("401");
  });
});

describe("swetrix_get_custom_events", () => {
  it("returns empty array on no events", async () => {
    const r = await getTool(setup(), "swetrix_get_custom_events").handler({ pid: "p1", customEvents: '["signup"]', period: "7d" });
    expect(r.content[0].text).toContain("[]");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log/custom-events"));
    const r = await getTool(setup(), "swetrix_get_custom_events").handler({ pid: "p1", customEvents: '["signup"]', period: "7d" });
    expect(r.content[0].text).toContain("401");
  });
});
