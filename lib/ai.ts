import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const postSchema = z.object({
  post: z.string(),
  hashtags: z.array(z.string()).min(3).max(5),
});

type AIConfig = {
  prompt: string;
  platform: "x" | "instagram" | "linkedin";
};

function getModel() {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google("gemini-2.0-flash");
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-3-5-sonnet-20241022");
  }
  return null;
}

export async function generatePost({ prompt, platform }: AIConfig) {
  const model = getModel();

  if (!model) {
    return {
      post: `Demo ${platform} post about: ${prompt}`,
      hashtags: ["#demo", "#xteospro", "#growth"],
    };
  }

  const { object } = await generateObject({
    model,
    schema: postSchema,
    prompt: `Write a concise ${platform} post about: ${prompt}. Keep it sharp and useful.`,
  });

  return object;
}
