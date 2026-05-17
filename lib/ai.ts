import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { generateObject, generateText, streamText } from "ai";
import type { z } from "zod";
import { trace } from "./trace";

type Provider = "gemini" | "claude";

type AIConfig = {
  provider?: Provider;
  timeout?: number;
  maxRetries?: number;
};

type GenerateParams<T> = {
  prompt: string;
  schema: z.ZodType<T>;
  config?: AIConfig;
  trace?: { requestId: string; event: string };
};

type StreamParams = {
  prompt: string;
  config?: AIConfig;
  trace?: { requestId: string; event: string };
};

const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_MAX_RETRIES = 2;

function getModel(provider: Provider = "gemini") {
  return provider === "claude"
    ? anthropic("claude-3-5-sonnet-20241022")
    : google("gemini-2.0-flash");
}

function selectProvider(config?: AIConfig): Provider {
  const preferred = config?.provider ?? "gemini";
  if (preferred === "gemini" && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    if (process.env.ANTHROPIC_API_KEY) return "claude";
    return "gemini";
  }
  if (preferred === "claude" && !process.env.ANTHROPIC_API_KEY) {
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "gemini";
    return "claude";
  }
  return preferred;
}

export async function generate<T>(params: GenerateParams<T>): Promise<T> {
  const { prompt, schema, config = {}, trace: traceCtx } = params;
  const provider = selectProvider(config);
  const timeout = config.timeout ?? DEFAULT_TIMEOUT;
  const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
  const model = getModel(provider);
  const start = Date.now();

  try {
    const result = await generateObject({
      model,
      prompt,
      schema,
    } as any);

    if (traceCtx) {
      trace({
        requestId: traceCtx.requestId,
        event: traceCtx.event,
        provider,
        durationMs: Date.now() - start,
        status: "success",
      });
    }

    return result.object as T;
  } catch (err: any) {
    if (traceCtx) {
      trace({
        requestId: traceCtx.requestId,
        event: traceCtx.event,
        provider,
        durationMs: Date.now() - start,
        status: "error",
        error: err.message,
      });
    }
    throw err;
  }
}

export async function* stream(params: StreamParams): AsyncGenerator<string> {
  const { prompt, config = {}, trace: traceCtx } = params;
  const provider = selectProvider(config);
  const model = getModel(provider);
  const start = Date.now();

  try {
    const { textStream } = await streamText({ model, prompt });

    for await (const chunk of textStream) {
      yield chunk;
    }

    if (traceCtx) {
      trace({
        requestId: traceCtx.requestId,
        event: traceCtx.event,
        provider,
        status: "success",
        durationMs: Date.now() - start,
      });
    }
  } catch (err: any) {
    if (traceCtx) {
      trace({
        requestId: traceCtx.requestId,
        event: traceCtx.event,
        provider,
        status: "error",
        error: err.message,
        durationMs: Date.now() - start,
      });
    }
    throw err;
  }
}

export function isAIEnabled(): boolean {
  return !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.ANTHROPIC_API_KEY);
}

export const ai = { generate, stream, isEnabled: isAIEnabled };
