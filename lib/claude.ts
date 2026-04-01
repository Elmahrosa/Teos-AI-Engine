import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

export async function generatePost(
  prompt: string,
  platform: "x" | "instagram" | "linkedin",
) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      post: `Demo ${platform} post about: ${prompt}`,
      hashtags: ["#demo", "#xteospro", "#growth"],
    };
  }

  const schema = z.object({
    post: z.string(),
    hashtags: z.array(z.string()).min(3).max(5),
  });

  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20241022"),
    schema,
    prompt: `Write a concise ${platform} post about: ${prompt}. Keep it sharp and useful.`,
  });

  return object;
}
