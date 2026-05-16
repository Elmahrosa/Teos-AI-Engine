import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const KEY_LEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, KEY_LEN).toString("hex");
  return `${salt}:${key}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":");
  const derivedKey = scryptSync(password, salt, KEY_LEN).toString("hex");
  return timingSafeEqual(Buffer.from(key), Buffer.from(derivedKey));
}
