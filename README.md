# Teos AI Engine

AI-powered social media content generation for X, Facebook, Instagram, and LinkedIn.
Built by Elmahrosa International · Alexandria, Egypt 🇪🇬

## Stack

- **Next.js 14** App Router
- **Prisma + Neon Postgres** (production) / SQLite (local dev only)
- **OpenAI API** with built-in fallback templates
- **Tailwind CSS**
- **HMAC session cookies** — no NextAuth dependency

## Plans

| Plan | Price | Posts | LinkedIn |
|------|-------|-------|----------|
| Starter | Free forever | 10 | ✗ |
| Pro | $29 (PayPal / USDC / 14.5 Pi) | Unlimited | ✗ |
| Agency | $99 (PayPal / USDC / 49.5 Pi) | Unlimited | ✓ |

Pi users get 50% off · First 300 users only.

## Payment Methods

- **PayPal** — Default. User pays via PayPal.me link, submits TX ID from dashboard.
- **USDC on Solana** — Send to your Solana wallet address.
- **Pi Network** — 50% off for first 300 users.

All methods use manual confirmation: user submits proof → founder approves at /admin.

---

## Local development (SQLite)

```bash
# 1. Clone
git clone https://github.com/Elmahrosa/Teos-AI-Engine
cd Teos-AI-Engine

# 2. Install
npm install

# 3. Env
cp .env.example .env
# Edit .env:
#   - Comment out DATABASE_URL Neon lines
#   - Uncomment the SQLite lines
#   - Switch prisma/schema.prisma provider to "sqlite" and remove directUrl
#   - Set NEXTAUTH_SECRET  (openssl rand -base64 32)
#   - Set ADMIN_EMAIL

# 4. DB setup
npx prisma db push
npm run db:seed

# 5. Run
npm run dev
```

Open http://localhost:3000

---

## Production deployment (Vercel + Neon)

### Step 1 — Neon database
1. neon.tech → New Project → name: teos-ai-engine, region: Europe West
2. Copy pooled connection string → DATABASE_URL
3. Copy direct connection string → DATABASE_URL_DIRECT

### Step 2 — Deploy
```bash
npm i -g vercel && vercel login
vercel deploy --prod
```

### Step 3 — Vercel environment variables

| Variable | Value |
|----------|-------|
| DATABASE_URL | Neon pooled connection string |
| DATABASE_URL_DIRECT | Neon direct connection string |
| NEXTAUTH_SECRET | openssl rand -base64 32 |
| SESSION_SECRET | openssl rand -base64 32 |
| NEXT_PUBLIC_APP_URL | your Vercel URL |
| ADMIN_EMAIL | aams1969@gmail.com |
| OPENAI_API_KEY | your OpenAI key (optional) |
| OPENAI_MODEL | gpt-4.1-nano |
| NEXT_PUBLIC_USDC_SOL_ADDRESS | your Solana wallet |
| NEXT_PUBLIC_PI_ADDRESS | your Pi address |
| NEXT_PUBLIC_PI_PROMO_ENABLED | true |
| NEXT_PUBLIC_PI_PROMO_DISCOUNT | 50 |
| NEXT_PUBLIC_PI_PROMO_LIMIT | 300 |
| NEXT_PUBLIC_PAYPAL_ME | https://paypal.me/YourUsername |

### Step 4 — Migrate + seed
```bash
npx prisma migrate deploy
npm run db:seed
```

### Step 5 — Redeploy
```bash
vercel deploy --prod
```

---

## Routes

| Route | Description |
|-------|-------------|
| / | Landing page + pricing |
| /login | Email login |
| /dashboard | Post generator + PayPal TX submit |
| /admin | Founder dashboard |
| /success | USDC/Pi TX hash submission |
| /api/health | Health check |
| /api/paypal-payment | PayPal TX ID endpoint |

---

## License

MIT · © 2026 Elmahrosa International
