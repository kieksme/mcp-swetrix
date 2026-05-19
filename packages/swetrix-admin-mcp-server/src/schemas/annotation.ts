import { z } from "zod";

export const ListAnnotationsSchema = z.object({
  pid: z.string().min(1).describe("Project ID"),
});

export const CreateAnnotationSchema = z.object({
  pid: z.string().min(1).describe("Project ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Date in YYYY-MM-DD format"),
  text: z.string().min(1).max(120).describe("Annotation text, max 120 characters"),
});

export const UpdateAnnotationSchema = z.object({
  id: z.string().min(1).describe("Annotation ID"),
  pid: z.string().min(1).describe("Project ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("New date in YYYY-MM-DD format"),
  text: z.string().min(1).max(120).optional().describe("New annotation text"),
});

export const DeleteAnnotationSchema = z.object({
  id: z.string().min(1).describe("Annotation ID"),
  pid: z.string().min(1).describe("Project ID"),
});
