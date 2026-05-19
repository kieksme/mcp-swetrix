import { z } from "zod";

export const TimeBucketSchema = z.enum(["minute", "hour", "day", "week", "month", "year"])
  .describe("Time granularity for chart data");

export const PeriodSchema = z.enum(["1h", "today", "yesterday", "1d", "7d", "4w", "3M", "12M", "24M", "all"])
  .describe("Predefined time range. Use 'from'/'to' for custom ranges instead.");

export const MeasureSchema = z.enum(["median", "average", "p95", "quantiles"])
  .describe("Aggregation function for performance metrics. 'quantiles' returns p50/p75/p95.");

export const ModeSchema = z.enum(["periodic", "cumulative"])
  .describe("'periodic' aggregates by bucket; 'cumulative' shows running totals.");

export const FilterColumnSchema = z.enum([
  "cc", "rg", "ct", "host", "pg", "lc", "br", "brv",
  "os", "osv", "dv", "ref", "so", "me", "ca", "te", "co",
  "isp", "og", "ut", "ctp",
]);

export const FilterSchema = z.object({
  column: FilterColumnSchema.describe(
    "Dimension: cc=country, rg=region, ct=city, pg=page, br=browser, os=OS, dv=device, ref=referrer, so=source, me=medium, ca=campaign"
  ),
  filter: z.string().describe("Filter value"),
  isExclusive: z.boolean().describe("Exclude matching rows instead of including them"),
  isContains: z.boolean().optional().describe("Use substring match instead of exact match"),
});

export const MetricSchema = z.object({
  customEventName: z.string().min(1).describe("Custom event name to aggregate"),
  metricKey: z.string().min(1).describe("Meta key to use as the metric"),
  metaKey: z.string().optional().describe("Filter by this meta key"),
  metaValue: z.string().optional().describe("Filter by this meta value"),
  metaValueType: z.enum(["float", "integer"]).describe("Numeric type of the meta value"),
});

export const PaginationSchema = z.object({
  take: z.number().int().min(1).max(150).default(30).describe("Number of results to return (max 150)"),
  skip: z.number().int().min(0).default(0).describe("Number of results to skip for pagination"),
});

// Shared base for all traffic/performance queries
export const BaseQuerySchema = z.object({
  pid: z.string().min(1).describe("Swetrix project ID"),
  period: PeriodSchema.optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Start date YYYY-MM-DD (use with 'to')"),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("End date YYYY-MM-DD (use with 'from')"),
  timezone: z.string().optional().describe("IANA timezone, e.g. 'Europe/Berlin'"),
  filters: z.array(FilterSchema).optional().describe("Dimension filters to apply"),
});

export const ChartQuerySchema = BaseQuerySchema.extend({
  timeBucket: TimeBucketSchema,
});

export const TrafficQuerySchema = ChartQuerySchema.extend({
  mode: ModeSchema.optional(),
  metrics: z.array(MetricSchema).max(3).optional().describe("Up to 3 custom event metrics to include"),
});

export const ResponseFormatSchema = z.enum(["json", "markdown"]).default("json")
  .describe("Output format: 'json' for structured data, 'markdown' for human-readable");
