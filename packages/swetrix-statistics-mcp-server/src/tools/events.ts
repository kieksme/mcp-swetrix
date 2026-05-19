import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { z } from "zod";
import { BaseQuerySchema } from "../schemas/common.js";
import { formatApiError, truncate } from "../services/api-client.js";
import { CHARACTER_LIMIT } from "../constants.js";

const EventQueryBase = BaseQuerySchema.omit({ filters: true }).extend({
  filters: z.array(z.object({ column: z.string(), filter: z.string(), isExclusive: z.boolean() })).optional(),
});

export function registerEventTools(server: McpServer, client: AxiosInstance): void {

  server.registerTool(
    "swetrix_get_event_meta",
    {
      title: "Get Custom Event Metadata",
      description: `Get metadata keys and values for a specific custom event.

Returns arrays of key, value and count for the event's metadata.

Args:
  - pid: Project ID (required)
  - event: Custom event name (required)
  - period / from / to, timezone, filters: Standard options`,
      inputSchema: EventQueryBase.extend({
        event: z.string().min(1).describe("Custom event name to inspect"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/meta", { params });
        const text = truncate(JSON.stringify(data, null, 2), CHARACTER_LIMIT);
        return { content: [{ type: "text", text }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_property",
    {
      title: "Get Page Property Stats",
      description: `Get page tag statistics grouped by a custom property.

Returns key, value and count arrays for the specified property.

Args:
  - pid: Project ID (required)
  - property: Custom property name (required)
  - period / from / to, timezone, filters: Standard options`,
      inputSchema: EventQueryBase.extend({
        property: z.string().min(1).describe("Custom property name to aggregate by"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/property", { params });
        const text = truncate(JSON.stringify(data, null, 2), CHARACTER_LIMIT);
        return { content: [{ type: "text", text }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "swetrix_get_custom_events",
    {
      title: "Get Custom Events Aggregated",
      description: `Get aggregated data for multiple custom events.

Args:
  - pid: Project ID (required)
  - customEvents: JSON-stringified array of event names e.g. '["signup","purchase"]' (required)
  - period / from / to, timezone, filters: Standard options`,
      inputSchema: EventQueryBase.extend({
        customEvents: z.string().describe('JSON-stringified array of event names, e.g. \'["signup","purchase"]\''),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { data } = await client.get("/v1/log/custom-events", { params });
        const text = truncate(JSON.stringify(data, null, 2), CHARACTER_LIMIT);
        return { content: [{ type: "text", text }], structuredContent: data };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
