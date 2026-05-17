import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ai } from '@/lib/ai';
import { canUserPost, appendPost, ensureUserExists } from '@/lib/db';
import { generateRequestId, trace } from '@/lib/trace';
import { withRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const generateSchema = z.object({
  prompt: z.string().trim().min(10).max(500),
  platform: z.enum(["x", "instagram", "linkedin"]),
});

const postSchema = z.object({
  post: z.string(),
  hashtags: z.array(z.string()).min(3).max(5),
});

const platformMap: Record<string, string> = {
  x: "X (Twitter)",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

export async function POST(req: NextRequest) {
  return withRateLimit(req, "medium", async () => {
    const requestId = generateRequestId();
    const start = Date.now();

    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const parsed = generateSchema.safeParse(await req.json());
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
      }

      const { prompt, platform } = parsed.data;

      const user = await ensureUserExists(session.user.email, session.user.name || undefined);

      const check = await canUserPost(user.id, user.plan);
      if (!check.allowed) {
        return NextResponse.json({ 
          error: check.reason,
          limitReached: true 
        }, { status: 429 });
      }

      const result = await ai.generate({
        prompt: `Write a concise ${platformMap[platform]} post about: ${prompt}. Keep it sharp and useful. Include relevant hashtags.`,
        schema: postSchema,
        config: { provider: "gemini" },
        trace: { requestId, event: "generate.post" },
      });

      await appendPost({
        userId: user.id,
        content: result.post,
        platform,
        prompt,
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
        post: result.post,
        hashtags: result.hashtags,
        remaining: check.limit ? check.limit - (user.dailyPostsUsed + 1) : null,
      });

    } catch (error: any) {
      trace({
        requestId,
        event: "generate.post.error",
        durationMs: Date.now() - start,
        status: "error",
        error: error.message,
      });

      return NextResponse.json({ error: "Failed to generate post" }, { status: 500 });
    }
  });
}
