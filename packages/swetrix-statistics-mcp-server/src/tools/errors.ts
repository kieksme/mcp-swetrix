import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { z } from "zod";
import { PaginationSchema } from "../schemas/common.js";
import { formatApiError, truncate } from "../services/api-client.js";
import { CHARACTER_LIMIT } from "../constants.js";

const ErrorQueryBase = z.object({
  pid: z.string().min(1).describe("Project ID"),
  period: z.enum(["1h","today","yesterday","1d","7d","4w","3M","12M","24M","all"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  timezone: z.string().optional(),
});

export function registerErrorTools(server: McpServer, client: AxiosInstance): void {

  server.registerTool(
    "swetrix_get_errors",
    {
      title: "Get Error List",
      description: `Get a paginated list of error groups for a project.

Errors are grouped by name and message. Returns occurrence count per group.

Args:
  - pid: Project ID (required)
  - period / from / to, timezone: Time range
  - take / skip: Pagination (max 150)`,
      inputSchema: ErrorQueryBase.merge(PaginationSchema),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/errors", { params });
        const text = truncate(JSON.stringify(data, null, 2), CHARACTER_LIMIT);
        return { content: [{ type: "text", text }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_error_detail",
    {
      title: "Get Error Detail",
      description: `Get full details of a specific error group by its ID.

Args:
  - pid: Project ID (required)
  - eid: Error group ID (required)`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        eid: z.string().min(1).describe("Error group ID"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/get-error", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_error_overview",
    {
      title: "Get Error Overview Chart",
      description: `Get time-series chart of error occurrences and affected users for a project.

Args:
  - pid: Project ID (required)
  - timeBucket: Time granularity (required)
  - period / from / to, timezone: Time range`,
      inputSchema: ErrorQueryBase.extend({
        timeBucket: z.enum(["minute","hour","day","week","month","year"]),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/error-overview", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_error_sessions",
    {
      title: "Get Error Sessions",
      description: `Get paginated sessions that encountered a specific error.

Args:
  - pid: Project ID (required)
  - eid: Error group ID (required)
  - period / from / to: Time range
  - take / skip: Pagination`,
      inputSchema: ErrorQueryBase.extend({
        eid: z.string().min(1).describe("Error group ID"),
      }).merge(PaginationSchema),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/error-sessions", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_errors_filters",
    {
      title: "Get Error Filter Values",
      description: `Get available filter values for error tracking (e.g. all OS names that have errors).

Args:
  - pid: Project ID (required)
  - type: Filter dimension e.g. 'os', 'br', 'cc', 'dv'`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        type: z.string().min(1).describe("Filter dimension, e.g. 'os', 'br', 'cc', 'dv'"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/errors-filters", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
