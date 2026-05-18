import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canUserPost, appendPost, ensureUserExists } from "@/lib/db";
import { generateRequestId, trace } from "@/lib/trace";
import { withRateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { Anthropic } from "@anthropic-ai/sdk";

const ALLOWED_PLATFORMS = ["x", "facebook", "instagram", "linkedin", "threads"] as const;

const generateSchema = z.object({
  prompt: z.string().min(5).max(500),
  platform: z.enum(ALLOWED_PLATFORMS),
});

const platformMap: Record<string, string> = {
  x: "X (Twitter)",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  threads: "Threads",
};

export async function POST(req: NextRequest) {
  return withRateLimit(req, "medium", async () => {
    const requestId = generateRequestId();
    const start = Date.now();

    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
      }

      const parsed = generateSchema.safeParse(await req.json());
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid platform or prompt." }, { status: 400 });
      }

      const { prompt, platform } = parsed.data;

      const user = await ensureUserExists(session.user.email, session.user.name || undefined);

      const check = await canUserPost(user.id, user.plan);
      if (!check.allowed) {
        return NextResponse.json({
          error: check.reason,
          limitReached: true,
        }, { status: 429 });
      }

      if (user.plan === "lifetime") {
        const allowedLifetimePlatforms = ["x", "facebook", "instagram"];
        if (!allowedLifetimePlatforms.includes(platform)) {
          return NextResponse.json({
            error: `The Lifetime plan only supports: X, Facebook, and Instagram. Please upgrade to the Agency plan to unlock ${platform.toUpperCase()}!`,
          }, { status: 403 });
        }
      }

      const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicApiKey) {
        throw new Error("CRITICAL: ANTHROPIC_API_KEY is missing.");
      }

      const anthropic = new Anthropic({ apiKey: anthropicApiKey });

      const completion = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Write a high-converting post optimized specifically for ${platformMap[platform]} based on this request: ${prompt}`,
          },
        ],
      });

      const generatedText =
        completion.content[0].type === "text"
          ? completion.content[0].text
          : "No text generated";

      const post = await appendPost({
        userId: user.id,
        content: generatedText,
        platform,
        prompt,
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "generation",
          metadata: { platform, prompt, characterCount: generatedText.length, postId: post.id } as any,
        },
      });

      trace({
        requestId,
        event: "generate.post.completed",
        platform,
        durationMs: Date.now() - start,
        status: "success",
      });

      return NextResponse.json({
        success: true,
        platform,
        content: generatedText,
        remaining: check.limit ? check.limit - (user.dailyPostsUsed + 1) : null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error during generation.";
      trace({
        requestId,
        event: "generate.post.error",
        durationMs: Date.now() - start,
        status: "error",
        error: message,
      });

      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}
