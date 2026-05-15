import z from "zod";

export type AccountType = "debit" | "credit";

export const createAccountSchema = z.object({
  name: z.string().min(1),
  currency: z.string().optional(),
  type: z.enum(["debit", "credit"]).optional().default("debit"),
  includeInTotal: z.boolean().optional().default(true),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).optional(),
  currency: z.string().optional(),
  isDefault: z.boolean().optional(),
  type: z.enum(["debit", "credit"]).optional(),
  includeInTotal: z.boolean().optional(),
});

export type CreateAccountBody = z.infer<typeof createAccountSchema>;
export type UpdateAccountBody = z.infer<typeof updateAccountSchema>;
