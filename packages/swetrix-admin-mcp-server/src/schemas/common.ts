import { z } from "zod";

export const FilterSchema = z.object({
  column: z.enum(["cc","rg","ct","host","pg","lc","br","brv","os","osv","dv","ref","so","me","ca","te","co"])
    .describe("Dimension to filter on"),
  filter: z.string().describe("Filter value"),
  isExclusive: z.boolean().describe("Exclude matching rows instead of including them"),
  isContains: z.boolean().optional().describe("Use substring matching instead of exact match"),
});

export const CustomEventMetricSchema = z.object({
  customEventName: z.string().min(1).max(100).describe("Name of the custom event"),
  metricKey: z.string().min(1).max(100).describe("Metric key to aggregate"),
  metaKey: z.string().optional().describe("Filter by meta key"),
  metaValue: z.string().optional().describe("Filter by meta value"),
  metaValueType: z.enum(["string", "integer", "float"]).describe("Data type of the meta value"),
});
