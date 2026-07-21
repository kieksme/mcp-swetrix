import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { AddressInfo } from "node:net";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { startHttpTransport } from "../http-transport.js";

const AUTH_TOKEN = "test-token";
const ENDPOINT = "/mcp";

let baseUrl: string;
let httpServer: Awaited<ReturnType<typeof startHttpTransport>>;

beforeAll(async () => {
  const buildServer = () => new McpServer({ name: "test", version: "0.0.0" });
  httpServer = await startHttpTransport(buildServer, { port: 0, endpoint: ENDPOINT, authToken: AUTH_TOKEN });
  const { port } = httpServer.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(() => {
  return new Promise<void>((resolve) => httpServer.close(() => resolve()));
});

describe("authentication", () => {
  it("rejects requests without an Authorization header", async () => {
    const res = await fetch(`${baseUrl}${ENDPOINT}`, { method: "POST", body: "{}" });
    expect(res.status).toBe(401);
  });

  it("rejects requests with an incorrect bearer token", async () => {
    const res = await fetch(`${baseUrl}${ENDPOINT}`, {
      method: "POST",
      headers: { Authorization: "Bearer wrong-token" },
      body: "{}",
    });
    expect(res.status).toBe(401);
  });

  it("rejects unknown paths without a valid token too", async () => {
    const res = await fetch(`${baseUrl}/unknown`);
    expect(res.status).toBe(401);
  });
});

describe("with a valid bearer token", () => {
  function authedFetch(path: string, init?: RequestInit) {
    return fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { ...init?.headers, Authorization: `Bearer ${AUTH_TOKEN}` },
    });
  }

  it("returns 404 for an unknown path", async () => {
    const res = await authedFetch("/unknown");
    expect(res.status).toBe(404);
  });

  it("handles a valid initialize request", async () => {
    const res = await authedFetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test-client", version: "0.0.0" },
        },
      }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as { result?: { serverInfo?: { name: string } } };
    expect(body.result?.serverInfo?.name).toBe("test");
  });

  function initializeRequest() {
    return authedFetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test-client", version: "0.0.0" },
        },
      }),
    });
  }

  // Regression test: a single shared McpServer can't call connect() twice —
  // the SDK throws "Already connected to a transport" once a second request
  // arrives, so the transport must build a fresh McpServer per request.
  it("handles two sequential initialize requests on the same running server", async () => {
    const first = await initializeRequest();
    expect(first.status).toBe(200);

    const second = await initializeRequest();
    expect(second.status).toBe(200);
  });

  it("handles concurrent initialize requests on the same running server", async () => {
    const responses = await Promise.all([initializeRequest(), initializeRequest(), initializeRequest()]);
    for (const res of responses) {
      expect(res.status).toBe(200);
    }
  });
});
