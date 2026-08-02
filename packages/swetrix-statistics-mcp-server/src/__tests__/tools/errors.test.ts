import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { errorHandlers } from "../mocks/handlers.js";
import { makeClient, getTool } from "../helpers.js";
import { registerErrorTools } from "../../tools/errors.js";

function setup() {
  const s = new McpServer({ name: "test", version: "0.0.0" });
  registerErrorTools(s, makeClient());
  return s;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_get_errors", () => {
  it("returns error list", async () => {
    const r = await getTool(setup(), "swetrix_get_errors").handler({ pid: "p1", period: "7d" });
    expect(r.content[0].text).toContain("TypeError");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log/errors"));
    const r = await getTool(setup(), "swetrix_get_errors").handler({ pid: "p1", period: "7d" });
    expect(r.content[0].text).toContain("401");
  });
});

describe("swetrix_get_error_detail", () => {
  it("returns single error details", async () => {
    const r = await getTool(setup(), "swetrix_get_error_detail").handler({ pid: "p1", eid: "e1" });
    expect(r.content[0].text).toContain("e1");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("/v1/log/get-error"));
    const r = await getTool(setup(), "swetrix_get_error_detail").handler({ pid: "p1", eid: "missing" });
    expect(r.content[0].text).toContain("404");
  });
});

describe("swetrix_get_error_overview", () => {
  it("returns chart data", async () => {
    const r = await getTool(setup(), "swetrix_get_error_overview").handler({ pid: "p1", timeBucket: "day", period: "7d" });
    expect(r.content[0].text).toContain("chart");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log/error-overview"));
    const r = await getTool(setup(), "swetrix_get_error_overview").handler({ pid: "p1", timeBucket: "day", period: "7d" });
    expect(r.content[0].text).toContain("401");
  });
});

describe("swetrix_get_error_sessions", () => {
  it("returns sessions affected by error", async () => {
    const r = await getTool(setup(), "swetrix_get_error_sessions").handler({ pid: "p1", eid: "e1", period: "7d" });
    expect(r.content[0].text).toContain("psid");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("/v1/log/error-sessions"));
    const r = await getTool(setup(), "swetrix_get_error_sessions").handler({ pid: "p1", eid: "missing", period: "7d" });
    expect(r.content[0].text).toContain("404");
  });
});

describe("swetrix_get_errors_filters", () => {
  it("returns available filter values", async () => {
    const r = await getTool(setup(), "swetrix_get_errors_filters").handler({ pid: "p1", type: "os" });
    expect(r.content[0].text).toContain("Chrome");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("/v1/log/errors-filters"));
    const r = await getTool(setup(), "swetrix_get_errors_filters").handler({ pid: "p1", type: "os" });
    expect(r.content[0].text).toContain("401");
  });
});
