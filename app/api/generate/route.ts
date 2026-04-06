import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { appendPost } from "@/lib/db";
import { generatePost } from "@/lib/claude";
import { canUseLinkedIn } from "@/lib/access";
import { checkRateLimit } from "@/lib/rateLimit";
import { generatePostSchema } from "@/lib/validation";
import {
  GENERATE_RATE_LIMIT,
  GENERATE_RATE_WINDOW_MS,
  STARTER_POST_LIMIT,
} from "@/lib/constants";
import { isAllowedOrigin } from "@/lib/origin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    include: { posts: true }, // ✅ include posts relation
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateKey = user.id ?? session.user.email.toLowerCase();
  if (!(await checkRateLimit(rateKey, GENERATE_RATE_LIMIT, GENERATE_RATE_WINDOW_MS))) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  if (user.trialEndsAt && new Date() > new Date(user.trialEndsAt)) {
    return NextResponse.json({ error: "Trial ended. Upgrade required." }, { status: 403 });
  }

  if (user.plan === "starter" && user.posts.length >= STARTER_POST_LIMIT) {
    return NextResponse.json(
      { error: "Post limit reached. Upgrade to continue.", limitReached: true },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const parsed = generatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { prompt, platform } = parsed.data;

    if (platform === "linkedin" && !canUseLinkedIn(user)) {
      return NextResponse.json({ error: "LinkedIn requires Agency plan" }, { status: 403 });
    }

    const result = await generatePost(prompt, platform);
    await appendPost({
      userId: user.id,
      content: result.post,
      platform,
      prompt,
    });

    return NextResponse.json({
      success: true,
      post: result.post,
      hashtags: result.hashtags,
      remaining:
        user.plan === "starter"
          ? Math.max(0, STARTER_POST_LIMIT - user.posts.length - 1)
          : null,
    });
  } catch (error) {
    console.error("[generate] error", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "Failed to generate post"
            : error instanceof Error
            ? error.message
            : "Failed to generate post",
      },
      { status: 500 }
    );
  }
}
