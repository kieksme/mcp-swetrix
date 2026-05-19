import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mswServer } from "../mocks/server.js";
import { makeClient, getTool } from "../helpers.js";
import { registerAnnotationTools } from "../../tools/annotations.js";

function setup() {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerAnnotationTools(server, makeClient());
  return server;
}

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

describe("swetrix_list_annotations", () => {
  it("returns annotations list", async () => {
    const result = await getTool(setup(), "swetrix_list_annotations").handler({ pid: "proj1" });
    expect(result.content[0].text).toContain("Launch");
  });
});

describe("swetrix_create_annotation", () => {
  it("returns created annotation with date", async () => {
    const result = await getTool(setup(), "swetrix_create_annotation").handler({
      pid: "proj1", date: "2024-06-01", text: "Launch",
    });
    expect(result.content[0].text).toContain("2024-06-01");
  });
});

describe("swetrix_update_annotation", () => {
  it("returns updated annotation", async () => {
    const result = await getTool(setup(), "swetrix_update_annotation").handler({
      id: "ann1", pid: "proj1", text: "Launch v2",
    });
    expect(result.content[0].text).toContain("ann1");
  });
});

describe("swetrix_delete_annotation", () => {
  it("returns success message", async () => {
    const result = await getTool(setup(), "swetrix_delete_annotation").handler({ id: "ann1", pid: "proj1" });
    expect(result.content[0].text).toContain("deleted");
  });
});
