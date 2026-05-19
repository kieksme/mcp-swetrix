import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { z } from "zod";
import {
  OrgIdSchema,
  CreateOrgSchema,
  UpdateOrgSchema,
  InviteMemberSchema,
  UpdateMemberSchema,
  RemoveMemberSchema,
} from "../schemas/organisation.js";
import { formatApiError } from "../services/api-client.js";

export function registerOrganisationTools(server: McpServer, client: AxiosInstance): void {
  server.registerTool(
    "swetrix_list_organisations",
    {
      title: "List Organisations",
      description: "List all organisations the authenticated account belongs to.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async () => {
      try {
        const { data } = await client.get("/v1/organisation");
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
    "swetrix_get_organisation",
    {
      title: "Get Organisation",
      description: "Get details of a single organisation including its members and projects.",
      inputSchema: OrgIdSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ orgId }) => {
      try {
        const { data } = await client.get(`/v1/organisation/${orgId}`);
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
    "swetrix_create_organisation",
    {
      title: "Create Organisation",
      description: "Create a new organisation to group Swetrix projects and share access with team members.",
      inputSchema: CreateOrgSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ name }) => {
      try {
        const { data } = await client.post("/v1/organisation", { name });
        return {
          content: [{ type: "text", text: `Organisation '${name}' created with ID: ${data.id}\n\n${JSON.stringify(data, null, 2)}` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_update_organisation",
    {
      title: "Update Organisation",
      description: "Update an organisation's name.",
      inputSchema: UpdateOrgSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ orgId, name }) => {
      try {
        const { data } = await client.patch(`/v1/organisation/${orgId}`, { name });
        return {
          content: [{ type: "text", text: `Organisation ${orgId} updated.\n\n${JSON.stringify(data, null, 2)}` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_delete_organisation",
    {
      title: "Delete Organisation",
      description: "Permanently delete an organisation. Projects assigned to it will become unassigned.",
      inputSchema: OrgIdSchema,
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
    },
    async ({ orgId }) => {
      try {
        await client.delete(`/v1/organisation/${orgId}`);
        return { content: [{ type: "text", text: `Organisation ${orgId} deleted.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_invite_org_member",
    {
      title: "Invite Organisation Member",
      description: `Invite a user to join an organisation by email address.

Args:
  - orgId (string): Organisation ID (required)
  - email (string): Email address of the user to invite (required)
  - role ('owner' | 'admin' | 'viewer'): Role to assign (required)`,
      inputSchema: InviteMemberSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ orgId, email, role }) => {
      try {
        const { data } = await client.post(`/v1/organisation/${orgId}/invite`, { email, role });
        return {
          content: [{ type: "text", text: `Invitation sent to ${email} as ${role} for organisation ${orgId}.` }],
          structuredContent: data,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_update_org_member",
    {
      title: "Update Organisation Member Role",
      description: "Change the role of an existing organisation member.",
      inputSchema: UpdateMemberSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ memberId, role }) => {
      try {
        await client.patch(`/v1/organisation/member/${memberId}`, { role });
        return { content: [{ type: "text", text: `Member ${memberId} role updated to '${role}'.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_remove_org_member",
    {
      title: "Remove Organisation Member",
      description: "Remove a member from an organisation. They will lose access to all projects in that organisation.",
      inputSchema: RemoveMemberSchema,
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
    },
    async ({ memberId }) => {
      try {
        await client.delete(`/v1/organisation/member/${memberId}`);
        return { content: [{ type: "text", text: `Member ${memberId} removed from organisation.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
