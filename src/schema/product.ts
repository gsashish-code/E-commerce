import z, { email } from "zod";

export const productSchema = z.object({
  name: z.string().trim(),
  description: z.string().trim(),
  price: z.number(),
  tags: z.array(z.string()).transform((arr) => arr.join(",")),
});
