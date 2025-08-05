import { z } from "zod";
export const SignUpSchema = z.object({
  name: z.string().trim(),
  email: z.email(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
