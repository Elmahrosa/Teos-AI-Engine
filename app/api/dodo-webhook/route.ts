import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 🔐 Loaded from environment (DO NOT hardcode)
const DODO_WEBHOOK_SECRET = process.env.notepad app/api/dodo-webhook/route.ts
;

/**
 * Verify webhook signature from Dodo
 */
function verifySignature(payload: string, signature: string | null) {
  if (!signature || !DODO_WEBHOOK_SECRET) return false;

  const expected = crypto
    .createHmac('sha256', DODO_WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex');

  const expectedSignature = `sha256=${expected}`;

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}

/**
 * Normalize email
 */
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * Map Dodo Product IDs → Your Plans
 * ⚠️ MUST match EXACT IDs from Dodo dashboard
 */
const PRODUCT_MAP: Record<
  string,
  { plan: 'pro' | 'agency'; cycle: 'monthly' | 'yearly' | 'lifetime' }
> = {
  'pdt_0NdD9rAUd0JHiV9MBHMQ3': { plan: 'agency', cycle: 'monthly' },
  'pdt_0NdKROHokTHJeCVrfxz7S': { plan: 'pro', cycle: 'yearly' },
  'pdt_0NdKROLMbZygp9KhvIqJD': { plan: 'agency', cycle: 'yearly' },
  'pdt_0NdKROPakM4X20mbE07jE': { plan: 'pro', cycle: 'lifetime' },
  'pdt_0NdKROSisHzGMkTGaJ2T2': { plan: 'agency', cycle: 'lifetime' },
  'pdt_0NdKFCdkDZ4bAdou4Z7cc': { plan: 'pro', cycle: 'monthly' },
};

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('x-dodo-signature');

  // 🔐 Verify request
  if (!verifySignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: any;

  try {
    event = JSON.parse(payload);
  } catch (err) {
    console.error('Invalid JSON:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // ✅ Prevent duplicate events
      const existing = await tx.paymentEvent.findUnique({
        where: { dodoEventId: event.id },
      });

      if (existing) return;

      await tx.paymentEvent.create({
        data: {
          dodoEventId: event.id,
          eventType: event.type,
        },
      });

      // 🔍 Extract product ID safely
      const productId =
        event?.data?.product_id ||
        event?.data?.product?.id ||
        event?.data?.subscription?.product_id ||
        event?.data?.subscription?.product?.id ||
        null;

      const product = productId ? PRODUCT_MAP[productId] : null;

      // 🔍 Find user
      let user = null;

      if (event?.data?.metadata?.user_id) {
        user = await tx.user.findUnique({
          where: { id: event.data.metadata.user_id },
        });
      }

      const customerEmail =
        event?.data?.customer?.email ||
        event?.data?.email ||
        event?.data?.customer_email ||
        null;

      if (!user && customerEmail) {
        user = await tx.user.findUnique({
          where: { email: normalizeEmail(customerEmail) },
        });
      }

      if (!user) {
        console.error('User not found:', {
          eventId: event.id,
          productId,
          customerEmail,
        });
        return;
      }

      // 🔄 Extract IDs
      const customerId =
        event?.data?.customer?.id ||
        event?.data?.customer_id ||
        null;

      const subscriptionId =
        event?.data?.subscription?.id ||
        event?.data?.subscription_id ||
        null;

      // 🔎 Debug logs (keep for testing)
      console.log('EVENT:', event.type);
      console.log('PRODUCT ID:', productId);
      console.log('EMAIL:', customerEmail);

      // ⚠️ If product not mapped
      if (!product) {
        console.error('Product not mapped:', productId);
        return;
      }

      // 🔥 Handle events
      switch (event.type) {
        case 'payment.succeeded':
          if (product.cycle === 'lifetime') {
            await tx.user.update({
              where: { id: user.id },
              data: {
                planTier: product.plan,
                billingCycle: 'lifetime',
                isLifetime: true,
                dodoCustomerId: customerId ?? user.dodoCustomerId,
                dodoSubscriptionId:
                  subscriptionId ?? user.dodoSubscriptionId,
                subscriptionStatus: 'active',
              },
            });
          }
          break;

        case 'subscription.active':
        case 'subscription.updated':
          await tx.user.update({
            where: { id: user.id },
            data: {
              planTier: product.plan,
              billingCycle: product.cycle,
              isLifetime:
                product.cycle === 'lifetime' ? true : user.isLifetime,
              dodoCustomerId: customerId ?? user.dodoCustomerId,
              dodoSubscriptionId:
                subscriptionId ?? user.dodoSubscriptionId,
              subscriptionStatus: 'active',
            },
          });
          break;

        case 'subscription.cancelled':
          if (!user.isLifetime) {
            await tx.user.update({
              where: { id: user.id },
              data: {
                planTier: 'starter',
                billingCycle: 'free',
                dodoSubscriptionId: null,
                subscriptionStatus: 'cancelled',
              },
            });
          }
          break;

        default:
          console.log('Unhandled event:', event.type);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}