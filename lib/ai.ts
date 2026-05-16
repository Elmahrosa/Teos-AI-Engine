import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const postSchema = z.object({
  post: z.string(),
  hashtags: z.array(z.string()).min(3).max(5),
});

type AIConfig = {
  prompt: string;
  platform: "x" | "instagram" | "linkedin";
};

type AIProvider = "gemini" | "claude" | "demo";

function getProvider(): { model: any; provider: AIProvider } | { model: null; provider: "demo" } {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return { model: google("gemini-2.0-flash"), provider: "gemini" };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    const { anthropic } = require("@ai-sdk/anthropic") as typeof import("@ai-sdk/anthropic");
    return { model: anthropic("claude-3-5-sonnet-20241022"), provider: "claude" };
  }
  return { model: null, provider: "demo" };
}

async function generateWithRetry(
  model: any,
  prompt: string,
  platform: string,
  retries = 2,
): Promise<{ post: string; hashtags: string[] }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const result = await generateObject({
        model,
        schema: postSchema,
        prompt: `Write a concise ${platform} post about: ${prompt}. Keep it sharp and useful.`,
        abortSignal: controller.signal,
      });
      const { post, hashtags } = result.object;
      if (!post || !hashtags) throw new Error("AI returned incomplete result");
      return { post, hashtags };
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort = err instanceof Error && err.name === "AbortError";
      if (attempt < retries && !isAbort) {
        continue;
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  throw new Error("generateWithRetry exhausted");
}

export async function generatePost({ prompt, platform }: AIConfig) {
  const result = getProvider();

  if (result.provider === "demo") {
    return {
      post: `Demo ${platform} post about: ${prompt}`,
      hashtags: ["#demo", "#xteospro", "#growth"],
    };
  }

  return generateWithRetry(result.model, prompt, platform);
}

export function getActiveProvider(): AIProvider {
  return getProvider().provider;
}
