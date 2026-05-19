import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import {
  ListAnnotationsSchema,
  CreateAnnotationSchema,
  UpdateAnnotationSchema,
  DeleteAnnotationSchema,
} from "../schemas/annotation.js";
import { formatApiError } from "../services/api-client.js";

export function registerAnnotationTools(server: McpServer, client: AxiosInstance): void {
  server.registerTool(
    "swetrix_list_annotations",
    {
      title: "List Annotations",
      description: "List all timeline annotations for a Swetrix project.",
      inputSchema: ListAnnotationsSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ pid }) => {
      try {
        const { data } = await client.get(`/v1/project/annotations/${pid}`);
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
    "swetrix_create_annotation",
    {
      title: "Create Annotation",
      description: `Add a timeline annotation to a Swetrix project chart.

Use annotations to mark important events (deployments, campaigns, incidents)
directly on the analytics timeline.

Args:
  - pid (string): Project ID (required)
  - date (string): Date in YYYY-MM-DD format (required)
  - text (string): Annotation label, max 120 characters (required)`,
      inputSchema: CreateAnnotationSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.post("/v1/project/annotation", params);
        return {
          content: [{ type: "text", text: `Annotation created for ${params.date}.\n\n${JSON.stringify(data, null, 2)}` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_update_annotation",
    {
      title: "Update Annotation",
      description: "Update an existing timeline annotation's date or text.",
      inputSchema: UpdateAnnotationSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.patch("/v1/project/annotation", params);
        return {
          content: [{ type: "text", text: `Annotation ${params.id} updated.\n\n${JSON.stringify(data, null, 2)}` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_delete_annotation",
    {
      title: "Delete Annotation",
      description: "Permanently delete a timeline annotation from a Swetrix project.",
      inputSchema: DeleteAnnotationSchema,
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
    },
    async ({ id, pid }) => {
      try {
        await client.delete(`/v1/project/annotation/${id}/${pid}`);
        return { content: [{ type: "text", text: `Annotation ${id} deleted from project ${pid}.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
