import { z } from "zod";

export const PerformanceSchema = z.object({
  dns: z.number().nonnegative().optional().describe("DNS lookup time in ms"),
  tls: z.number().nonnegative().optional().describe("TLS handshake time in ms"),
  conn: z.number().nonnegative().optional().describe("TCP connection time in ms"),
  response: z.number().nonnegative().optional().describe("Server response time in ms"),
  render: z.number().nonnegative().optional().describe("Page render time in ms"),
  dom_load: z.number().nonnegative().optional().describe("DOM content loaded time in ms"),
  page_load: z.number().nonnegative().optional().describe("Full page load time in ms"),
  ttfb: z.number().nonnegative().optional().describe("Time to first byte in ms"),
});

export const PageviewSchema = z.object({
  pid: z.string().min(1).describe("Swetrix project ID"),
  pg: z.string().optional().describe("Page path, e.g. '/about'"),
  lc: z.string().optional().describe("Locale, e.g. 'en-US'"),
  tz: z.string().optional().describe("IANA timezone, e.g. 'Europe/Berlin'"),
  ref: z.string().optional().describe("HTTP Referer URL"),
  so: z.string().optional().describe("UTM source"),
  me: z.string().optional().describe("UTM medium"),
  ca: z.string().optional().describe("UTM campaign"),
  unique: z.boolean().optional().describe("Whether to count only unique visitors"),
  perf: PerformanceSchema.optional().describe("Performance timing metrics"),
  ip: z.string().optional().describe("Client IP address for unique visitor tracking"),
  userAgent: z.string().optional().describe("Client User-Agent for device/browser detection"),
});

export const CustomEventSchema = z.object({
  pid: z.string().min(1).describe("Swetrix project ID"),
  ev: z.string().min(1).max(256).describe("Event name, max 256 characters"),
  pg: z.string().optional().describe("Page path where the event occurred"),
  lc: z.string().optional().describe("Locale, e.g. 'en-US'"),
  ref: z.string().optional().describe("HTTP Referer URL"),
  so: z.string().optional().describe("UTM source"),
  me: z.string().optional().describe("UTM medium"),
  ca: z.string().optional().describe("UTM campaign"),
  unique: z.boolean().optional().describe("Whether to deduplicate by visitor"),
  meta: z.record(z.string(), z.string())
    .optional()
    .describe("Custom metadata key-value pairs (max 100 keys, 2000 chars total)"),
  ip: z.string().optional().describe("Client IP address"),
  userAgent: z.string().optional().describe("Client User-Agent"),
});

export const HeartbeatSchema = z.object({
  pid: z.string().min(1).describe("Swetrix project ID"),
  ip: z.string().optional().describe("Client IP address"),
  userAgent: z.string().optional().describe("Client User-Agent"),
});

export const ErrorEventSchema = z.object({
  pid: z.string().min(1).describe("Swetrix project ID"),
  name: z.string().min(1).max(200).describe("Error name/type, e.g. 'TypeError'"),
  message: z.string().max(2000).optional().describe("Error message, max 2000 characters"),
  lineno: z.number().int().nonnegative().optional().describe("Line number where error occurred"),
  colno: z.number().int().nonnegative().optional().describe("Column number where error occurred"),
  stackTrace: z.string().max(7500).optional().describe("Stack trace, max 7500 characters"),
  filename: z.string().max(1000).optional().describe("Source file name"),
  tz: z.string().optional().describe("IANA timezone"),
  pg: z.string().optional().describe("Page path where the error occurred"),
  lc: z.string().optional().describe("Locale"),
  meta: z.record(z.string(), z.string()).optional().describe("Additional metadata"),
  ip: z.string().optional().describe("Client IP address"),
  userAgent: z.string().optional().describe("Client User-Agent"),
});

export const RevenueEventSchema = z.object({
  pid: z.string().min(1).describe("Swetrix project ID"),
  type: z.enum(["sale", "refund", "subscription"]).describe("Revenue event type"),
  amount: z.number().positive().describe("Transaction amount (positive number)"),
  currency: z.string().length(3).describe("ISO 4217 currency code, e.g. 'EUR'"),
  transactionId: z.string().optional().describe("Unique transaction ID for idempotency"),
  productId: z.string().optional().describe("Product identifier"),
  productName: z.string().optional().describe("Human-readable product name"),
  profileId: z.string().optional().describe("Swetrix visitor profile ID for attribution"),
  sessionId: z.string().optional().describe("Session ID for attribution"),
  created: z.string().optional().describe("ISO 8601 timestamp of the transaction"),
  metadata: z.record(z.string(), z.string()).optional().describe("Additional metadata"),
});
