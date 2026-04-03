import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { appendPost, findUserByEmail, updateUserByEmail } from "@/lib/db";
import { generatePost } from "@/lib/claude";
import { canUseLinkedIn } from "@/lib/access";
import { isTrialExpired } from "@/lib/trial";
import { checkRateLimit } from "@/lib/rateLimit";
import { generatePostSchema } from "@/lib/validation";
import {
  GENERATE_RATE_LIMIT,
  GENERATE_RATE_WINDOW_MS,
  STARTER_POST_LIMIT,
} from "@/lib/constants";
import { isAllowedOrigin } from "@/lib/origin";

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserByEmail(session.user.email);

  if (!user) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const rateKey = user.id ?? session.user.email.toLowerCase();
  if (
    !checkRateLimit(
      rateKey,
      GENERATE_RATE_LIMIT,
      GENERATE_RATE_WINDOW_MS
    )
  ) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  // FIXED: Logic now matches the Prisma Schema 'trialEndsAt' property
  if (
    isTrialExpired({
      trialEndsAt: user.trialEndsAt, 
      status: user.status,
      email: user.email,
    })
  ) {
    await updateUserByEmail(session.user.email, { status: "blocked" });
    return NextResponse.json(
      { error: "Trial ended. Upgrade required." },
      { status: 403 }
    );
  }

  if (user.plan === "starter" && user.posts.length >= STARTER_POST_LIMIT) {
    return NextResponse.json(
      { error: "Starter limit reached. Upgrade to continue." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const parsed = generatePostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { prompt, platform } = parsed.data;

    if (platform === "linkedin" && !canUseLinkedIn(user)) {
      return NextResponse.json(
        { error: "LinkedIn requires Agency plan" },
        { status: 403 }
      );
    }

    const result = await generatePost(prompt, platform);

    await appendPost(session.user.email, {
      content: result.post,
      platform,
    });

    return NextResponse.json({
      success: true,
      post: result.post,
      hashtags: result.hashtags,
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
