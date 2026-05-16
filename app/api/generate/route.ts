import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePost } from '@/lib/ai';
import { canUserPost, appendPost, ensureUserExists } from '@/lib/db';
import { generatePostSchema } from '@/lib/validation';
import { rateLimitMiddleware } from '@/lib/rateLimit';
import { isAllowedOrigin } from '@/lib/origin';

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rl = rateLimitMiddleware(req, "generate", 20, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = generatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input. Prompt must be 10-500 characters." },
        { status: 400 }
      );
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

    const result = await generatePost({ prompt, platform });

    await appendPost({
      userId: user.id,
      content: result.post,
      platform,
      prompt
    });

    return NextResponse.json({
      success: true,
      post: result.post,
      remaining: check.limit ? check.limit - (user.dailyPostsUsed + 1) : null
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 });
  }
}
