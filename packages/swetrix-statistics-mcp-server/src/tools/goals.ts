import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { z } from "zod";
import { PaginationSchema } from "../schemas/common.js";
import { formatApiError } from "../services/api-client.js";

const GoalQueryBase = z.object({
  period: z.enum(["1h","today","yesterday","1d","7d","4w","3M","12M","24M","all"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  timezone: z.string().optional(),
});

export function registerGoalTools(server: McpServer, client: AxiosInstance): void {

  server.registerTool(
    "swetrix_get_goal_stats",
    {
      title: "Get Goal Statistics",
      description: `Get conversion statistics for a goal (conversions, rates, trends).

Args:
  - goalId: Goal ID (required)
  - period / from / to, timezone: Time range`,
      inputSchema: GoalQueryBase.extend({
        goalId: z.string().min(1).describe("Goal ID"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ goalId, ...params }) => {
      try {
        const { data } = await client.get(`/goal/${goalId}/stats`, { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_goal_chart",
    {
      title: "Get Goal Chart",
      description: `Get time-series chart data for a goal.

Args:
  - goalId: Goal ID (required)
  - timeBucket: Time granularity (required)
  - period / from / to, timezone: Time range`,
      inputSchema: GoalQueryBase.extend({
        goalId: z.string().min(1).describe("Goal ID"),
        timeBucket: z.enum(["minute","hour","day","week","month","year"]),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ goalId, ...params }) => {
      try {
        const { data } = await client.get(`/goal/${goalId}/chart`, { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_feature_flag_stats",
    {
      title: "Get Feature Flag Statistics",
      description: `Get evaluation statistics for a feature flag (true/false counts per period).

Args:
  - flagId: Feature flag ID (required)
  - period / from / to, timezone: Time range`,
      inputSchema: GoalQueryBase.extend({
        flagId: z.string().min(1).describe("Feature flag ID"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ flagId, ...params }) => {
      try {
        const { data } = await client.get(`/v1/feature-flag/${flagId}/stats`, { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_feature_flag_profiles",
    {
      title: "Get Feature Flag Profiles",
      description: `Get visitor profiles that evaluated a specific feature flag.

Args:
  - flagId: Feature flag ID (required)
  - period / from / to: Time range
  - take / skip: Pagination`,
      inputSchema: GoalQueryBase.extend({
        flagId: z.string().min(1).describe("Feature flag ID"),
      }).merge(PaginationSchema),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ flagId, ...params }) => {
      try {
        const { data } = await client.get(`/v1/feature-flag/${flagId}/profiles`, { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_captcha",
    {
      title: "Get CAPTCHA Statistics",
      description: `Get CAPTCHA completion statistics for a CAPTCHA project.

Args:
  - pid: CAPTCHA project ID (required)
  - period / from / to, timezone: Time range`,
      inputSchema: GoalQueryBase.extend({
        pid: z.string().min(1).describe("CAPTCHA project ID"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/captcha", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
