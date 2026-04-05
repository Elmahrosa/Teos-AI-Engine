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

export function isAdminEmail(email?: string | null) {
  return !!email && email.toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase();
}
