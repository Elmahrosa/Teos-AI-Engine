import { UserStatus } from "@prisma/client";

export function isTrialExpired(params: {
  trialStart: Date | null;
  status: UserStatus;
  email: string;
}): boolean {
  if (params.status !== "trial") return false;
  if (!params.trialStart) return true;

  const TRIAL_DAYS = 7; // adjust as needed
  const expiry = new Date(params.trialStart);
  expiry.setDate(expiry.getDate() + TRIAL_DAYS);

  return new Date() > expiry;
}
