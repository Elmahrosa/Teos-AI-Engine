import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';

export async function getCurrentUser() {
  const email = await getSessionEmail();
  if (!email) return null;
  return prisma.user.findUnique({
    where: { email },
    include: { posts: { orderBy: { createdAt: 'desc' }, take: 20 } },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

/**
 * Checks if an email is an admin.
 * Supports both ADMIN_EMAIL (single) and ADMIN_EMAILS (comma-separated list).
 * Set ONE of these in your Vercel env vars:
 *   ADMIN_EMAIL=ayman@teosegypt.com
 *   or
 *   ADMIN_EMAILS=ayman@teosegypt.com,other@example.com
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();

  // Support comma-separated list (ADMIN_EMAILS)
  const listEnv = process.env.ADMIN_EMAILS;
  if (listEnv) {
    const list = listEnv.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (list.includes(normalized)) return true;
  }

  // Support single value (ADMIN_EMAIL)
  const singleEnv = process.env.ADMIN_EMAIL;
  if (singleEnv && singleEnv.trim().toLowerCase() === normalized) return true;

  return false;
}
