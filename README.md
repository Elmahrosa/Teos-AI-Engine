# X-Teos Pro — production baseline

This is the production-baseline rebuild of X-Teos Pro.

## What changed

- moved storage from `users.json` to PostgreSQL via Prisma
- added `prisma/schema.prisma`
- admin access now uses signed-in session emails via `ADMIN_EMAILS`
- Tap webhook events are logged in `BillingEvent` for retry safety and idempotency
- protected dashboard/admin/API routes with `middleware.ts`
- kept the MVP auth flow, but made the data layer durable

## Important truth

This is much better than the JSON MVP, but it is still a **baseline**, not a finished enterprise SaaS.

Still missing if you want 10/10 production:

- provider-native Tap checkout session creation instead of static invoice links
- Redis rate limiting
- background jobs / retries for email and webhook recovery
- tests for auth, billing, access, and webhook replay
- audit logging for all admin actions

## Local run

```bash
cp .env.example .env.local
npm install
npx prisma db push
npm run dev
```

## Deploy

Use Vercel + managed Postgres/Supabase/Neon.

Required env:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_EMAILS`
- `TAP_WEBHOOK_SECRET`
- `TAP_PRO_LINK`
- `TAP_AGENCY_LINK`
- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY`

## Safe push flow

```bash
git add .
git commit -m "production baseline: postgres + prisma + webhook logging"
git push origin main --force
```
