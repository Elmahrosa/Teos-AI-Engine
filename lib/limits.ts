export const PLAN_LIMITS = {
  starter: { posts: 10, linkedin: false, unlimited: false },
  pro: { posts: Infinity, linkedin: false, unlimited: true },
  agency: { posts: Infinity, linkedin: true, unlimited: true },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export function canGenerate(plan: string, used: number): boolean {
  const limits = PLAN_LIMITS[plan as Plan] ?? PLAN_LIMITS.starter;
  if (limits.unlimited) return true;
  return used < limits.posts;
}

export function canUseLinkedIn(plan: string): boolean {
  return (PLAN_LIMITS[plan as Plan] ?? PLAN_LIMITS.starter).linkedin;
}

export function getRemainingPosts(plan: string, used: number): number | null {
  const limits = PLAN_LIMITS[plan as Plan] ?? PLAN_LIMITS.starter;
  if (limits.unlimited) return null;
  return Math.max(0, limits.posts - used);
}
