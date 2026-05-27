const DEFAULT_SWETRIX_API_BASE_URL = "https://api.swetrix.com";

export const SWETRIX_API_BASE_URL = (
  process.env.SWETRIX_API_BASE_URL ?? DEFAULT_SWETRIX_API_BASE_URL
).trim().replace(/\/+$/, "");
export const REQUEST_TIMEOUT_MS = 10_000;
