import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { ErrorEventSchema } from "../schemas/events.js";
import { formatApiError } from "../services/api-client.js";

export function registerErrorEventTool(server: McpServer, client: AxiosInstance): void {
  server.registerTool(
    "swetrix_track_error",
    {
      title: "Track Error",
      description: `Report a JavaScript or application error to Swetrix Error Tracking.

Use this tool to capture runtime errors, unhandled exceptions, or any application
errors you want to monitor. Errors are grouped by name and message in the dashboard.

Args:
  - pid (string): Swetrix project ID (required)
  - name (string): Error name/type, e.g. 'TypeError', max 200 characters (required)
  - message (string): Error message, max 2000 characters (optional)
  - lineno (number): Line number where error occurred (optional)
  - colno (number): Column number where error occurred (optional)
  - stackTrace (string): Stack trace, max 7500 characters (optional)
  - filename (string): Source file name, max 1000 characters (optional)
  - tz (string): IANA timezone (optional)
  - pg (string): Page path where error occurred (optional)
  - lc (string): Locale (optional)
  - meta (object): Additional metadata (optional)
  - ip (string): Client IP address (optional)
  - userAgent (string): Client User-Agent (optional)

Returns:
  Confirmation message on success.`,
      inputSchema: ErrorEventSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      const { ip, userAgent, ...body } = params;
      const headers: Record<string, string> = {};
      if (ip) headers["X-Client-IP-Address"] = ip;
      if (userAgent) headers["User-Agent"] = userAgent;

      try {
        await client.post("/log/error", body, { headers });
        return {
          content: [{ type: "text", text: `Error '${params.name}' reported for project ${params.pid}.` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
