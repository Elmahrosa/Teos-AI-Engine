import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'teos_session';

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET;
  if (!s) {
    // In production, crash hard — don't silently use a known fallback
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[teos] NEXTAUTH_SECRET or SESSION_SECRET env var is required in production. Set it in Vercel.'
      );
    }
    // In dev, warn loudly but allow
    console.warn('[teos] WARNING: No session secret set. Using insecure dev default.');
    return 'dev-secret-change-me-do-not-use-in-prod';
  }
  return s;
}

function sign(value: string): string {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export function createSessionValue(email: string): string {
  const normalized = email.trim().toLowerCase();
  return `${normalized}.${sign(normalized)}`;
}

export function verifySessionValue(raw?: string | null): string | null {
  if (!raw) return null;
  const parts = raw.split('.');
  if (parts.length < 2) return null;
  const sig = parts.pop()!;
  const email = parts.join('.').trim().toLowerCase();
  const expected = sign(email);
  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return null;
  return crypto.timingSafeEqual(a, b) ? email : null;
}

export async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionValue(raw);
}

export async function setSession(email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionValue(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}
