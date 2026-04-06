// lib/plans.ts - Plan & Platform Configuration

export const PLANS = {
  starter: {
    label: "Starter",
    platforms: ["x"] as const,
    postsPerDay: 5,
  },
  pro: {
    label: "Pro",
    platforms: ["x", "facebook", "instagram", "linkedin"] as const,
    postsPerDay: 50,
  },
  agency: {
    label: "Agency",
    platforms: ["x", "facebook", "instagram", "linkedin"] as const,
    postsPerDay: -1, // unlimited
  },
} as const;

export type Plan = keyof typeof PLANS;

export const PLATFORM_LABELS: Record<string, string> = {
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
