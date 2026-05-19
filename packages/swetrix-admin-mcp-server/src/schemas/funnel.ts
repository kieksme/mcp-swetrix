import { z } from "zod";

export const ListFunnelsSchema = z.object({
  pid: z.string().min(1).describe("Project ID"),
});

export const CreateFunnelSchema = z.object({
  pid: z.string().min(1).describe("Project ID"),
  name: z.string().min(1).max(50).describe("Funnel name, max 50 characters"),
  steps: z.array(z.string().min(1)).min(2).describe("Ordered list of page paths, e.g. ['/', '/signup', '/dashboard']"),
});

export const UpdateFunnelSchema = z.object({
  id: z.string().min(1).describe("Funnel ID"),
  pid: z.string().min(1).describe("Project ID"),
  name: z.string().min(1).max(50).optional().describe("New funnel name"),
  steps: z.array(z.string().min(1)).min(2).optional().describe("Updated list of page paths"),
});

export const DeleteFunnelSchema = z.object({
  id: z.string().min(1).describe("Funnel ID"),
  pid: z.string().min(1).describe("Project ID"),
});
