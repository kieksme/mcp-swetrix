import axios, { AxiosError, type AxiosInstance } from "axios";
import { SWETRIX_API_BASE_URL, REQUEST_TIMEOUT_MS } from "../constants.js";

export function createApiClient(apiKey: string): AxiosInstance {
  return axios.create({
    baseURL: SWETRIX_API_BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    paramsSerializer: {
      serialize: (params) => Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
          const serializedValue = Array.isArray(value) || typeof value === "object"
            ? JSON.stringify(value)
            : String(value);
          return `${encodeURIComponent(key)}=${encodeURIComponent(serializedValue)}`;
        })
        .join("&"),
    },
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
  });
}

export function formatApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      switch (error.response.status) {
        case 400: {
          const responseMessage = error.response.data?.message;
          return typeof responseMessage === "string" && responseMessage.length > 0
            ? `Error 400: ${responseMessage.slice(0, 300)}`
            : "Error 400: Bad request – check pid, period, timeBucket and filter format.";
        }
        case 401: return "Error 401: Unauthorized – verify your SWETRIX_API_KEY.";
        case 403: return "Error 403: Forbidden – insufficient permissions.";
        case 404: return "Error 404: Not found – check that the project or resource ID exists.";
        case 429: return "Error 429: Rate limit exceeded (600 req/h). Wait before retrying.";
        case 500: return "Error 500: Swetrix server error – retry later.";
        default:  return `Error ${error.response.status}: ${error.response.statusText}`;
      }
    }
    if (error.code === "ECONNABORTED") return "Error: Request timed out.";
  }
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}

export function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + `\n\n[Response truncated at ${limit} chars. Use filters or a shorter period to reduce result size.]`;
}
