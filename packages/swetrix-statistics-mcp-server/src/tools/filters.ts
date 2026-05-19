import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { z } from "zod";
import { FilterColumnSchema } from "../schemas/common.js";
import { formatApiError } from "../services/api-client.js";

export function registerFilterTools(server: McpServer, client: AxiosInstance): void {

  server.registerTool(
    "swetrix_get_filters",
    {
      title: "Get Filter Values",
      description: `Get all available values for a filter dimension (e.g. all browser names in the data).

Use this to discover what values are present before applying filters to other queries.

Args:
  - pid: Project ID (required)
  - type: Dimension column – cc, rg, ct, host, pg, lc, br, brv, os, osv, dv, ref, so, me, ca, te, co (required)`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        type: FilterColumnSchema.describe("Dimension to get values for"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/filters", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_filter_versions",
    {
      title: "Get Browser/OS Versions",
      description: `Get available browser or OS versions for filtering.

Args:
  - pid: Project ID (required)
  - type: Data type – 'traffic' or 'errors' (required)
  - column: 'br' (browser) or 'os' (required)`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        type: z.enum(["traffic", "errors"]).describe("Data type to query versions for"),
        column: z.enum(["br", "os"]).describe("Dimension to get versions for: 'br' (browser) or 'os'"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/filters/versions", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_heartbeats",
    {
      title: "Get Heartbeat Events",
      description: `Get heartbeat event data for one or more projects.

Args:
  - pids: Array of project IDs (required)`,
      inputSchema: z.object({
        pids: z.array(z.string().min(1)).min(1).describe("Array of project IDs"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/hb", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_keywords",
    {
      title: "Get Search Keywords",
      description: `Get Google Search Console keyword data for a project (requires GSC integration).

Args:
  - pid: Project ID (required)
  - period / from / to: Time range`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        period: z.enum(["1h","today","yesterday","1d","7d","4w","3M","12M","24M","all"]).optional(),
        from: z.string().optional(),
        to: z.string().optional(),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/keywords", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
