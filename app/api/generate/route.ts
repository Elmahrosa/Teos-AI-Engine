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
    const parsed = schema.parse(await req.json());

    const email = await getSessionEmail();
    if (!email) {
      return NextResponse.json({ error: "Please log in first" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { posts: { select: { id: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

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
      model: "claude-3-haiku-20240307",
      max_tokens: 900,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n\n");

    return NextResponse.json({
      success: true,
      plan: user.plan,
      used: usedCount,
      result: text,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.flatten() },
        { status: 400 }
      );
    }

    console.error("[/api/generate]", error);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}