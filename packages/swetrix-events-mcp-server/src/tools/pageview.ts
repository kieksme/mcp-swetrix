import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { PageviewSchema } from "../schemas/events.js";
import { formatApiError } from "../services/api-client.js";

export function registerPageviewTool(server: McpServer, client: AxiosInstance): void {
  server.registerTool(
    "swetrix_track_pageview",
    {
      title: "Track Pageview",
      description: `Record a pageview event in Swetrix Analytics.

Use this tool to track when a user visits a page on your website or application.
The event is processed server-side, so it works even if the visitor has an ad blocker.

For accurate unique visitor counting, provide both 'ip' and 'userAgent'.
Without these, unique visitor and live visitor tracking will not work correctly.

Args:
  - pid (string): Swetrix project ID (required)
  - pg (string): Page path, e.g. '/about' (optional)
  - lc (string): Locale, e.g. 'en-US' (optional)
  - tz (string): IANA timezone, e.g. 'Europe/Berlin' (optional)
  - ref (string): HTTP Referer URL (optional)
  - so (string): UTM source (optional)
  - me (string): UTM medium (optional)
  - ca (string): UTM campaign (optional)
  - unique (boolean): Count only unique visitors (optional)
  - perf (object): Performance metrics in milliseconds (optional)
  - ip (string): Client IP address for visitor deduplication (optional)
  - userAgent (string): Client User-Agent for device/browser detection (optional)

Returns:
  Confirmation message on success.

HTTP Status Codes:
  - 201: Pageview recorded successfully
  - 400: Invalid request (missing pid, project disabled)
  - 402: Subscription expired or quota exceeded
  - 403: Visitor already counted as unique`,
      inputSchema: PageviewSchema,
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
        await client.post("/log", body, { headers });
        return {
          content: [{ type: "text", text: `Pageview recorded for project ${params.pid}${params.pg ? ` on page '${params.pg}'` : ""}.` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
