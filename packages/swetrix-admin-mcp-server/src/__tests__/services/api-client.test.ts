import { describe, it, expect } from "vitest";
import { formatApiError } from "../../services/api-client.js";
import { AxiosError } from "axios";

function makeAxiosError(status: number): AxiosError {
  const err = new AxiosError("Request failed");
  err.response = { status, statusText: "Error", data: {}, headers: {}, config: {} } as AxiosError["response"];
  return err;
}

describe("formatApiError", () => {
  it("formats 400", () => expect(formatApiError(makeAxiosError(400))).toContain("400"));
  it("formats 401", () => expect(formatApiError(makeAxiosError(401))).toContain("401"));
  it("formats 403", () => expect(formatApiError(makeAxiosError(403))).toContain("403"));
  it("formats 404", () => expect(formatApiError(makeAxiosError(404))).toContain("404"));
  it("formats 429", () => expect(formatApiError(makeAxiosError(429))).toContain("429"));
  it("formats 500", () => expect(formatApiError(makeAxiosError(500))).toContain("500"));
  it("formats generic Error", () => expect(formatApiError(new Error("boom"))).toContain("boom"));
});
