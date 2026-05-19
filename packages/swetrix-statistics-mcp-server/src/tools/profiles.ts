import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { z } from "zod";
import { PaginationSchema } from "../schemas/common.js";
import { formatApiError, truncate } from "../services/api-client.js";
import { CHARACTER_LIMIT } from "../constants.js";

export function registerProfileTools(server: McpServer, client: AxiosInstance): void {

  server.registerTool(
    "swetrix_get_profiles",
    {
      title: "Get Visitor Profiles",
      description: `Get a paginated list of visitor profiles for a project.

Args:
  - pid: Project ID (required)
  - profileType: 'all' (default), 'anonymous', or 'identified'
  - take / skip: Pagination (max 150)`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        profileType: z.enum(["all", "anonymous", "identified"]).optional()
          .describe("Filter by profile type (default: all)"),
      }).merge(PaginationSchema),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/profiles", { params });
        const text = truncate(JSON.stringify(data, null, 2), CHARACTER_LIMIT);
        return { content: [{ type: "text", text }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_profile_detail",
    {
      title: "Get Visitor Profile Detail",
      description: `Get full details of a single visitor profile.

Args:
  - pid: Project ID (required)
  - profileId: Visitor profile ID (required)`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        profileId: z.string().min(1).describe("Visitor profile ID"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/profile", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_profile_sessions",
    {
      title: "Get Profile Sessions",
      description: `Get paginated sessions belonging to a specific visitor profile.

Args:
  - pid: Project ID (required)
  - profileId: Visitor profile ID (required)
  - take / skip: Pagination`,
      inputSchema: z.object({
        pid: z.string().min(1).describe("Project ID"),
        profileId: z.string().min(1).describe("Visitor profile ID"),
      }).merge(PaginationSchema),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/profile/sessions", { params });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
