import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { z } from "zod";
import { TrafficQuerySchema, ChartQuerySchema, PaginationSchema } from "../schemas/common.js";
import { formatApiError, truncate } from "../services/api-client.js";
import { CHARACTER_LIMIT } from "../constants.js";

export function registerTrafficTools(server: McpServer, client: AxiosInstance): void {

  server.registerTool(
    "swetrix_get_traffic",
    {
      title: "Get Traffic Analytics",
      description: `Get aggregated traffic analytics data for a project (equivalent to the main dashboard view).

Returns params (geographic/device/browser breakdowns), chart (time-series), custom events and properties.

Args:
  - pid: Project ID (required)
  - timeBucket: Time granularity – minute, hour, day, week, month, year (required)
  - period: Predefined range e.g. '7d', '4w', '3M' (use instead of from/to)
  - from/to: Custom date range in YYYY-MM-DD (both required if used)
  - timezone: IANA timezone e.g. 'Europe/Berlin'
  - filters: Array of dimension filters
  - mode: 'periodic' (default) or 'cumulative'
  - metrics: Up to 3 custom event metrics`,
      inputSchema: TrafficQuerySchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log", { params });
        const text = truncate(JSON.stringify(data, null, 2), CHARACTER_LIMIT);
        return { content: [{ type: "text", text }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_traffic_chart",
    {
      title: "Get Traffic Chart",
      description: `Get time-series chart data only (visits, uniques, session duration) for a project.

Lighter than swetrix_get_traffic – returns only the chart array without dimension breakdowns.

Args: same as swetrix_get_traffic`,
      inputSchema: TrafficQuerySchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/chart", { params });
        const text = truncate(JSON.stringify(data, null, 2), CHARACTER_LIMIT);
        return { content: [{ type: "text", text }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_sessions",
    {
      title: "Get Sessions",
      description: `Get a paginated list of sessions for a project.

Returns: psid, cc (country), os, br (browser), pageviews, sessionStart, lastActivity, isLive, sdur (duration).

Args:
  - pid: Project ID (required)
  - period / from / to: Time range
  - filters: Dimension filters
  - take: Results per page (max 150, default 30)
  - skip: Pagination offset`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        period: z.enum(["1h","today","yesterday","1d","7d","4w","3M","12M","24M","all"]).optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        filters: z.array(z.object({
          column: z.string(), filter: z.string(), isExclusive: z.boolean(),
        })).optional(),
      }).merge(PaginationSchema),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/sessions", { params });
        const text = truncate(JSON.stringify(data, null, 2), CHARACTER_LIMIT);
        return { content: [{ type: "text", text }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_session_detail",
    {
      title: "Get Session Detail",
      description: `Get the full activity log for a single session.

Returns an ordered list of pageviews and events with timestamps and metadata.

Args:
  - pid: Project ID (required)
  - psid: Session ID (required)`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        psid: z.string().min(1).describe("Session ID (psid)"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/session", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_live_visitors",
    {
      title: "Get Live Visitors",
      description: `Get currently active visitors for a project.

Returns one entry per live visitor: dv (device), br (browser), os, cc (country), psid (session ID).

Args:
  - pid: Project ID (required)`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ pid }) => {
      try {
        const { data } = await client.get("/v1/log/live-visitors", { params: { pid } });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_birdseye",
    {
      title: "Get Birdseye Overview",
      description: `Get a period-over-period summary for one or more projects.

Returns pageviews, unique visitors, bounce rate and session duration with current, previous and change values.

Args:
  - pid: Single project ID
  - pids: Array of project IDs (use instead of pid for multi-project)
  - period / from / to: Time range
  - timezone, filters: Standard options`,
      inputSchema: z.object({
        pid: z.string().optional().describe("Single project ID"),
        pids: z.array(z.string()).optional().describe("Multiple project IDs"),
        period: z.enum(["1h","today","yesterday","1d","7d","4w","3M","12M","24M","all"]).optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        timezone: z.string().optional(),
        filters: z.array(z.object({ column: z.string(), filter: z.string(), isExclusive: z.boolean() })).optional(),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/birdseye", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
