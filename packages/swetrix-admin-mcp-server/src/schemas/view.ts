import { z } from "zod";
import { FilterSchema, CustomEventMetricSchema } from "./common.js";

export const ListViewsSchema = z.object({
  pid: z.string().min(1).describe("Project ID"),
});

export const GetViewSchema = z.object({
  pid: z.string().min(1).describe("Project ID"),
  viewId: z.string().min(1).describe("View ID"),
});

export const CreateViewSchema = z.object({
  pid: z.string().min(1).describe("Project ID"),
  name: z.string().min(1).max(20).describe("View name, max 20 characters"),
  type: z.enum(["traffic", "performance"]).describe("View type"),
  filters: z.array(FilterSchema).optional().describe("Dimension filters to apply"),
  customEvents: z.array(CustomEventMetricSchema).max(3).optional()
    .describe("Custom event metrics to include (max 3)"),
});

export const UpdateViewSchema = z.object({
  pid: z.string().min(1).describe("Project ID"),
  viewId: z.string().min(1).describe("View ID"),
  name: z.string().min(1).max(20).optional().describe("New view name"),
  filters: z.array(FilterSchema).optional().describe("Updated filters"),
  customEvents: z.array(CustomEventMetricSchema).max(3).optional().describe("Updated custom event metrics"),
});

export const DeleteViewSchema = z.object({
  pid: z.string().min(1).describe("Project ID"),
  viewId: z.string().min(1).describe("View ID"),
});
