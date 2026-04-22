import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { canGenerate, canUseLinkedIn } from "@/lib/limits";
import { getSessionEmail } from "@/lib/session";
import { prisma } from "@/lib/db";
import { generateHashtags } from "@/lib/ai/generateHashtags";
import { generateImage } from "@/lib/ai/generateImage";
import { getVisibilityScore, getBestTime, getSuggestedCTA, getChecklist } from "@/lib/ai/insights";

const schema = z.object({
  prompt: z.string().min(3).max(500),
  platform: z.enum(["x", "facebook", "instagram", "linkedin"]),
  tone: z.enum(["professional", "bold", "educational", "conversational"]).default("professional"),
  goal: z.enum(["engagement", "authority", "sales", "community"]).default("engagement"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const email = await getSessionEmail();
    console.log("[/api/generate] session email:", email);
    if (!email) return NextResponse.json({ error: "Please log in first" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email },
      include: { posts: { select: { id: true } } },
    });
    console.log("[/api/generate] user found:", !!user, "plan:", user?.plan);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (parsed.platform === "linkedin" && !canUseLinkedIn(user.plan)) {
      return NextResponse.json({ error: "LinkedIn requires Agency plan" }, { status: 403 });
    }

    const usedCount = user.posts.length;
    if (!canGenerate(user.plan, usedCount)) {
      return NextResponse.json({ error: "Starter plan limit reached. Upgrade to continue.", upgrade: true }, { status: 403 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("[/api/generate] Missing ANTHROPIC_API_KEY");
      return NextResponse.json({ error: "Server missing AI configuration" }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are Teos AI Engine, an elite social media content strategist.
Return ONLY valid JSON — no markdown, no backticks, no explanation.
Exact shape:
{"post":"full ready-to-publish post text","hookVariations":["hook 1","hook 2","hook 3"],"cta":"one clear call to action"}
Rules: post must be complete, human, premium, scroll-stopping. Format for the platform.`;

    const userPrompt = `Platform: ${parsed.platform}
Topic: ${parsed.prompt}
Goal: ${parsed.goal}
Tone: ${parsed.tone}
Audience: founders, creators, and growth-focused users`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 900,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!raw) {
      console.error("[/api/generate] Empty response from Anthropic");
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }

    let postText = "";
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed2 = JSON.parse(cleaned);
      postText = parsed2.post || cleaned;
    } catch {
      console.warn("[/api/generate] JSON parse failed, using raw text");
      postText = raw;
    }

    const hashtags = generateHashtags(parsed.prompt, parsed.platform);
    const imageResult = await generateImage(parsed.platform, parsed.prompt);
    const visibilityScore = getVisibilityScore(postText, hashtags, parsed.goal);
    const bestTime = getBestTime(parsed.platform);
    const suggestedCTA = getSuggestedCTA(parsed.goal);
    const checklist = getChecklist(parsed.platform, parsed.goal);

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
      console.log("[/api/generate] post saved for:", user.email);
    } catch (saveErr) {
      console.error("[/api/generate] Auto-save failed (non-fatal):", saveErr);
    }

    return NextResponse.json({
      success: true,
      plan: user.plan,
      used: usedCount + 1,
      post: postText,
      hashtags,
      imageUrl: imageResult.url,
      insights: { visibilityScore, bestTime, suggestedCTA, checklist },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: error.flatten() }, { status: 400 });
    }
    console.error("[/api/generate] fatal error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
