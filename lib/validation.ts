import { z } from "zod";

export const emailSchema = z.string().email().trim().toLowerCase();

export const passwordSchema = z.string().min(6).max(128);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  email: emailSchema,
  name: z.string().trim().min(1).max(100),
  password: passwordSchema,
});

export const resetRequestSchema = z.object({
  email: emailSchema,
});

export const resetConfirmSchema = z.object({
  token: z.string().min(1),
  email: emailSchema,
  password: passwordSchema,
});

export const generatePostSchema = z.object({
  prompt: z.string().trim().min(10).max(500),
  platform: z.enum(["x", "instagram", "linkedin"]),
});

export const subscribeSchema = z.object({
  plan: z.enum(["starter", "pro", "agency"]),
});
