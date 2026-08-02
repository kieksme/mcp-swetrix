import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { errorHandlers } from "../mocks/handlers.js";
import { makeClient, getTool } from "../helpers.js";
import { registerFunnelTools } from "../../tools/funnels.js";

function setup() {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerFunnelTools(server, makeClient());
  return server;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_list_funnels", () => {
  it("returns funnel list", async () => {
    const result = await getTool(setup(), "swetrix_list_funnels").handler({ pid: "proj1" });
    expect(result.content[0].text).toContain("Sign-up");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("get", "/v1/project/funnels/missing"));
    const result = await getTool(setup(), "swetrix_list_funnels").handler({ pid: "missing" });
    expect(result.content[0].text).toContain("404");
  });
});

describe("swetrix_create_funnel", () => {
  it("returns created funnel", async () => {
    const result = await getTool(setup(), "swetrix_create_funnel").handler({
      pid: "proj1", name: "Sign-up", steps: ["/", "/signup"],
    });
    expect(result.content[0].text).toContain("Sign-up");
  });

  it("returns error on 401", async () => {
    mswServer.use(errorHandlers.unauthorized("post", "/v1/project/funnel"));
    const result = await getTool(setup(), "swetrix_create_funnel").handler({
      pid: "proj1", name: "Sign-up", steps: ["/", "/signup"],
    });
    expect(result.content[0].text).toContain("401");
  });
});

describe("swetrix_update_funnel", () => {
  it("returns updated funnel", async () => {
    const result = await getTool(setup(), "swetrix_update_funnel").handler({
      id: "fun1", pid: "proj1", name: "Sign-up v2",
    });
    expect(result.content[0].text).toContain("fun1");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("patch", "/v1/project/funnel"));
    const result = await getTool(setup(), "swetrix_update_funnel").handler({
      id: "missing", pid: "proj1", name: "Sign-up v2",
    });
    expect(result.content[0].text).toContain("404");
  });
});

describe("swetrix_delete_funnel", () => {
  it("returns success message", async () => {
    const result = await getTool(setup(), "swetrix_delete_funnel").handler({ id: "fun1", pid: "proj1" });
    expect(result.content[0].text).toContain("deleted");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("delete", "/v1/project/funnel/missing/proj1"));
    const result = await getTool(setup(), "swetrix_delete_funnel").handler({ id: "missing", pid: "proj1" });
    expect(result.content[0].text).toContain("404");
  });
});
