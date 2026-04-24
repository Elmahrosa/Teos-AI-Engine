import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIMARY_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const FALLBACK_MODEL = "gpt-4o-mini";

function jsonError(message: string, status = 500, details?: string) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: details || null,
    },
    { status }
  );
}

async function callOpenAI(prompt: string, model: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content:
            "You are Teos AI Engine. Generate high-converting social media content. Return clean JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  const raw = await res.text();

  if (!res.ok) {
    console.error("OPENAI_ERROR", {
      model,
      status: res.status,
      body: raw,
    });

    throw new Error(`OpenAI ${res.status}: ${raw}`);
  }

  return JSON.parse(raw);
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_MISSING_KEY");
      return jsonError("OpenAI API key is missing on server.", 500);
    }

    const sessionUser = await getSessionUser();

    if (!sessionUser?.email) {
      return jsonError("Unauthorized. Please log in again.", 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email },
    });

    if (!user) {
      return jsonError("User not found.", 404);
    }

    const body = await req.json();

    const topic = body.topic || body.prompt || "";
    const platform = body.platform || "X";
    const tone = body.tone || "Professional";
    const goal = body.goal || "Engagement";

    if (!topic.trim()) {
      return jsonError("Please enter a topic or prompt.", 400);
    }

    const plan = user.plan || "starter";
    const used = user.postsUsed || 0;

    const canUseLinkedIn =
      plan === "agency" ||
      plan === "agency_yearly" ||
      plan === "agency_lifetime" ||
      plan === "founder";

    if (platform.toLowerCase() === "linkedin" && !canUseLinkedIn) {
      return jsonError("LinkedIn is unlocked on Agency plan only.", 403);
    }

    if (plan === "starter" && used >= 5) {
      return jsonError("Starter limit reached. Please upgrade.", 403);
    }

    const aiPrompt = `
Create a social media post.

Topic: ${topic}
Platform: ${platform}
Tone: ${tone}
Goal: ${goal}

Return JSON only with this exact shape:
{
  "post": "string",
  "hashtags": ["tag1", "tag2", "tag3"],
  "insights": {
    "visibilityScore": 85,
    "bestTime": "string",
    "suggestedCTA": "string",
    "checklist": ["string", "string", "string"]
  }
}
`;

    let aiData;

    try {
      aiData = await callOpenAI(aiPrompt, PRIMARY_MODEL);
    } catch (firstError: any) {
      console.error("PRIMARY_MODEL_FAILED", {
        model: PRIMARY_MODEL,
        error: firstError?.message,
      });

      if (PRIMARY_MODEL !== FALLBACK_MODEL) {
        aiData = await callOpenAI(aiPrompt, FALLBACK_MODEL);
      } else {
        throw firstError;
      }
    }

    const content = aiData?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("OPENAI_EMPTY_CONTENT", aiData);
      return jsonError("AI returned empty content.", 502);
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error("OPENAI_JSON_PARSE_FAILED", content);
      return jsonError("AI returned invalid JSON.", 502, content);
    }

    const post = parsed.post || "";
    const hashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags : [];

    const insights = {
      visibilityScore: parsed.insights?.visibilityScore ?? 80,
      bestTime: parsed.insights?.bestTime ?? "Today at peak audience time",
      suggestedCTA: parsed.insights?.suggestedCTA ?? "Ask your audience to take action.",
      checklist: Array.isArray(parsed.insights?.checklist)
        ? parsed.insights.checklist
        : ["Clear hook", "Strong CTA", "Relevant hashtags"],
    };

    await prisma.user.update({
      where: { id: user.id },
      data: {
        postsUsed: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      plan,
      used: used + 1,
      post,
      hashtags,
      imageUrl: null,
      insights,
    });
  } catch (error: any) {
    console.error("GENERATE_ROUTE_FATAL", {
      message: error?.message,
      stack: error?.stack,
    });

    return jsonError(
      "AI provider failed.",
      502,
      process.env.NODE_ENV === "production" ? "Check Vercel function logs." : error?.message
    );
  }
}