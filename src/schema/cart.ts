import { z } from "zod";

export const CreateCartSchema = z.object({
  productId: z.number(),
  quantity: z.number(),
});

export const ChangeQuantitySchema = z.object({
  quantity: z.number().min(1, "Quantity should be at least 1"),
});
