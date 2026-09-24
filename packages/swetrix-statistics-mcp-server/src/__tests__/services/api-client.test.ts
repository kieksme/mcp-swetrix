import { describe, it, expect } from "vitest";
import { createApiClient, formatApiError, truncate } from "../../services/api-client.js";
import { AxiosError } from "axios";

function makeAxiosError(status: number): AxiosError {
  const err = new AxiosError("Request failed");
  err.response = { status, statusText: "Error", data: {}, headers: {}, config: {} } as AxiosError["response"];
  return err;
}

describe("formatApiError", () => {
  it("formats 400", () => expect(formatApiError(makeAxiosError(400))).toContain("400"));
  it("includes the API's 400 message", () => {
    const err = makeAxiosError(400);
    err.response!.data = { message: "timeBucket should not be empty" };
    expect(formatApiError(err)).toContain("timeBucket should not be empty");
  });
  it("formats 401", () => expect(formatApiError(makeAxiosError(401))).toContain("401"));
  it("formats 403", () => expect(formatApiError(makeAxiosError(403))).toContain("403"));
  it("formats 404", () => expect(formatApiError(makeAxiosError(404))).toContain("404"));
  it("formats 429", () => expect(formatApiError(makeAxiosError(429))).toContain("429"));
  it("formats 500", () => expect(formatApiError(makeAxiosError(500))).toContain("500"));

  it("formats an unmapped status using the response statusText", () => {
    expect(formatApiError(makeAxiosError(418))).toContain("418");
  });

  it("formats a timed-out request", () => {
    const err = new AxiosError("timeout of 30000ms exceeded");
    err.code = "ECONNABORTED";
    expect(formatApiError(err)).toContain("timed out");
  });

  it("formats generic Error", () => expect(formatApiError(new Error("boom"))).toContain("boom"));
  it("formats a non-Error thrown value", () => expect(formatApiError("boom")).toContain("boom"));
});

describe("createApiClient query serialization", () => {
  it("serializes arrays and nested filters as JSON query values", () => {
    const client = createApiClient("test-key");
    const url = new URL(client.getUri({
      url: "/v1/log/birdseye",
      params: {
        pids: ["p1", "p2"],
        filters: [{ column: "cc", filter: "DE", isExclusive: true }],
      },
    }));

    expect(url.searchParams.get("pids")).toBe('["p1","p2"]');
    expect(url.searchParams.get("filters")).toBe('[{"column":"cc","filter":"DE","isExclusive":true}]');
    expect(url.searchParams.has("pids[]")).toBe(false);
  });
});

describe("truncate", () => {
  it("returns text as-is when under limit", () => {
    expect(truncate("hello", 100)).toBe("hello");
  });
  it("truncates and appends message when over limit", () => {
    const result = truncate("a".repeat(200), 100);
    expect(result.length).toBeGreaterThan(100);
    expect(result).toContain("truncated");
  });
});
