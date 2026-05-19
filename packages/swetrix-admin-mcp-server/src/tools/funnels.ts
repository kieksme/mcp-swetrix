import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import {
  ListFunnelsSchema,
  CreateFunnelSchema,
  UpdateFunnelSchema,
  DeleteFunnelSchema,
} from "../schemas/funnel.js";
import { formatApiError } from "../services/api-client.js";

export function registerFunnelTools(server: McpServer, client: AxiosInstance): void {
  server.registerTool(
    "swetrix_list_funnels",
    {
      title: "List Funnels",
      description: "List all conversion funnels defined for a Swetrix project.",
      inputSchema: ListFunnelsSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ pid }) => {
      try {
        const { data } = await client.get(`/v1/project/funnels/${pid}`);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_create_funnel",
    {
      title: "Create Funnel",
      description: `Create a new conversion funnel for a Swetrix project.

Args:
  - pid (string): Project ID (required)
  - name (string): Funnel name, max 50 characters (required)
  - steps (string[]): Ordered page paths – minimum 2, e.g. ['/', '/signup', '/dashboard'] (required)

Returns the created funnel object.`,
      inputSchema: CreateFunnelSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.post("/v1/project/funnel", params);
        return {
          content: [{ type: "text", text: `Funnel '${params.name}' created.\n\n${JSON.stringify(data, null, 2)}` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_update_funnel",
    {
      title: "Update Funnel",
      description: "Update an existing conversion funnel's name or steps.",
      inputSchema: UpdateFunnelSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.patch("/v1/project/funnel", params);
        return {
          content: [{ type: "text", text: `Funnel ${params.id} updated.\n\n${JSON.stringify(data, null, 2)}` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_delete_funnel",
    {
      title: "Delete Funnel",
      description: "Permanently delete a conversion funnel from a Swetrix project.",
      inputSchema: DeleteFunnelSchema,
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
    },
    async ({ id, pid }) => {
      try {
        await client.delete(`/v1/project/funnel/${id}/${pid}`);
        return { content: [{ type: "text", text: `Funnel ${id} deleted from project ${pid}.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
