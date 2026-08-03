import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { errorHandlers } from "../mocks/handlers.js";
import { makeClient, getTool } from "../helpers.js";
import { registerViewTools } from "../../tools/views.js";

function setup() {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerViewTools(server, makeClient());
  return server;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_list_views", () => {
  it("returns views list", async () => {
    const result = await getTool(setup(), "swetrix_list_views").handler({ pid: "proj1" });
    expect(result.content[0].text).toContain("US Mobile");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("get", "/v1/project/missing/views"));
    const result = await getTool(setup(), "swetrix_list_views").handler({ pid: "missing" });
    expect(result.content[0].text).toContain("404");
  });
});

describe("swetrix_get_view", () => {
  it("returns view details", async () => {
    const result = await getTool(setup(), "swetrix_get_view").handler({ pid: "proj1", viewId: "view1" });
    expect(result.content[0].text).toContain("view1");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("get", "/v1/project/proj1/views/missing"));
    const result = await getTool(setup(), "swetrix_get_view").handler({ pid: "proj1", viewId: "missing" });
    expect(result.content[0].text).toContain("404");
  });
});

describe("swetrix_create_view", () => {
  it("returns created view", async () => {
    const result = await getTool(setup(), "swetrix_create_view").handler({
      pid: "proj1",
      name: "US Mobile",
      type: "traffic",
      filters: [{ column: "cc", filter: "US", isExclusive: false }],
    });
    expect(result.content[0].text).toContain("US Mobile");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("post", "/v1/project/proj1/views"));
    const result = await getTool(setup(), "swetrix_create_view").handler({
      pid: "proj1",
      name: "US Mobile",
      type: "traffic",
      filters: [{ column: "cc", filter: "US", isExclusive: false }],
    });
    expect(result.content[0].text).toContain("401");
  });
});

describe("swetrix_update_view", () => {
  it("returns updated view", async () => {
    const result = await getTool(setup(), "swetrix_update_view").handler({
      pid: "proj1", viewId: "view1", name: "US Mobile v2",
    });
    expect(result.content[0].text).toContain("view1");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("patch", "/v1/project/proj1/views/missing"));
    const result = await getTool(setup(), "swetrix_update_view").handler({
      pid: "proj1", viewId: "missing", name: "US Mobile v2",
    });
    expect(result.content[0].text).toContain("404");
  });
});

describe("swetrix_delete_view", () => {
  it("returns success message", async () => {
    const result = await getTool(setup(), "swetrix_delete_view").handler({ pid: "proj1", viewId: "view1" });
    expect(result.content[0].text).toContain("deleted");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("delete", "/v1/project/proj1/views/missing"));
    const result = await getTool(setup(), "swetrix_delete_view").handler({ pid: "proj1", viewId: "missing" });
    expect(result.content[0].text).toContain("404");
  });
});
