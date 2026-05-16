import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePost } from '@/lib/ai';
import { canUserPost, appendPost, ensureUserExists } from '@/lib/db';
import { generatePostSchema } from '@/lib/validation';
import { rateLimitMiddleware } from '@/lib/rateLimit';
import { isAllowedOrigin } from '@/lib/origin';
import { log, logError, getRequestId } from '@/lib/logger';
import { GENERATE_RATE_LIMIT, GENERATE_RATE_WINDOW_MS } from '@/lib/constants';

export async function POST(req: NextRequest) {
  const reqId = getRequestId(req);
  log(req, "generate.start", { reqId });

  try {
    if (!isAllowedOrigin(req)) {
      log(req, "generate.origin_blocked", { reqId });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rl = await rateLimitMiddleware(req, "generate", GENERATE_RATE_LIMIT, GENERATE_RATE_WINDOW_MS);
    if (!rl.allowed) {
      log(req, "generate.rate_limited", { reqId, remaining: rl.remaining });
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      log(req, "generate.unauthorized", { reqId });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = generatePostSchema.safeParse(body);
    if (!parsed.success) {
      log(req, "generate.validation_failed", { reqId, errors: parsed.error.flatten() });
      return NextResponse.json(
        { error: "Invalid input. Prompt must be 10-500 characters." },
        { status: 400 }
      );
    }

    const { prompt, platform } = parsed.data;
    log(req, "generate.validated", { reqId, prompt: prompt.slice(0, 50), platform, user: session.user.email });

    const user = await ensureUserExists(session.user.email, session.user.name || undefined);

    const check = await canUserPost(user.id, user.plan);
    if (!check.allowed) {
      log(req, "generate.limit_reached", { reqId, reason: check.reason, userId: user.id });
      return NextResponse.json({
        error: check.reason,
        limitReached: true
      }, { status: 429 });
    }

    const result = await generatePost({ prompt, platform });
    log(req, "generate.completed", { reqId, platform, userId: user.id });

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
    logError(req, "generate.failed", error, { reqId });
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 });
  }
}
