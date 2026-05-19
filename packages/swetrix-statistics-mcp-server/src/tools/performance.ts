import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { z } from "zod";
import { TrafficQuerySchema, MeasureSchema } from "../schemas/common.js";
import { formatApiError, truncate } from "../services/api-client.js";
import { CHARACTER_LIMIT } from "../constants.js";

const PerfQuerySchema = TrafficQuerySchema.extend({
  measure: MeasureSchema.optional(),
});

export function registerPerformanceTools(server: McpServer, client: AxiosInstance): void {

  server.registerTool(
    "swetrix_get_performance",
    {
      title: "Get Performance Metrics",
      description: `Get Web Vitals and performance metrics for a project.

Returns dns, tls, conn, response, render, domLoad, ttfb values (in seconds) aggregated by the chosen measure.

Args:
  - pid, timeBucket, period/from/to, timezone, filters: Standard query args
  - measure: 'median' (default), 'average', 'p95', or 'quantiles' (returns p50/p75/p95)`,
      inputSchema: PerfQuerySchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/performance", { params });
        const text = truncate(JSON.stringify(data, null, 2), CHARACTER_LIMIT);
        return { content: [{ type: "text", text }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_performance_chart",
    {
      title: "Get Performance Chart",
      description: `Get time-series performance data only (no dimension breakdowns).

Values are in seconds. Args same as swetrix_get_performance.`,
      inputSchema: PerfQuerySchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/performance/chart", { params });
        const text = truncate(JSON.stringify(data, null, 2), CHARACTER_LIMIT);
        return { content: [{ type: "text", text }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_performance_birdseye",
    {
      title: "Get Performance Birdseye",
      description: `Get a period-over-period performance summary for one or more projects.

Returns frontend, backend and network metrics with current/previous/change values.

Args:
  - pids: Array of project IDs (required)
  - period / from / to, timezone, filters: Standard options`,
      inputSchema: z.object({
        pids: z.array(z.string().min(1)).min(1).describe("One or more project IDs"),
        period: z.enum(["1h","today","yesterday","1d","7d","4w","3M","12M","24M","all"]).optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        timezone: z.string().optional(),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/performance/birdseye", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
