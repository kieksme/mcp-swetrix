import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import {
  ListViewsSchema,
  GetViewSchema,
  CreateViewSchema,
  UpdateViewSchema,
  DeleteViewSchema,
} from "../schemas/view.js";
import { formatApiError } from "../services/api-client.js";

export function registerViewTools(server: McpServer, client: AxiosInstance): void {
  server.registerTool(
    "swetrix_list_views",
    {
      title: "List Project Views",
      description: "List all saved views (segments) for a Swetrix project.",
      inputSchema: ListViewsSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ pid }) => {
      try {
        const { data } = await client.get(`/v1/project/${pid}/views`);
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
    "swetrix_get_view",
    {
      title: "Get Project View",
      description: "Get details of a single saved view (segment) for a Swetrix project.",
      inputSchema: GetViewSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ pid, viewId }) => {
      try {
        const { data } = await client.get(`/v1/project/${pid}/views/${viewId}`);
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
    "swetrix_create_view",
    {
      title: "Create Project View",
      description: `Create a saved view (segment) for a Swetrix project.

Views save a combination of filters and custom event metrics so they can be quickly
applied to the dashboard without re-entering filter conditions each time.

Args:
  - pid (string): Project ID (required)
  - name (string): View name, max 20 characters (required)
  - type ('traffic' | 'performance'): View type (required)
  - filters (Filter[]): Dimension filters, e.g. country=US, device=mobile (optional)
  - customEvents (CustomEvent[]): Up to 3 custom event metrics (optional)

Filter columns: cc, rg, ct, host, pg, lc, br, brv, os, osv, dv, ref, so, me, ca, te, co`,
      inputSchema: CreateViewSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ pid, ...body }) => {
      try {
        const { data } = await client.post(`/v1/project/${pid}/views`, body);
        return {
          content: [{ type: "text", text: `View '${body.name}' created for project ${pid}.\n\n${JSON.stringify(data, null, 2)}` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_update_view",
    {
      title: "Update Project View",
      description: "Update an existing saved view's name, filters, or custom event metrics.",
      inputSchema: UpdateViewSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ pid, viewId, ...body }) => {
      try {
        const { data } = await client.patch(`/v1/project/${pid}/views/${viewId}`, body);
        return {
          content: [{ type: "text", text: `View ${viewId} updated.\n\n${JSON.stringify(data, null, 2)}` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_delete_view",
    {
      title: "Delete Project View",
      description: "Permanently delete a saved view from a Swetrix project.",
      inputSchema: DeleteViewSchema,
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
    },
    async ({ pid, viewId }) => {
      try {
        await client.delete(`/v1/project/${pid}/views/${viewId}`);
        return { content: [{ type: "text", text: `View ${viewId} deleted from project ${pid}.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
