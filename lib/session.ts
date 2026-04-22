import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "teos_session";
// Add your official admin email here
const ADMIN_EMAILS = ["aams1969@gmail.com", "ayman@teosegypt.com"]; 

function getSecret() {
  return (
    process.env.NEXTAUTH_SECRET ||
    process.env.SESSION_SECRET ||
    "dev-secret-change-me"
  );
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

/**
 * Checks if the current session belongs to a founder/admin
 */
export function isFounder(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export function createSession(email: string) {
  const normalized = email.trim().toLowerCase();
  const value = `${normalized}.${sign(normalized)}`;

  cookies().set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function getSessionEmail() {
  const raw = cookies().get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const parts = raw.split(".");
  if (parts.length < 2) return null;

  const sig = parts.pop()!;
  const email = parts.join(".").trim().toLowerCase();
  const expected = sign(email);

  return sig === expected ? email : null;
}

export function clearSession() {
  cookies().set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
  });
}