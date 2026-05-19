import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { errorHandlers } from "../mocks/handlers.js";
import { makeClient, getTool } from "../helpers.js";
import { registerProjectTools } from "../../tools/projects.js";

function setup() {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerProjectTools(server, makeClient());
  return server;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_list_projects", () => {
  it("returns project list", async () => {
    const result = await getTool(setup(), "swetrix_list_projects").handler({});
    expect(result.content[0].text).toContain("My Project");
  });
});

describe("swetrix_get_project", () => {
  it("returns project details", async () => {
    const result = await getTool(setup(), "swetrix_get_project").handler({ id: "proj1" });
    expect(result.content[0].text).toContain("proj1");
  });

  it("returns error on 404", async () => {
    mswServer.use(errorHandlers.notFound("get", "/v1/project/missing"));
    const result = await getTool(setup(), "swetrix_get_project").handler({ id: "missing" });
    expect(result.content[0].text).toContain("404");
  });
});

describe("swetrix_create_project", () => {
  it("returns created project with ID", async () => {
    const result = await getTool(setup(), "swetrix_create_project").handler({ name: "My Project" });
    expect(result.content[0].text).toContain("proj1");
    expect(result.content[0].text).toContain("My Project");
  });
});

describe("swetrix_update_project", () => {
  it("returns updated project", async () => {
    const result = await getTool(setup(), "swetrix_update_project").handler({ id: "proj1", name: "Updated" });
    expect(result.content[0].text).toContain("proj1");
  });
});

describe("swetrix_delete_project", () => {
  it("returns success message", async () => {
    const result = await getTool(setup(), "swetrix_delete_project").handler({ id: "proj1" });
    expect(result.content[0].text).toContain("deleted");
  });
});

describe("swetrix_pin_project / swetrix_unpin_project", () => {
  it("pin returns confirmation", async () => {
    const result = await getTool(setup(), "swetrix_pin_project").handler({ id: "proj1" });
    expect(result.content[0].text).toContain("pinned");
  });

  it("unpin returns confirmation", async () => {
    const result = await getTool(setup(), "swetrix_unpin_project").handler({ id: "proj1" });
    expect(result.content[0].text).toContain("unpinned");
  });
});

describe("swetrix_assign_project_org", () => {
  it("returns confirmation", async () => {
    const result = await getTool(setup(), "swetrix_assign_project_org").handler({ id: "proj1", organisationId: "org1" });
    expect(result.content[0].text).toContain("org1");
  });
});
