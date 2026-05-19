import axios, { AxiosError, type AxiosInstance } from "axios";
import { SWETRIX_API_BASE_URL, REQUEST_TIMEOUT_MS } from "../constants.js";

export function createApiClient(apiKey: string): AxiosInstance {
  return axios.create({
    baseURL: SWETRIX_API_BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
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
        case 400:
          return "Error 400: Bad request – check required fields and parameter formats.";
        case 401:
          return "Error 401: Unauthorized – verify your SWETRIX_API_KEY.";
        case 403:
          return "Error 403: Forbidden – insufficient permissions for this operation.";
        case 404:
          return "Error 404: Not found – check that the ID exists.";
        case 429:
          return "Error 429: Rate limit exceeded (600 req/h). Wait before retrying.";
        case 500:
          return "Error 500: Swetrix server error – retry later.";
        default:
          return `Error ${error.response.status}: ${error.response.statusText}`;
      }
    }
    if (error.code === "ECONNABORTED") {
      return "Error: Request timed out. Check network connectivity.";
    }
  }
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
