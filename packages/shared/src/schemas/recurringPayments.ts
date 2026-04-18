import z from "zod";

export const createRecurringPaymentSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["subscription", "loan"]),
  amount: z.number().positive(),
  account: z.string(),
  billingCycle: z.enum(["weekly", "monthly", "yearly"]),
  nextDueDate: z.coerce.date(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  category: z.string(),
});

export const updateRecurringPaymentSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(["subscription", "loan"]).optional(),
  billingCycle: z.enum(["weekly", "monthly", "yearly"]).optional(),
  nextDueDate: z.coerce.date().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  amount: z.number().positive().optional(),
  account: z.string().optional(),
  category: z.string().optional(),
});

export type CreateRecurringPaymentBody = z.infer<
  typeof createRecurringPaymentSchema
>;
export type UpdateRecurringPaymentBody = z.infer<
  typeof updateRecurringPaymentSchema
>;
