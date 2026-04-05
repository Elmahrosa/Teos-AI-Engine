import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'teos_session';

function secret() {
  return process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET || 'dev-secret-change-me';
}

function sign(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export function createSessionValue(email: string) {
  const normalized = email.trim().toLowerCase();
  return `${normalized}.${sign(normalized)}`;
}

export function verifySessionValue(raw?: string | null) {
  if (!raw) return null;
  const parts = raw.split('.');
  if (parts.length < 2) return null;
  const sig = parts.pop()!;
  const email = parts.join('.').trim().toLowerCase();
  const expected = sign(email);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  const ok = crypto.timingSafeEqual(a, b);
  return ok ? email : null;
}

export async function getSessionEmail() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionValue(raw);
}

export async function setSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionValue(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}
