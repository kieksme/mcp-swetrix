import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { z } from "zod";
import { BaseQuerySchema, PaginationSchema } from "../schemas/common.js";
import { formatApiError } from "../services/api-client.js";

export function registerFunnelTools(server: McpServer, client: AxiosInstance): void {

  server.registerTool(
    "swetrix_get_funnel",
    {
      title: "Get Funnel Analysis",
      description: `Get conversion funnel data showing drop-off between page steps.

Returns per step: page path, visitor count, dropoff count, and dropoff percentage.

Args:
  - pid: Project ID (required)
  - pages: Ordered array of page paths e.g. ['/', '/pricing', '/signup'] – OR –
  - funnelId: ID of a saved funnel (use instead of pages)
  - period / from / to, timezone, filters: Standard options`,
      inputSchema: BaseQuerySchema.extend({
        pages: z.array(z.string()).min(2).optional().describe("Ordered page paths for the funnel"),
        funnelId: z.string().optional().describe("Saved funnel ID (alternative to pages)"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/funnel", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_funnel_sessions",
    {
      title: "Get Funnel Sessions",
      description: `Get paginated sessions that reached a specific step of a funnel.

Args:
  - pid: Project ID (required)
  - funnelId: Saved funnel ID (required)
  - step: Funnel step number, 1-indexed (required)
  - period / from / to: Time range
  - take / skip: Pagination`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        funnelId: z.string().min(1).describe("Saved funnel ID"),
        step: z.number().int().min(1).describe("Funnel step number (1-indexed)"),
        period: z.enum(["1h","today","yesterday","1d","7d","4w","3M","12M","24M","all"]).optional(),
        from: z.string().optional(),
        to: z.string().optional(),
      }).merge(PaginationSchema),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/funnel-sessions", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_user_flow",
    {
      title: "Get User Flow",
      description: `Get navigation flow diagram data showing how users move between pages.

Returns nodes and edges representing the most common navigation paths.
Args same as swetrix_get_traffic (pid, timeBucket, period/from/to, filters).`,
      inputSchema: BaseQuerySchema.extend({
        timeBucket: z.enum(["minute","hour","day","week","month","year"]),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/user-flow", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
