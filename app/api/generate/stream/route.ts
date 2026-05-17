import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ai } from "@/lib/ai";
import { canUserPost, ensureUserExists } from "@/lib/db";
import { generateRequestId, trace } from "@/lib/trace";
import { withRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const streamSchema = z.object({
  prompt: z.string().trim().min(10).max(500),
  platform: z.enum(["x", "instagram", "linkedin"]).optional(),
});

export async function POST(req: NextRequest) {
  return withRateLimit(req, "medium", async (): Promise<NextResponse> => {
    const requestId = generateRequestId();
    const start = Date.now();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = streamSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { prompt } = parsed.data;

    const user = await ensureUserExists(session.user.email, session.user.name || undefined);
    const check = await canUserPost(user.id, user.plan);
    if (!check.allowed) {
      return NextResponse.json({ error: check.reason, limitReached: true }, { status: 429 });
    }

    trace({
      requestId,
      event: "generate.stream.start",
      durationMs: Date.now() - start,
      status: "success",
    });

    const stream = ai.stream({
      prompt: `Write a social media post about: ${prompt}. Keep it sharp and useful.`,
      trace: { requestId, event: "generate.stream" },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err: any) {
          trace({
            requestId,
            event: "generate.stream.error",
            durationMs: Date.now() - start,
            status: "error",
            error: err.message,
          });
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Request-ID": requestId,
      },
    });
  });
}
