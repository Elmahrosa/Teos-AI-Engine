import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { appendPost, findUserByEmail } from "@/lib/db";
import { generatePost } from "@/lib/claude";
import { canUseLinkedIn } from "@/lib/access";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserByEmail(session.user.email);

  if (!user) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (user.plan === "starter" && user.posts.length >= 10) {
    return NextResponse.json(
      { error: "Starter limit reached. Upgrade to continue." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const platform = body.platform as "x" | "instagram" | "linkedin";

    if (!prompt || !["x", "instagram", "linkedin"].includes(platform)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

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
      { error: "Failed to generate post" },
      { status: 500 }
    );
  }
}
