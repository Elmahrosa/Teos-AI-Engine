import { z } from "zod";

export const generatePostSchema = z.object({
  prompt: z.string().trim().min(10).max(500),
  platform: z.enum(["x", "instagram", "linkedin"]),
});

export const subscribeSchema = z.object({
  plan: z.enum(["starter", "pro", "agency"]),
});
