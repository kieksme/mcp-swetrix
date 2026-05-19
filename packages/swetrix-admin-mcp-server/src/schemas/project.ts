import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(50).describe("Project name, max 50 characters"),
  isCaptcha: z.boolean().optional().describe("Create as CAPTCHA project (default: false)"),
  isPasswordProtected: z.boolean().optional().describe("Protect dashboard with a password (default: false)"),
  password: z.string().optional().describe("Dashboard password – required when isPasswordProtected is true"),
  organisationId: z.string().optional().describe("Assign to an organisation on creation"),
});

export const UpdateProjectSchema = z.object({
  id: z.string().min(1).describe("Project ID"),
  name: z.string().min(1).max(50).optional().describe("New project name"),
  active: z.boolean().optional().describe("Enable or disable data collection"),
  public: z.boolean().optional().describe("Make the dashboard publicly accessible"),
  isPasswordProtected: z.boolean().optional().describe("Toggle password protection"),
  password: z.string().optional().describe("New dashboard password"),
  origins: z.array(z.string()).optional().describe("Allowed origin domains, e.g. ['example.com', '*.gov.uk']"),
  ipBlacklist: z.array(z.string()).optional().describe("IP addresses to exclude from tracking"),
  botsProtectionLevel: z.enum(["basic", "off"]).optional().describe("Bot protection level"),
  organisationId: z.string().optional().describe("Move project to this organisation"),
});

export const ProjectIdSchema = z.object({
  id: z.string().min(1).describe("Project ID"),
});

export const AssignProjectOrgSchema = z.object({
  id: z.string().min(1).describe("Project ID"),
  organisationId: z.string().min(1).describe("Organisation ID to assign the project to"),
});
