import { z } from "zod";

export const OrgIdSchema = z.object({
  orgId: z.string().min(1).describe("Organisation ID"),
});

export const CreateOrgSchema = z.object({
  name: z.string().min(1).max(50).describe("Organisation name, max 50 characters"),
});

export const UpdateOrgSchema = z.object({
  orgId: z.string().min(1).describe("Organisation ID"),
  name: z.string().min(1).max(50).describe("New organisation name"),
});

export const InviteMemberSchema = z.object({
  orgId: z.string().min(1).describe("Organisation ID"),
  email: z.string().email().describe("Email address of the user to invite"),
  role: z.enum(["owner", "admin", "viewer"]).describe("Role to assign to the invited user"),
});

export const UpdateMemberSchema = z.object({
  memberId: z.string().min(1).describe("Member ID"),
  role: z.enum(["owner", "admin", "viewer"]).describe("New role for the member"),
});

export const RemoveMemberSchema = z.object({
  memberId: z.string().min(1).describe("Member ID to remove from the organisation"),
});
