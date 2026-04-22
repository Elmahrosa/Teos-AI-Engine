export const PLAN_LIMITS = {
  starter: 10,
  pro: 500,
  agency: Infinity,
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;

export function normalizePlan(plan?: string | null): PlanName {
  if (!plan) return "starter";
  const p = plan.toLowerCase();

  if (p === "pro") return "pro";
  if (p === "agency") return "agency";
  return "starter";
}

export function canGenerate(plan?: string | null, usedCount = 0): boolean {
  const normalized = normalizePlan(plan);
  return usedCount < PLAN_LIMITS[normalized];
}

export function canUseLinkedIn(plan?: string | null): boolean {
  const normalized = normalizePlan(plan);
  return normalized === "agency";
}

export function getRemainingPosts(plan?: string | null, usedCount = 0): number | null {
  const normalized = normalizePlan(plan);
  const limit = PLAN_LIMITS[normalized];

  if (!Number.isFinite(limit)) return null;
  return Math.max(0, limit - usedCount);
}