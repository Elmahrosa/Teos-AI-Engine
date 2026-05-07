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
  postsUsed = 0,
  isAdmin = false,
  isLifetime = false
): boolean {
  if (isAdmin || isLifetime) return true;
  const normalized = normalizePlan(plan);
  const limit = PLAN_LIMITS[normalized];
  return postsUsed < limit;
}

export function canUseLinkedIn(
  plan?: string | null,
  isAdmin = false,
  isLifetime = false
): boolean {
  if (isAdmin || isLifetime) return true;
  return normalizePlan(plan) === "agency";
}

export function getRemainingPosts(
  plan?: string | null,
  postsUsed = 0,
  isAdmin = false,
  isLifetime = false
): number | null {
  if (isAdmin || isLifetime) return null;
  const normalized = normalizePlan(plan);
  const limit = PLAN_LIMITS[normalized];
  return Math.max(0, limit - postsUsed);
}

export function isAtLimit(
  plan?: string | null,
  postsUsed = 0,
  isAdmin = false,
  isLifetime = false
): boolean {
  return !canGenerate(plan, postsUsed, isAdmin, isLifetime);
}
