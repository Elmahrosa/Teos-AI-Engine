export const PLAN_LIMITS = {
  starter: 5,
  pro: 50,
  agency: 200,
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;

export function normalizePlan(plan?: string | null): PlanName {
  if (!plan) return "starter";

  const p = plan.trim().toLowerCase();

  if (p === "pro") return "pro";
  if (p === "agency") return "agency";

  return "starter";
}

export function canGenerate(
  plan?: string | null,
  usedCount = 0,
  isAdmin = false,
  lifetime = false
): boolean {
  if (isAdmin || lifetime) return true;

  const normalized = normalizePlan(plan);
  const limit = PLAN_LIMITS[normalized];

  return usedCount < limit;
}

export function canUseLinkedIn(
  plan?: string | null,
  isAdmin = false,
  lifetime = false
): boolean {
  if (isAdmin || lifetime) return true;

  return normalizePlan(plan) === "agency";
}

export function getRemainingPosts(
  plan?: string | null,
  usedCount = 0,
  isAdmin = false,
  lifetime = false
): number | null {
  if (isAdmin || lifetime) return null;

  const normalized = normalizePlan(plan);
  const limit = PLAN_LIMITS[normalized];

  return Math.max(0, limit - usedCount);
}

export function isAtLimit(
  plan?: string | null,
  usedCount = 0,
  isAdmin = false,
  lifetime = false
): boolean {
  return !canGenerate(
    plan,
    usedCount,
    isAdmin,
    lifetime
  );
}