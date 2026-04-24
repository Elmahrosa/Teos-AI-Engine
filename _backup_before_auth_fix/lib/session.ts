import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "teos_session";

function sign(value: string) {
  const secret = process.env.SESSION_SECRET || "dev_session_secret_change_me";
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export async function createSession(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const payload = Buffer.from(normalizedEmail).toString("base64url");
  const signature = sign(payload);
  const token = `${payload}.${signature}`;

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function clearSession() {
  await destroySession();
}

export async function getSessionEmail() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (sign(payload) !== signature) return null;

  try {
    return Buffer.from(payload, "base64url").toString("utf8").toLowerCase();
  } catch {
    return null;
  }
}