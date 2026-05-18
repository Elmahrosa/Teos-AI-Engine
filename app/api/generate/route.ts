import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionEmail } from "@/lib/session";
import { google } from "@ai-sdk/google";
import { Anthropic } from "@anthropic-ai/sdk";
import { generateText } from "ai";

const generateSchema = z.object({
  prompt: z.string().min(5),
  platform: z.enum(["x", "facebook", "instagram", "linkedin", "threads"]),
});

export async function POST(request: Request) {
  try {
    // 1. التحقق من هوية المستخدم ومطابقة الـ Schema الفعلية لقاعدة البيانات
    const email = await getSessionEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // If they are on the free/starter plan AND their status is explicitly 'trial' (expired/restricted), block them.
    // Paid plans bypass this check even if the database default hasn't updated yet.
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.plan === "free" && user.status === "trial") {
      return NextResponse.json({ error: "Your free trial has ended. Please upgrade your plan!" }, { status: 403 });
    }

    const body = await request.json();
    const parseResult = generateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid platform or prompt configuration." }, { status: 400 });
    }

    const { prompt, platform } = parseResult.data;

    // 2. حارس المنصات الخاص بباقة الـ Lifetime (حظر LinkedIn و Threads)
    if (user.plan === "lifetime") {
      const allowedPlatforms = ["x", "facebook", "instagram"];
      if (!allowedPlatforms.includes(platform)) {
        return NextResponse.json({
          error: `Your Lifetime plan unlocks X, Facebook, and Instagram only. Upgrade to Agency to unlock ${platform.toUpperCase()}!`,
        }, { status: 403 });
      }
    }

    let generatedOutput = "";
    const systemInstruction = `You are an expert social media copywriter. Write a high-converting post optimized specifically for ${platform.toUpperCase()}.`;

    // 3. التوجيه الديناميكي المتوافق مع الـ Engines والموديلات المخفية
    if (user.plan === "agency") {
      // عملاء النخبة: Claude 3.5 Sonnet عبر الـ Anthropic SDK المباشر
      const anthropicKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicKey) {
        return NextResponse.json({ error: "Elite AI Engine configuration missing." }, { status: 500 });
      }

      const anthropic = new Anthropic({ apiKey: anthropicKey });
      const completion = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages: [{ role: "user", content: `${systemInstruction}\n\nUser Request: ${prompt}` }],
      });

      const block = completion.content[0];
      generatedOutput = block.type === "text" ? block.text : "No text generated";
    } else if (user.plan === "pro" || user.plan === "lifetime") {
      // الفئة المتوسطة وعرض الـ Pi اللحظي: Gemini 1.5 Pro عبر Vercel AI SDK
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return NextResponse.json({ error: "Advanced AI Engine configuration missing." }, { status: 500 });
      }

      const { text } = await generateText({
        model: google("models/gemini-1.5-pro"),
        prompt: `${systemInstruction}\n\nUser Request: ${prompt}`,
      });
      generatedOutput = text;
    } else {
      // الفئة المجانية والـ Starter الاقتصادي: Gemini 1.5 Flash الخفيف
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return NextResponse.json({ error: "Standard AI Engine configuration missing." }, { status: 500 });
      }

      const { text } = await generateText({
        model: google("models/gemini-1.5-flash"),
        prompt: `${systemInstruction}\n\nUser Request: ${prompt}`,
      });
      generatedOutput = text;
    }

    // 4. الحفظ في الـ Table الصحيح تماماً (prisma.auditLog) لمنع كسر الداتابيز
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: `GENERATE_POST_${platform.toUpperCase()}`,
        metadata: {
          prompt,
          characterCount: generatedOutput.length,
          platform,
        } as any,
        ip: (request as NextRequest).headers.get("x-forwarded-for") ?? undefined,
      },
    });

    return NextResponse.json({
      success: true,
      platform,
      content: generatedOutput,
    });
  } catch (error) {
    console.error("[FINAL_COMPLIANT_GENERATION_ERROR]:", error);
    return NextResponse.json({ error: "Generation process encountered a schema alignment error." }, { status: 500 });
  }
}
