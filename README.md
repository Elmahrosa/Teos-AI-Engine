# X-Teos Pro

AI-powered social growth across X, Instagram, and LinkedIn.
Built by Elmahrosa International · Alexandria, Egypt.

## Features
- AI post generation (Claude Haiku — fast + cheap)
- X + Instagram for all plans
- LinkedIn on Agency plan only
- 3-day free trial on Pro & Agency via Tap Payments
- Starter free forever (no card)
- Sign in with Google or X OAuth
- Real trial enforcement (auto-blocks after 3 days)
- Admin panel at `/api/admin`

## Pricing
| Plan | Price | LinkedIn | Trial |
|------|-------|----------|-------|
| Starter | Free | — | Free forever |
| Pro | $29/mo | — | 3 days via Tap |
| Agency | $99/mo | ✓ | 3 days via Tap |

## Setup

### 1. Clone and install
```bash
git clone https://github.com/Elmahrosa/x-teos-pro
cd x-teos-pro
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
# Fill in all values — see .env.example for details
```

Required keys:
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID/SECRET` — console.cloud.google.com
- `TWITTER_CLIENT_ID/SECRET` — developer.twitter.com
- `ANTHROPIC_API_KEY` — console.anthropic.com
- `RESEND_API_KEY` — resend.com
- `TAP_SECRET_KEY` + `TAP_WEBHOOK_SECRET` — business.tap.company

### 3. Run locally
```bash
npm run dev
# Visit http://localhost:3000
```

### 4. Deploy to Vercel
1. Push to GitHub
2. Import at vercel.com/new
3. Add all env vars in Vercel dashboard
4. Deploy

### 5. Configure Tap webhook
In Tap dashboard, set webhook URL to:
`https://your-domain.vercel.app/api/webhook/tap`

### 6. Admin panel
```
GET /api/admin
Authorization: Basic base64(username:password)
```
Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in env vars.

## Architecture
```
app/
  page.tsx          — Pricing page with Tap payment links
  login/page.tsx    — OAuth login (Google + X)
  dashboard/        — Post generator dashboard
  api/
    auth/           — NextAuth OAuth handlers
    generate/       — Claude AI post generation
    webhook/tap/    — Tap payment webhook (activates users)
    admin/          — Admin stats + user management
components/
  Providers.tsx     — SessionProvider wrapper
lib/
  auth.ts           — NextAuth config (Google + Twitter)
  claude.ts         — Anthropic SDK (Haiku model)
  db.ts             — File-based JSON storage
  email.ts          — Resend welcome emails
  plans.ts          — Single source of truth for plans
  tap.ts            — Tap webhook verification
middleware.ts       — Auth protection for dashboard + API
```

## Contact
ayman@teosegypt.com · teosegypt.com
