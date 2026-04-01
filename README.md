# X-Teos Pro — final rebuild

This is the cleaned, complete rebuild of the X-Teos Pro Next.js application.

## What is included

- Next.js 14 app router structure
- NextAuth session flow with credentials + optional Google and X/Twitter providers
- PostgreSQL + Prisma storage for users, posts, and Tap billing events
- Post generation route using Anthropic through the AI SDK, with a safe demo fallback
- Premium dark landing page
- Real dashboard with post generator and saved post history
- Session-protected admin page
- Tap webhook signature verification and billing event logging
- Terms and Privacy pages
- `.env.example`, loading state, icon, cleanup, and safer README

## What was fixed

- Added the missing `Providers` wrapper so session-driven client UI works
- Kept real auth providers instead of an empty providers array
- Replaced localhost metadata base with environment-driven `APP_URL`
- Preserved safe Postgres schema by keeping `externalEventId String? @unique`
- Added a working post generator to the dashboard
- Added terms/privacy pages and removed customer-facing dependence on `AUDIT.md`
- Removed unsafe `git push --force` instruction
- Added loading state and icon support
- Kept Tap webhook verification as real HMAC logic

## Required environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required for local development:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `APP_URL`
- `ADMIN_EMAILS`

Optional but recommended:

- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `TAP_WEBHOOK_SECRET`
- `TAP_PRO_LINK`
- `TAP_AGENCY_LINK`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `TWITTER_CLIENT_ID`
- `TWITTER_CLIENT_SECRET`

## Local run

```bash
npm install
npx prisma db push
npm run dev
```

## Deploy

Deploy on Vercel, and use a managed PostgreSQL database such as Neon, Supabase, or RDS.

### Deployment checklist

1. Set all required environment variables
2. Run `npx prisma db push`
3. Set Tap webhook target to `/api/webhook/tap`
4. Add your admin email to `ADMIN_EMAILS`
5. Test login, generation, billing webhook, and dashboard access

## Honest limit

This is a solid final MVP / launchable baseline, not a 10/10 enterprise SaaS.
If you want the next level after this, add:

- Tap API session creation instead of static invoice links
- usage quotas and rate limiting
- audit trails for admin actions
- retry jobs / queues for billing and email
- tests for auth, billing, and replay protection
