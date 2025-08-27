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

export const AddressSchema = z.object({
  lineOne: z.string().trim(),
  lineTwo: z.string().trim(),
  city: z.string().trim(),
  country: z.string().trim(),
  pincode: z.string().trim(),
});

export const UpdateUserSchema = z.object({
  name: z.string().trim().optional(),
  defaultShippingAddressId: z.number().optional(),
  defaultBillingAddressId: z.number().optional(),
});
