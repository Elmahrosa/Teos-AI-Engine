import { cookies } from "next/headers";

const COOKIE_NAME = "teos_session";

export function createSession(email: string) {
  cookies().set(COOKIE_NAME, email, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export function getSessionEmail() {
  const cookie = cookies().get(COOKIE_NAME);
  return cookie?.value || null;
}