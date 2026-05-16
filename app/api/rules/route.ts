import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // These would typically come from a database or config file
  // For now, returning static compliance rules aligned with Sentinel Shield
  const rules = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    rules: [
      {
        id: "BASE64_EXECUTION",
        description: "Blocks base64-encoded executable payloads in user input",
        pattern: /[A-Za-z0-9+/]{20,}={0,2}/,
        action: "BLOCK",
        severity: "HIGH"
      },
      {
        id: "NETWORK_EXFIL_HTTP",
        description: "Prevents HTTP-based data exfiltration attempts",
        pattern: /(?:http|ftp)s?:\/\/(?:[\w-]+\.)+[\w-]+(?:\/[\w\-\.\/?%&=]*)?/i,
        action: "BLOCK",
        severity: "HIGH"
      },
      {
        id: "PROMPT_INJECTION",
        description: "Detects and blocks prompt injection attempts",
        patterns: [
          /ignore\s+previous\s+instructions/i,
          /disregard\s+all\s+prior\s+directions/i,
          /you\s+are\s+now\s+a/i,
          /system\s*:\s*/i
        ],
        action: "BLOCK",
        severity: "MEDIUM"
      },
      {
        id: "SQL_INJECTION",
        description: "Blocks SQL injection attempts",
        patterns: [
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b.*\b(WHERE|FROM|TABLE)\b)/i,
          /['"]\s*(OR|AND)\s*['"]/i,
          /--\s*$/,
          /;\s*$/
        ],
        action: "BLOCK",
        severity: "HIGH"
      },
      {
        id: "XSS_ATTEMPT",
        description: "Blocks cross-site scripting attempts",
        patterns: [
          /<script[^>]*>[\s\S]*?<\/script>/i,
          /on\w+\s*=/i,
          /javascript:/i,
          /data:/i
        ],
        action: "BLOCK",
        severity: "HIGH"
      }
    ]
  };

  return NextResponse.json(rules, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600", // 1 hour
    }
  });
}
