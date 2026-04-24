import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionEmail } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const email = await getSessionEmail();

    if (!email) {
      return NextResponse.json({ error: "Please log in first" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });
    }

    const body = await req.json();
    const prompt = String(body.prompt || "").trim();
    const platform = String(body.platform || "x");
    const tone = String(body.tone || "professional");
    const goal = String(body.goal || "engagement");

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const db = prisma as any;

    const user = await db.user.findUnique({
      where: { email },
      include: { posts: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdmin = email === "aams1969@gmail.com";
    const plan = user.plan || "starter";

    if (!isAdmin && platform === "linkedin" && plan !== "agency") {
      return NextResponse.json(
        { error: "LinkedIn is Agency only" },
        { status: 403 }
      );
    }

    if (!isAdmin && plan === "starter" && user.posts.length >= 5) {
      return NextResponse.json(
        { error: "Starter limit reached. Upgrade to continue." },
        { status: 403 }
      );
    }

    const aiPrompt = `
Create a social media post.

Platform: ${platform}
Tone: ${tone}
Goal: ${goal}

User request:
${prompt}

Return JSON only:
{
  "post": "...",
  "hashtags": ["tag1","tag2","tag3"],
  "visibilityScore": 85,
  "bestTime": "Today at 7 PM",
  "suggestedCTA": "...",
  "checklist": ["Clear hook", "Strong CTA", "Platform optimized"]
}
`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are Teos AI Engine, a premium social media content strategist. Return valid JSON only.",
          },
          {
            role: "user",
            content: aiPrompt,
          },
        ],
        temperature: 0.8,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("[OPENAI ERROR]", errText);
      return NextResponse.json(
        { error: "AI provider failed" },
        { status: 500 }
      );
    }

    const aiJson = await aiRes.json();
    const raw = aiJson?.choices?.[0]?.message?.content || "";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        post: raw || "Generated content unavailable.",
        hashtags: ["TeosAI", "AIContent", "Launch"],
        visibilityScore: 80,
        bestTime: "Today at 7 PM",
        suggestedCTA: "Try Teos AI Engine today.",
        checklist: ["Platform optimized", "Clear CTA", "Readable format"],
      };
    }

    const hashtags = Array.isArray(parsed.hashtags)
      ? parsed.hashtags.map((h: string) => String(h).replace("#", ""))
      : ["TeosAI", "AIContent"];

    const saved = await db.post.create({
      data: {
        userId: user.id,
        platform,
        prompt,
        content: String(parsed.post || ""),
        hashtags: hashtags.join(","),
      },
    });

    return NextResponse.json({
      success: true,
      plan,
      used: user.posts.length + 1,
      post: saved.content,
      hashtags,
      imageUrl: null,
      insights: {
        visibilityScore: Number(parsed.visibilityScore || 80),
        bestTime: String(parsed.bestTime || "Today at 7 PM"),
        suggestedCTA: String(parsed.suggestedCTA || "Try Teos AI Engine today."),
        checklist: Array.isArray(parsed.checklist)
          ? parsed.checklist
          : ["Clear hook", "Strong CTA", "Platform optimized"],
      },
    });
  } catch (error) {
    console.error("[/api/generate]", error);
    return NextResponse.json(
      { error: "Generation failed server-side" },
      { status: 500 }
    );
  }
}