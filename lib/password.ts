import bcrypt from "bcryptjs";
import { scryptSync, timingSafeEqual } from "crypto";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  if (hash.includes(":")) {
    const [salt, key] = hash.split(":");
    const derived = scryptSync(password, salt, 64).toString("hex");
    const valid = timingSafeEqual(Buffer.from(key), Buffer.from(derived));
    return valid;
  }
  return bcrypt.compare(password, hash);
}

export function isLegacyHash(hash: string): boolean {
  return hash.includes(":");
}
