import { z } from "zod";
import { ai } from "./ai";
import { trace } from "./trace";

const schema = z.object({
  post: z.string(),
  hashtags: z.array(z.string()).min(3).max(5),
});

const platformMap: Record<string, string> = {
  x: "X (Twitter)",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

const deprecationWarned = new Set<string>();

function warnDeprecated(caller: string) {
  if (!deprecationWarned.has(caller)) {
    deprecationWarned.add(caller);
    trace({
      requestId: "deprecation",
      event: "legacy.claude.usage",
      caller,
      message: "lib/claude.ts is deprecated. Import from @/lib/ai instead.",
    });
  }
}

export async function generatePost(
  prompt: string,
  platform: "x" | "instagram" | "linkedin",
) {
  warnDeprecated("generatePost");

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return {
      post: `Demo ${platform} post about: ${prompt}`,
      hashtags: ["#demo", "#xteospro", "#growth"],
    };
  }

  const platformName = platformMap[platform] || platform;

  return ai.generate({
    prompt: `Write a concise ${platformName} post about: ${prompt}. Keep it sharp and useful.`,
    schema,
    config: { provider: "gemini" },
    trace: { requestId: `legacy-${Date.now()}`, event: "legacy.generatePost" },
  });
}
