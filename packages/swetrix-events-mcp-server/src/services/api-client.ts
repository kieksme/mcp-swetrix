import axios, { AxiosError, type AxiosInstance } from "axios";
import { SWETRIX_API_BASE_URL, REQUEST_TIMEOUT_MS } from "../constants.js";

export function createPublicClient(): AxiosInstance {
  return axios.create({
    baseURL: SWETRIX_API_BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: { "Content-Type": "application/json" },
  });
}

export function createAuthenticatedClient(apiKey: string): AxiosInstance {
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
          return "Error 400: Bad request – check pid, missing fields, or project is disabled.";
        case 402:
          return "Error 402: Subscription expired or event quota exceeded.";
        case 403:
          return "Error 403: Forbidden – event already counted as unique, or missing revenue permissions.";
        case 429:
          return "Error 429: Rate limit exceeded. Wait before retrying.";
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
