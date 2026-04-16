import z from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name of the category must have at least 2 characters.")
    .trim(),
  type: z.enum(["income", "expense"]),
  icon: z.string().optional(),
  colour: z.string().optional(),
});

export type CategoryBody = z.infer<typeof categorySchema>;
