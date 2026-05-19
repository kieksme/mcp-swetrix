import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AxiosInstance } from "axios";
import { RevenueEventSchema } from "../schemas/events.js";
import { formatApiError } from "../services/api-client.js";

export function registerRevenueTool(server: McpServer, client: AxiosInstance): void {
  server.registerTool(
    "swetrix_track_revenue",
    {
      title: "Track Revenue",
      description: `Record a revenue event (sale, refund, or subscription) in Swetrix.

IMPORTANT: This endpoint requires the SWETRIX_API_KEY environment variable.
It must NEVER be called from browser-side code – only from trusted server-side environments.

Provide a 'transactionId' to enable idempotency – duplicate submissions with the same ID
will be ignored, preventing double-counting of transactions.

Args:
  - pid (string): Swetrix project ID (required)
  - type ('sale' | 'refund' | 'subscription'): Revenue event type (required)
  - amount (number): Transaction amount, must be positive (required)
  - currency (string): ISO 4217 currency code, e.g. 'EUR', 'USD' (required)
  - transactionId (string): Unique transaction ID for idempotency (optional, recommended)
  - productId (string): Product identifier (optional)
  - productName (string): Human-readable product name (optional)
  - profileId (string): Swetrix visitor profile ID for attribution (optional)
  - sessionId (string): Session ID for attribution (optional)
  - created (string): ISO 8601 timestamp of the transaction (optional)
  - metadata (object): Additional metadata (optional)

Returns:
  JSON object with success status and transactionId on success.

Error Handling:
  - 403: Missing revenue permissions (enable in project settings)
  - 409: Stripe/Paddle already connected (cannot use manual revenue tracking)`,
      inputSchema: RevenueEventSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const response = await client.post<{ success: boolean; transactionId?: string }>(
          "/log/revenue",
          params
        );
        const result = response.data;
        const txId = result.transactionId ?? params.transactionId ?? "N/A";
        return {
          content: [{
            type: "text",
            text: `Revenue event '${params.type}' of ${params.amount} ${params.currency} recorded for project ${params.pid}. Transaction ID: ${txId}`,
          }],
          structuredContent: result,
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatApiError(error) }] };
      }
    }
  );
}
