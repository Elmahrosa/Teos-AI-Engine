import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { canGenerate, canUseLinkedIn } from "@/lib/limits";
import { getSessionEmail } from "@/lib/session";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/auth";
import { generateHashtags } from "@/lib/ai/generateHashtags";
import { generateImage } from "@/lib/ai/generateImage";
import {
  getVisibilityScore,
  getBestTime,
  getSuggestedCTA,
  getChecklist,
} from "@/lib/ai/insights";

export const runtime = "nodejs";

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

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const email = await getSessionEmail();
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

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isAdmin = isAdminEmail(email);

    if (
      parsed.platform === "linkedin" &&
      !isAdmin &&
      !canUseLinkedIn(user.plan)
    ) {
      return NextResponse.json(
        { error: "LinkedIn requires Agency plan" },
        { status: 403 }
      );
    }

    const usedCount = user.posts.length;

    if (!isAdmin && !canGenerate(user.plan, usedCount)) {
      return NextResponse.json(
        { error: "Starter plan limit reached.", upgrade: true },
        { status: 403 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Server missing AI configuration" },
        { status: 500 }
      );
    }

    const promptText = `
You are Teos AI Engine, an elite social media content strategist.

Write one high-impact, ready-to-publish social media post.

Platform: ${parsed.platform}
Topic: ${parsed.prompt}
Goal: ${parsed.goal}
Tone: ${parsed.tone}
Audience: founders, creators, and growth-focused users

Rules:
- Output only the final post text
- No extra labels
- No markdown code fences
- Make it concise, strong, and platform-appropriate
`.trim();

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are a high-conversion social media copywriter for founders, creators, startups, and agencies.",
        },
        {
          role: "user",
          content: promptText,
        },
      ],
    });

    const postText = response.output_text?.trim();

    if (!postText) {
      return NextResponse.json(
        { error: "Empty AI response." },
        { status: 500 }
      );
    }

    const hashtags = generateHashtags(parsed.prompt, parsed.platform);

    let imageUrl: string | null = null;
    try {
      const imageResult = await generateImage(parsed.platform, parsed.prompt);
      imageUrl = imageResult?.url || null;
    } catch (imageError) {
      console.error("[/api/generate] image generation failed:", imageError);
    }

    const visibilityScore = getVisibilityScore(postText, hashtags, parsed.goal);

    await prisma.post.create({
      data: {
        userId: user.id,
        prompt: parsed.prompt,
        platform: parsed.platform,
        content: postText,
        hashtags: JSON.stringify(hashtags),
        imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      plan: isAdmin ? "founder" : user.plan,
      used: usedCount + 1,
      post: postText,
      hashtags,
      imageUrl,
      insights: {
        visibilityScore,
        bestTime: getBestTime(parsed.platform),
        suggestedCTA: getSuggestedCTA(parsed.goal),
        checklist: getChecklist(parsed.platform, parsed.goal),
      },
    });
  } catch (error) {
    console.error("[/api/generate] error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Generation failed." },
      { status: 500 }
    );
  }
}