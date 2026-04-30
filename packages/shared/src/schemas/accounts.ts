import z from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1),
  currency: z.string().optional(),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).optional(),
  currency: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type CreateAccountBody = z.infer<typeof createAccountSchema>;
export type UpdateAccountBody = z.infer<typeof updateAccountSchema>;
