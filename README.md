# 🏺 Teos AI Engine
**AI Content Engine for Builders, Creators, and Agencies**
Powered by Elmahrosa International

---

## 🚀 Overview

Teos AI Engine is a production-ready AI SaaS platform that generates high-impact social media content across:

- X (Twitter)
- Facebook
- Instagram
- LinkedIn (Agency tier)

Built for founders, creators, and agencies who want to **automate content creation and growth**.

---

## ⚡ Core Features

- ✍️ AI-generated posts (prompt → ready content)
- 📊 Daily & lifetime usage tracking
- 🔒 Secure authentication (JWT + NextAuth support in pro-extension)
- 🧠 Plan-based feature gating (Starter / Pro / Agency / Lifetime)
- 💾 Persistent database (Prisma + PostgreSQL)
- 🛠 Admin dashboard (manual activation + billing control)
- 💳 Payment-ready (Dodo, PayPal, Crypto, Pi, Tap)
- 🧩 Pro Extension module for legacy compatibility

---

## 📦 Repository Structure (Post-Merge)

This repo consolidates **Teos-AI-Engine** (core) and **x-teos-pro** (legacy MVP).

```
Teos-AI-Engine/
├── app/                    # Next.js App Router pages & API routes
├── components/             # Shared React components
├── lib/                    # Core library (auth, AI, limits, payments)
├── prisma/                 # Schema, migrations, seed
├── public/                 # Static assets
├── test/                   # Vitest test suite
├── pro-extension/          # x-teos-pro assets (legacy compatibility)
│   ├── lib/                # Legacy lib modules (access, tap, rate-limit, etc.)
│   ├── types/              # NextAuth type extensions
│   ├── components/         # Providers.tsx, plans.ts
│   ├── app/                # Privacy & Terms pages
│   ├── scripts/            # Git sync / dev workflow scripts
│   ├── config/             # Legacy Vercel/Next configs
│   └── docs/               # Audit & QA docs
├── .env.example            # Unified env config (all providers)
└── .github/workflows/      # CI + optional Vercel deploy
```

---

## 🧠 SaaS Logic

| Plan      | Price        | Daily Limit      | Platforms                          |
|-----------|-------------|------------------|------------------------------------|
| Starter   | Free        | 5 posts lifetime | X                                  |
| Pro       | $19/mo      | 50 posts/day     | X, Facebook, Instagram, LinkedIn   |
| Agency    | $49/mo      | 200 posts/day    | X, Facebook, Instagram, LinkedIn   |
| Lifetime  | $149 (once) | 100 posts/day    | X, Facebook, Instagram, LinkedIn   |

Features:
- Daily reset system
- Per-user tracking
- Automatic limit enforcement
- Post persistence

---

## 💳 Payments

| Method           | Source            |
|-----------------|-------------------|
| Dodo Payments   | Teos-AI-Engine     |
| PayPal          | Teos-AI-Engine     |
| USDC (Solana)   | Teos-AI-Engine     |
| Pi Network      | Teos-AI-Engine     |
| Tap Payments    | x-teos-pro (legacy)|

---

## 🧪 Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

---

## 🏗️ Architecture

| Layer          | Technology                    |
|---------------|-------------------------------|
| Framework     | Next.js 14 (App Router)       |
| Database      | PostgreSQL (Neon) + Prisma    |
| Auth          | JWT (core) / NextAuth (ext)   |
| AI Providers  | OpenAI, Gemini, Claude        |
| Testing       | Vitest                        |
| Styling       | Tailwind CSS                  |
| CI/CD         | GitHub Actions                |

---

## 🔀 Merge History

This repo is the result of consolidating two repositories:

| Repository       | Role                    | Status   |
|-----------------|-------------------------|----------|
| Teos-AI-Engine  | Primary SaaS engine     | Active   |
| x-teos-pro      | MVP extension layer     | Merged → `/pro-extension` |

**Strategy**: Option B — x-teos-pro rebuilt as a dedicated module (`/pro-extension`) inside Teos-AI-Engine.

### What was merged from x-teos-pro:
- **Library modules**: access control, Claude AI client, rate limiting, Tap payments, trial logic, validation schemas, constants, plan config
- **Types**: NextAuth type extensions (`next-auth.d.ts`)
- **Components**: Session Provider wrapper, plan definitions
- **Pages**: Privacy Policy, Terms of Service
- **Scripts**: Git sync/launch workflow
- **Configs**: Vercel deploy config, .vercelignore, legacy next.config
- **Docs**: Audit verdict, pre-launch QA checklist

### What was kept from Teos-AI-Engine (base):
- Full SaaS engine with auth, AI generation, limits, admin dashboard
- Prisma schema, migrations, seed data
- Payment integrations (Dodo, PayPal, Crypto, Pi)
- CI pipeline, test suite
- All existing API routes and pages

---

## 🏛️ Elmahrosa International

Founder: Ayman Seif
Vision: Build sovereign AI-powered systems for global scale

---

## 📜 License

Proprietary — Elmahrosa International
Not for redistribution without permission
