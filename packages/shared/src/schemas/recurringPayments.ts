import z from "zod";

export const createRecurringPaymentSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["subscription", "loan"]),
  billingCycle: z.enum(["weekly", "monthly", "yearly"]),
  nextDueDate: z.date(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateRecurringPaymentSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(["subscription", "loan"]).optional(),
  billingCycle: z.enum(["weekly", "monthly", "yearly"]).optional(),
  nextDueDate: z.date().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateRecurringPaymentBody = z.infer<
  typeof createRecurringPaymentSchema
>;
export type UpdateRecurringPaymentBody = z.infer<
  typeof updateRecurringPaymentSchema
>;
