import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { z } from "zod";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  ProjectIdSchema,
  AssignProjectOrgSchema,
} from "../schemas/project.js";
import { formatApiError } from "../services/api-client.js";

export function registerProjectTools(server: McpServer, client: AxiosInstance): void {
  server.registerTool(
    "swetrix_list_projects",
    {
      title: "List Projects",
      description: "List all Swetrix projects belonging to the authenticated account.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async () => {
      try {
        const { data } = await client.get("/v1/project");
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
    "swetrix_get_project",
    {
      title: "Get Project",
      description: "Get details of a single Swetrix project by its ID.",
      inputSchema: ProjectIdSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ id }) => {
      try {
        const { data } = await client.get(`/v1/project/${id}`);
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
    "swetrix_create_project",
    {
      title: "Create Project",
      description: `Create a new Swetrix analytics project.

Args:
  - name (string): Project name, max 50 characters (required)
  - isCaptcha (boolean): Create as a CAPTCHA project (default: false)
  - isPasswordProtected (boolean): Protect the dashboard with a password (default: false)
  - password (string): Dashboard password – required when isPasswordProtected is true
  - organisationId (string): Assign to an organisation on creation

Returns the created project object including the generated project ID.`,
      inputSchema: CreateProjectSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.post("/v1/project", params);
        return {
          content: [{ type: "text", text: `Project '${data.name}' created with ID: ${data.id}\n\n${JSON.stringify(data, null, 2)}` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_update_project",
    {
      title: "Update Project",
      description: `Update an existing Swetrix project's settings.

Args:
  - id (string): Project ID (required)
  - name (string): New project name
  - active (boolean): Enable or disable data collection
  - public (boolean): Make the dashboard publicly accessible
  - isPasswordProtected (boolean): Toggle password protection
  - password (string): New dashboard password
  - origins (string[]): Allowed origin domains, e.g. ['example.com', '*.gov.uk']
  - ipBlacklist (string[]): IP addresses to exclude from tracking
  - botsProtectionLevel ('basic' | 'off'): Bot protection level
  - organisationId (string): Move project to this organisation`,
      inputSchema: UpdateProjectSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ id, ...body }) => {
      try {
        const { data } = await client.put(`/v1/project/${id}`, body);
        return {
          content: [{ type: "text", text: `Project ${id} updated.\n\n${JSON.stringify(data, null, 2)}` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_delete_project",
    {
      title: "Delete Project",
      description: "Permanently delete a Swetrix project and all its analytics data. This action cannot be undone.",
      inputSchema: ProjectIdSchema,
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
    },
    async ({ id }) => {
      try {
        await client.delete(`/v1/project/${id}`);
        return { content: [{ type: "text", text: `Project ${id} deleted successfully.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_pin_project",
    {
      title: "Pin Project",
      description: "Pin a Swetrix project to the top of the project list in the dashboard.",
      inputSchema: ProjectIdSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ id }) => {
      try {
        await client.post(`/v1/project/${id}/pin`);
        return { content: [{ type: "text", text: `Project ${id} pinned.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_unpin_project",
    {
      title: "Unpin Project",
      description: "Remove the pin from a Swetrix project.",
      inputSchema: ProjectIdSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ id }) => {
      try {
        await client.delete(`/v1/project/${id}/pin`);
        return { content: [{ type: "text", text: `Project ${id} unpinned.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_assign_project_org",
    {
      title: "Assign Project to Organisation",
      description: "Move a Swetrix project to a specific organisation.",
      inputSchema: AssignProjectOrgSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ id, organisationId }) => {
      try {
        await client.patch(`/v1/project/${id}/organisation`, { organisationId });
        return { content: [{ type: "text", text: `Project ${id} assigned to organisation ${organisationId}.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
