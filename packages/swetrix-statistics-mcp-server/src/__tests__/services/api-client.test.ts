import { describe, it, expect } from "vitest";
import { formatApiError, truncate } from "../../services/api-client.js";
import { AxiosError } from "axios";

function makeAxiosError(status: number): AxiosError {
  const err = new AxiosError("Request failed");
  err.response = { status, statusText: "Error", data: {}, headers: {}, config: {} } as AxiosError["response"];
  return err;
}

describe("formatApiError", () => {
  it("formats 400", () => expect(formatApiError(makeAxiosError(400))).toContain("400"));
  it("formats 401", () => expect(formatApiError(makeAxiosError(401))).toContain("401"));
  it("formats 404", () => expect(formatApiError(makeAxiosError(404))).toContain("404"));
  it("formats 429", () => expect(formatApiError(makeAxiosError(429))).toContain("429"));
  it("formats generic Error", () => expect(formatApiError(new Error("boom"))).toContain("boom"));
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
