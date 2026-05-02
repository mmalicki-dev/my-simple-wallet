import z from "zod";

export const transactionSchema = z.object({
  account: z.string(),
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.string(),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
});

export type TransactionBody = z.infer<typeof transactionSchema>;
