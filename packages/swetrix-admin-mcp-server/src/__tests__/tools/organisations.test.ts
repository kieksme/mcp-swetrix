import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { makeClient, getTool } from "../helpers.js";
import { registerOrganisationTools } from "../../tools/organisations.js";

function setup() {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerOrganisationTools(server, makeClient());
  return server;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_list_organisations", () => {
  it("returns org list", async () => {
    const result = await getTool(setup(), "swetrix_list_organisations").handler({});
    expect(result.content[0].text).toContain("Acme Corp");
  });
});

describe("swetrix_get_organisation", () => {
  it("returns org details", async () => {
    const result = await getTool(setup(), "swetrix_get_organisation").handler({ orgId: "org1" });
    expect(result.content[0].text).toContain("org1");
  });
});

describe("swetrix_create_organisation", () => {
  it("returns created org with ID", async () => {
    const result = await getTool(setup(), "swetrix_create_organisation").handler({ name: "Acme Corp" });
    expect(result.content[0].text).toContain("Acme Corp");
    expect(result.content[0].text).toContain("org2");
  });
});

describe("swetrix_update_organisation", () => {
  it("returns confirmation", async () => {
    const result = await getTool(setup(), "swetrix_update_organisation").handler({ orgId: "org1", name: "Acme Corp v2" });
    expect(result.content[0].text).toContain("org1");
  });
});

describe("swetrix_delete_organisation", () => {
  it("returns success message", async () => {
    const result = await getTool(setup(), "swetrix_delete_organisation").handler({ orgId: "org1" });
    expect(result.content[0].text).toContain("deleted");
  });
});

describe("swetrix_invite_org_member", () => {
  it("returns confirmation with email and role", async () => {
    const result = await getTool(setup(), "swetrix_invite_org_member").handler({
      orgId: "org1", email: "user@example.com", role: "admin",
    });
    expect(result.content[0].text).toContain("user@example.com");
    expect(result.content[0].text).toContain("admin");
  });
});

describe("swetrix_update_org_member", () => {
  it("returns role update confirmation", async () => {
    const result = await getTool(setup(), "swetrix_update_org_member").handler({ memberId: "mem1", role: "viewer" });
    expect(result.content[0].text).toContain("viewer");
  });
});

describe("swetrix_remove_org_member", () => {
  it("returns success message", async () => {
    const result = await getTool(setup(), "swetrix_remove_org_member").handler({ memberId: "mem1" });
    expect(result.content[0].text).toContain("removed");
  });
});
