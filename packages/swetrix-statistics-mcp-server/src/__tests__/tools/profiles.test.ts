import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { errorHandlers } from "../mocks/handlers.js";
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

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log/profiles"));
    const r = await getTool(setup(), "swetrix_get_profiles").handler({ pid: "p1" });
    expect(r.content[0].text).toContain("401");
  });
});

describe("swetrix_get_profile_detail", () => {
  it("returns profile details", async () => {
    const r = await getTool(setup(), "swetrix_get_profile_detail").handler({ pid: "p1", profileId: "p1" });
    expect(r.content[0].text).toContain("p1");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("/v1/log/profile"));
    const r = await getTool(setup(), "swetrix_get_profile_detail").handler({ pid: "p1", profileId: "missing" });
    expect(r.content[0].text).toContain("404");
  });
});

describe("swetrix_get_profile_sessions", () => {
  it("returns sessions for profile", async () => {
    const r = await getTool(setup(), "swetrix_get_profile_sessions").handler({ pid: "p1", profileId: "p1" });
    expect(r.content[0].text).toContain("psid");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("/v1/log/profile/sessions"));
    const r = await getTool(setup(), "swetrix_get_profile_sessions").handler({ pid: "p1", profileId: "missing" });
    expect(r.content[0].text).toContain("404");
  });
});
