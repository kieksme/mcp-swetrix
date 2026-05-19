import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { HeartbeatSchema } from "../schemas/events.js";
import { formatApiError } from "../services/api-client.js";

export function registerHeartbeatTool(server: McpServer, client: AxiosInstance): void {
  server.registerTool(
    "swetrix_track_heartbeat",
    {
      title: "Track Heartbeat",
      description: `Send a heartbeat signal to Swetrix to indicate an active visitor session.

Send this every 30 seconds while a user is active on a page to maintain their
live visitor status in the Swetrix dashboard.

Args:
  - pid (string): Swetrix project ID (required)
  - ip (string): Client IP address (optional)
  - userAgent (string): Client User-Agent (optional)

Returns:
  Confirmation message on success.`,
      inputSchema: HeartbeatSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      const { ip, userAgent, pid } = params;
      const headers: Record<string, string> = {};
      if (ip) headers["X-Client-IP-Address"] = ip;
      if (userAgent) headers["User-Agent"] = userAgent;

      try {
        await client.post("/log/hb", { pid }, { headers });
        return {
          content: [{ type: "text", text: `Heartbeat sent for project ${pid}.` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
