import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { makeClient, getTool } from "../helpers.js";
import { registerProfileTools } from "../../tools/profiles.js";

function setup() {
  const s = new McpServer({ name: "test", version: "0.0.0" });
  registerProfileTools(s, makeClient());
  return s;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_get_profiles", () => {
  it("returns profile list", async () => {
    const r = await getTool(setup(), "swetrix_get_profiles").handler({ pid: "p1" });
    expect(r.content[0].text).toContain("identified");
  });
});

describe("swetrix_get_profile_detail", () => {
  it("returns profile details", async () => {
    const r = await getTool(setup(), "swetrix_get_profile_detail").handler({ pid: "p1", profileId: "p1" });
    expect(r.content[0].text).toContain("p1");
  });
});

describe("swetrix_get_profile_sessions", () => {
  it("returns sessions for profile", async () => {
    const r = await getTool(setup(), "swetrix_get_profile_sessions").handler({ pid: "p1", profileId: "p1" });
    expect(r.content[0].text).toContain("psid");
  });
});
