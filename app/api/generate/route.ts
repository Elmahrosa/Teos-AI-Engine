import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { canGenerate, canUseLinkedIn } from "@/lib/limits";
import { getSessionEmail } from "@/lib/session";
import { prisma } from "@/lib/db";
import { generateHashtags } from "@/lib/ai/generateHashtags";
import { generateImage } from "@/lib/ai/generateImage";
import {
  getVisibilityScore,
  getBestTime,
  getSuggestedCTA,
  getChecklist,
} from "@/lib/ai/insights";

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing AI configuration" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are Teos AI Engine, an elite social media content strategist.

Platform: ${parsed.platform}
Topic: ${parsed.prompt}
Goal: ${parsed.goal}
Tone: ${parsed.tone}
Audience: founders, creators, and growth-focused users

Write one high-impact, ready-to-publish social media post.
Return ONLY the final post text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const postText = (response.text ?? "").trim();

    if (!postText) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }

    const hashtags = generateHashtags(parsed.prompt, parsed.platform);
    const imageResult = await generateImage(parsed.platform, parsed.prompt);
    const visibilityScore = getVisibilityScore(postText, hashtags, parsed.goal);

    try {
      await prisma.post.create({
        data: {
          userId: user.id,
          prompt: parsed.prompt,
          platform: parsed.platform,
          content: postText,
          hashtags: JSON.stringify(hashtags),
          imageUrl: imageResult.url,
        },
      });
    } catch (e) {
      console.error("[generate] save failed:", e);
    }

    return NextResponse.json({
      success: true,
      plan: user.plan,
      used: usedCount + 1,
      post: postText,
      hashtags,
      imageUrl: imageResult.url,
      insights: {
        visibilityScore,
        bestTime: getBestTime(parsed.platform),
        suggestedCTA: getSuggestedCTA(parsed.goal),
        checklist: getChecklist(parsed.platform, parsed.goal),
      },
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
      { error: error instanceof Error ? error.message : "Generation failed." },
      { status: 500 }
    );
  }
}