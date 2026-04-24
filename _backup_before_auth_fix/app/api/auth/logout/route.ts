import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/session';

export async function POST(req: Request) {
  await clearSession();
  const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  return NextResponse.redirect(new URL('/', base));
}
