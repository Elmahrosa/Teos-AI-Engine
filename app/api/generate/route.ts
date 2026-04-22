import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { canGenerate, canUseLinkedIn } from "@/lib/limits";
import { getSessionEmail } from "@/lib/session";
import { prisma } from "@/lib/db";

const schema = z.object({
  prompt: z.string().min(3).max(500),
  platform: z.enum(["x", "facebook", "instagram", "linkedin"]),
  tone: z
    .enum(["professional", "bold", "educational", "conversational"])
    .default("professional"),
  goal: z
    .enum(["engagement", "authority", "sales", "community"])
    .default("engagement"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const email = await getSessionEmail();
    console.log("[/api/generate] session email:", email);

    if (!email) {
      return NextResponse.json(
        { error: "Please log in first" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { posts: { select: { id: true } } },
    });

    console.log("[/api/generate] user found:", !!user, "plan:", user?.plan);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (parsed.platform === "linkedin" && !canUseLinkedIn(user.plan)) {
      return NextResponse.json(
        { error: "LinkedIn requires Agency plan" },
        { status: 403 }
      );
    }

    const usedCount = user.posts.length;

    if (!canGenerate(user.plan, usedCount)) {
      return NextResponse.json(
        {
          error: "Starter plan limit reached. Upgrade to continue.",
          upgrade: true,
        },
        { status: 403 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("[/api/generate] Missing ANTHROPIC_API_KEY");
      return NextResponse.json(
        { error: "Server missing AI configuration" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `
You are Teos AI Engine, an elite social media content generator.

Return:
1) Main post
2) 3 hook variations
3) Hashtags
4) CTA suggestion
5) Best posting time
6) Visibility score

Rules:
- No fluff
- Always sound human and premium
- Keep content aligned with the user's goal
- Format for the requested platform
`;

    const userPrompt = `
Generate a high-performing social media post.

Topic: ${parsed.prompt}
Platform: ${parsed.platform}
Goal: ${parsed.goal}
Tone: ${parsed.tone}
Audience: founders, creators, and growth-focused users

Extra instructions:
- Make it scroll-stopping
- Optimize for algorithm reach
- Include emotional hook
`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 900,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n\n")
      .trim();

    if (!text) {
      console.error("[/api/generate] Empty text response from Anthropic");
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    const hashtags: string[] = [];
    const imageUrl: string | null = null;

    try {
      await prisma.post.create({
        data: {
          userId: user.id,
          prompt: parsed.prompt,
          platform: parsed.platform,
          content: text,
          hashtags: JSON.stringify(hashtags),
          imageUrl,
        },
      });
      console.log("[/api/generate] post saved for user:", user.email);
    } catch (saveErr) {
      console.error("[/api/generate] Auto-save failed:", saveErr);
    }

    return NextResponse.json({
      success: true,
      plan: user.plan,
      used: usedCount + 1,
      result: text,
      hashtags,
      imageUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.flatten() },
        { status: 400 }
      );
    }

    console.error("[/api/generate] fatal error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Generation failed. Please try again.",
      },
      { status: 500 }
    );
  }
}