import { UserStatus } from "@prisma/client";
import { isAdminEmail } from "./access";

/**
 * Validates if a user's trial period has concluded based on 
 * trialEndsAt timestamp and account status.
 */
export function isTrialExpired(data: { 
  trialEndsAt: Date | null; 
  status: string; // or UserStatus if preferred
  email: string 
}): boolean {
  // 1. Admins are never expired
  if (isAdminEmail(data.email)) return false;

  // 2. Explicitly blocked users are considered "expired" (access denied)
  if (data.status === "blocked") return true;

  // 3. If they aren't in a trial state (e.g., they are 'pro'), they aren't expired
  if (data.status !== "trial") return false;

  // 4. If no end date exists but they are marked as 'trial', treat as expired for safety
  if (!data.trialEndsAt) return true;

  // 5. Final check: Is the current server time past the trial end date?
  return new Date() > new Date(data.trialEndsAt);
}
