export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export function canUseLinkedIn(user: { plan: string; email?: string | null }): boolean {
  if (isAdminEmail(user.email)) return true;
  return user.plan === "agency";
}

export function hasUnlimitedAccess(user: { email?: string | null; plan: string }) {
  return isAdminEmail(user.email) || user.plan === "pro" || user.plan === "agency";
}

export function canUseTrial(user: { trialEndsAt: Date | string | null; email?: string | null }) {
  if (isAdminEmail(user.email)) return true;
  return !!user.trialEndsAt && new Date() < new Date(user.trialEndsAt);
}