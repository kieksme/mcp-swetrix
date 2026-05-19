import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { CustomEventSchema } from "../schemas/events.js";
import { formatApiError } from "../services/api-client.js";

export function registerCustomEventTool(server: McpServer, client: AxiosInstance): void {
  server.registerTool(
    "swetrix_track_custom_event",
    {
      title: "Track Custom Event",
      description: `Record a named custom event in Swetrix Analytics.

Use this tool to track specific user interactions or business events beyond pageviews,
such as button clicks, form submissions, purchases, or feature usage.

Metadata key-value pairs must be strings. Maximum 100 keys and 2000 total characters.

Args:
  - pid (string): Swetrix project ID (required)
  - ev (string): Event name, max 256 characters (required)
  - pg (string): Page path where the event occurred (optional)
  - lc (string): Locale, e.g. 'en-US' (optional)
  - ref (string): HTTP Referer URL (optional)
  - so (string): UTM source (optional)
  - me (string): UTM medium (optional)
  - ca (string): UTM campaign (optional)
  - unique (boolean): Deduplicate by visitor (optional)
  - meta (object): Custom metadata key-value pairs (optional)
  - ip (string): Client IP address (optional)
  - userAgent (string): Client User-Agent (optional)

Returns:
  Confirmation message on success.

Examples:
  - Track a sign-up: ev='signup', meta={'plan': 'pro'}
  - Track a button click: ev='cta_click', pg='/pricing'`,
      inputSchema: CustomEventSchema,
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
        await client.post("/log/custom", body, { headers });
        return {
          content: [{ type: "text", text: `Custom event '${params.ev}' recorded for project ${params.pid}.` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
