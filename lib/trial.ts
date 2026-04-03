import { UserStatus } from "@prisma/client";
import { TRIAL_DAYS } from "./constants";
import { isAdminEmail } from "./access";

export function isTrialExpired(params: {
  trialStart: Date | null;
  status: UserStatus;
  email: string;
}): boolean {
  if (isAdminEmail(params.email)) return false;
  if (params.status !== "trial") return false;
  if (!params.trialStart) return true;

  const expiry = new Date(params.trialStart);
  expiry.setDate(expiry.getDate() + TRIAL_DAYS);

  return new Date() > expiry;
}
