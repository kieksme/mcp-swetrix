const DEFAULT_SWETRIX_API_BASE_URL = "https://api.swetrix.com";

export const SWETRIX_API_BASE_URL = (
  process.env.SWETRIX_API_BASE_URL ?? DEFAULT_SWETRIX_API_BASE_URL
).trim().replace(/\/+$/, "");
export const REQUEST_TIMEOUT_MS = 10_000;

export const MCP_TRANSPORT = (process.env.MCP_TRANSPORT ?? "stdio").trim().toLowerCase();
export const HTTP_PORT = Number(process.env.PORT ?? 3000);
export const HTTP_ENDPOINT = process.env.MCP_HTTP_ENDPOINT ?? "/mcp";
export const HTTP_AUTH_TOKEN = process.env.MCP_HTTP_AUTH_TOKEN;
