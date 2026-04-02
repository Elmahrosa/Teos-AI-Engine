# X‑Teos Pro — Deployment‑Ready AI SaaS MVP

Repo: https://github.com/Elmahrosa/x-teos-pro  
Status: Deployment‑ready MVP (tested locally with Prisma + Neon)

---

## 🚀 Stack
- Next.js 14 (App Router)
- Prisma ORM + Neon Postgres
- NextAuth (session‑based auth + admin‑by‑email)
- Anthropic Claude (AI content generation)
- Tap Payments (webhook integration)

---

## ✨ Features
- AI post generation (X, Instagram, LinkedIn)
- Admin access (email‑based override)
- Starter / Pro / Agency plan logic
- Dashboard + saved posts system
- Clean SaaS UI ready for deployment

---

## ⚠️ Known Limitations
- No rate limiting yet (API abuse risk)
- No usage analytics
- Payment flow needs production hardening
- No logging/monitoring layer

---

## 📦 Installation

```bash
git clone https://github.com/Elmahrosa/x-teos-pro.git
cd x-teos-pro
npm install
npm run dev
```

---

## ⚙️ Environment Variables

Create `.env` from `.env.example`:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="https://your-app.vercel.app"

ANTHROPIC_API_KEY=""
TAP_WEBHOOK_SECRET=""

ADMIN_EMAILS="aams1969@gmail.com,admin@teosegypt.com"
LICENSE_KEY="your-license-key"
```

Validation enforced via `lib/env.ts` with Zod.

---

## 🧪 Testing

```bash
npm test
npm run test:e2e
```

- Jest unit tests for access logic
- Playwright E2E tests for dashboard & auth
- Coverage reports collected automatically

---

## 🔄 CI/CD

GitHub Actions workflows:
- **ci.yml** → Lint, Test, Build, Prisma push
- **deploy.yml** → Vercel Preview on PR

Secrets required:
- `VERCEL_TOKEN`
- `ORG_ID`
- `PROJECT_ID`

---

## 🛡️ Security & Licensing
- **Admin Emails**: Centralized in `ADMIN_EMAILS` env var
- **License Enforcement**: Middleware blocks `/api/*` unless `x-license-key` matches `LICENSE_KEY`
- **Free Tier Cap**: Starter plan limited; Pro/Agency unlock unlimited

---

## 💰 Monetization Strategy
- SaaS subscriptions: $29 Starter / $99 Pro
- Agency resale licensing ($997+ per license)
- Lead generation via LinkedIn + X

---

## 📊 Roadmap
- [ ] Rate limiting (critical)
- [ ] Stripe integration
- [ ] License system for resellers
- [ ] Analytics dashboard
- [ ] Logging & monitoring layer
```

---

## 🏆 Impact
This README now:
- Shows **setup + deployment steps** (reproducibility).
- Defines **env schema** (clarity for buyers).
- Highlights **tests + CI/CD** (trust for investors).
- Positions monetization with **license enforcement** (protects revenue).

