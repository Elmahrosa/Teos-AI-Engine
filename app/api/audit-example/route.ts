import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Example audit entry showing what a real audit log entry looks like
  const exampleAuditEntry = {
    id: "audit_20260510_001",
    userId: "user_123abc",
    action: "POST_GENERATED",
    resourceId: "post_456def",
    resourceType: "POST",
    details: {
      topic: "AI safety in autonomous vehicles",
      platform: "X",
      tone: "Professional",
      goal: "Engagement",
      visibilityScore: 87,
      postLength: 245,
      hashtags: ["AI", "AutonomousVehicles", "SafetyFirst"],
      wasFallback: false,
      generationTimeMs: 1240
    },
    ipAddress: "203.0.113.42",
    userAgent: "Mozilla/5.0 (compatible; TeosBot/1.0)",
    createdAt: "2026-05-10T10:30:00.000Z"
  };

  return NextResponse.json(exampleAuditEntry, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300", // 5 minutes
    }
  });
}
