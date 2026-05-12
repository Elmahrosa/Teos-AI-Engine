// lib/plans.ts - Plan & Platform Configuration

export type Platform = "x" | "facebook" | "instagram" | "linkedin";

export const PLANS = {
  starter: {
    label: "Starter",
    platforms: ["x"] as Platform[],
    postsPerDay: 5,
  },
  pro: {
    label: "Pro",
    platforms: ["x", "facebook", "instagram", "linkedin"] as Platform[],
    postsPerDay: 50,
  },
  agency: {
    label: "Agency",
    platforms: ["x", "facebook", "instagram", "linkedin"] as Platform[],
    postsPerDay: -1,
  },
} as const;

export type Plan = keyof typeof PLANS;

export const PLATFORM_LABELS: Record<Platform, string> = {
  x: "X (Twitter)",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

export function getPlan(planName: string): Plan {
  if (planName in PLANS) {
    return planName as Plan;
  }
  return "starter";
}

export function trialExpired(trialEnd: Date | null): boolean {
  if (!trialEnd) return false;
  return new Date() > trialEnd;
}
