# PayPal Integration — Teos AI Engine
Generated: 2026-04-05

## What was added

| File | Action |
|------|--------|
| `lib/payments.ts` | Added `paypal` field to config and plan amounts |
| `components/PaymentBlock.tsx` | Full rewrite — PayPal tab added as default, USDC and Pi as alternatives |
| `components/PricingCards.tsx` | Added PayPal badge to Pro/Agency cards + updated payment notice |
| `app/api/paypal-payment/route.ts` | NEW — API route to record PayPal TX submission |
| `components/PaypalSubmit.tsx` | NEW — Dashboard widget for submitting PayPal TX ID |
| `PAYPAL_SETUP.env` | Instructions + env var to add |

---

## Integration steps (in your codebase)

### 1. Copy files
Copy all files from this folder into your Teos-AI-Engine repo, preserving the paths.

### 2. Set your PayPal.me link
Go to https://www.paypal.com/paypalme/ → create your PayPal.me link.
Add to `.env` and Vercel env vars:
```
NEXT_PUBLIC_PAYPAL_ME=https://paypal.me/YourUsername
```

### 3. Add PaypalSubmit to your dashboard
In `app/dashboard/page.tsx`, import and use the PaypalSubmit widget where users can
submit their TX ID after paying. Example:

```tsx
import PaypalSubmit from '@/components/PaypalSubmit';

// Inside the upgrade section of the dashboard:
{user.plan === 'starter' && (
  <PaypalSubmit plan="pro" onSuccess={() => router.refresh()} />
)}
```

### 4. Admin panel — no changes needed
The admin panel already fetches `BillingEvent` rows and shows an "Approve" button.
PayPal payments show up there with `provider: 'paypal'` — you can see the TX ID
submitted by the user in the `txHash` column, verify it in your PayPal account,
then click Approve.

### 5. Deploy
```bash
git add .
git commit -m "feat: add PayPal payment method"
git push
```

---

## How the flow works

```
User clicks "Pay $29 with PayPal"
  → Opens paypal.me/YourUsername/29USD (pre-filled amount)
  → PayPal processes payment
  → User gets PayPal receipt email with Transaction ID

User opens dashboard → PaypalSubmit widget
  → Pastes Transaction ID (e.g. 5ML12345XX1234567)
  → POST /api/paypal-payment → creates BillingEvent (status: pending)

Admin opens /admin
  → Sees PayPal billing event with TX ID
  → Verifies in PayPal account (paypal.com/activity)
  → Clicks Approve → plan activates immediately
```

---

## No PayPal API key needed
This uses **PayPal.me** (a simple redirect link) — no webhooks, no PayPal SDK,
no OAuth setup. The manual confirmation flow is identical to how USDC and Pi work.
You can upgrade to automated PayPal webhooks later once volume justifies it.

---

## FINAL AUDIT STATUS

### 🔴 STILL NEEDED before Vercel deploy

1. **Fix schema.prisma** → change `provider = "sqlite"` to `"postgresql"`
2. **Run new Prisma migration** (adds `password` + `role` columns):
   ```bash
   npx prisma migrate dev --name add_password_role
   ```
3. **Install bcryptjs**:
   ```bash
   npm install bcryptjs @types/bcryptjs
   ```
4. **Fix signup route** → use prisma singleton from `lib/db.ts`
5. **Set all env vars in Vercel** (see .env.production.template)
6. **Set NEXT_PUBLIC_PAYPAL_ME** in Vercel env vars

### ✅ DONE
- PayPal payment method added (PaymentBlock, PricingCards, API route, dashboard widget)
- All payment methods unified: PayPal · USDC · Pi
- No external PayPal SDK or API key required
- Admin approval flow works with PayPal same as USDC/Pi
