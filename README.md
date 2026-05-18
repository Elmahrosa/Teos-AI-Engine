# 𓂀 TEOS AI Engine

**Know your post will perform — before you publish.**

TEOS AI Engine generates platform-optimized content across X, LinkedIn, Instagram, TikTok, Threads, Facebook, and Telegram — then scores it with the TEOS Signal Score™ (0–100) so you publish with confidence, not hope. Built in Alexandria, Egypt. Arabic-native.

[![Live App](https://img.shields.io/badge/Live%20App-teos--ai--engine.vercel.app-C9A84C?style=for-the-badge&logo=vercel&logoColor=black)](https://teos-ai-engine.vercel.app)
[![AI](https://img.shields.io/badge/AI-Claude%20Haiku-7B4FBF?style=for-the-badge)](https://anthropic.com)
[![Payments](https://img.shields.io/badge/Payments-Dodo%20%2B%20Pi%20%2B%20USDC%20on%20Base-C9A84C?style=for-the-badge)](https://dodo.pe)
[![Origin](https://img.shields.io/badge/Built%20In-Alexandria%20🇪🇬-green?style=for-the-badge)](https://www.linkedin.com/company/teos-pharaoh-portal)

---

## What makes TEOS different

Every AI content tool generates posts. TEOS generates posts and tells you if they'll land — before you publish. The TEOS Signal Score™ evaluates 10 signals (hook strength, specificity, platform fit, CTA clarity, hashtag quality, emotional trigger, novelty, length, engagement trigger, value proposition) and returns a score from 55–98 with ±3 variance across repeated prompts.

It also generates native Arabic content — not translated English — with MENA-specific hooks, hashtag pools, and posting times calibrated for GST/EGT.

---

## Pricing

All prices USD. Payments via Dodo (card) · Pi Network · USDC on Base (`0xd9CA11Dde3810a1BA9B5E1a4b6b76F5a419FAb41`).

| Plan | Price | Posts/day | Platforms | Link |
|------|-------|-----------|-----------|------|
| Starter | Free | 5 total | X + Instagram | [Sign up](https://teos-ai-engine.vercel.app/login) |
| Pro Monthly | $29/mo | 50 | 4 platforms | [Subscribe](https://dodo.pe/ljkagv2ixcr) |
| Pro Yearly | $290/yr | 50 | 4 platforms | [Subscribe](https://dodo.pe/ep9cgmojbua) |
| Agency Monthly | $69/mo | 200 | All 7 + 3 seats | [Subscribe](https://dodo.pe/dbvnd9a4pp) |
| Agency Yearly | $690/yr | 200 | All 7 + 3 seats | [Subscribe](https://dodo.pe/79q4irl1347) |
| **Pro Lifetime** | **$149 once** | Unlimited | All 7 + all upgrades | [Claim](https://dodo.pe/relh2gradr9) |
| **Agency Lifetime** | **$349 once** | Unlimited | All 7 + 5 seats + white-label | [Claim](https://dodo.pe/91zcmc4xi27) |

*Lifetime seat count is live on the app. Price rises after TikTok video generation ships.*

---

## Stack

```
Frontend   Next.js 14 App Router · React · Tailwind CSS
AI         Anthropic Claude Haiku (fast, cost-efficient)
Database   Prisma ORM · Neon PostgreSQL (serverless)
Auth       NextAuth.js
Payments   Dodo Payments · Pi Network · USDC on Base
Hosting    Vercel (edge + KV for seat counter)
Analytics  Vercel Analytics
```

---

## Repo structure

```
app/
├── page.tsx                     Landing page
├── dashboard/                   Generator dashboard
├── (auth)/                      Login + signup flows
├── pay/pi/                      Pi Network checkout
└── api/
    ├── generate/route.ts        AI generation endpoint
    ├── seats/route.ts           KV seat counter
    └── webhooks/dodo/           Payment webhook

components/
├── PostGenerator.tsx            Main generator (bilingual)
├── payments/                    PaymentBlock + PricingCards
├── StickyCTA.tsx                Mobile conversion bar
├── ExitPopup.tsx                Exit intent popup
└── landing/                     Landing page sections

lib/
├── ai/platforms.ts              Platform configs + signal scoring
├── arabic-prompts.ts            Arabic content system
├── payments.ts                  Dodo + Pi payment helpers
├── auth.ts                      NextAuth config
└── limits.ts                    Usage limits per plan
```

---

## Self-deploy

```bash
git clone https://github.com/Elmahrosa/Teos-AI-Engine
cd Teos-AI-Engine
npm install
cp .env.example .env.local
npm run dev
```

### Environment variables

```bash
# AI
ANTHROPIC_API_KEY=sk-ant-...

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Payments — Dodo
DODO_API_KEY=...
DODO_WEBHOOK_SECRET=...

# Vercel KV (real-time seat counter)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# Internal
INTERNAL_KEY=your-internal-secret
NEXT_PUBLIC_APP_URL=https://teos-ai-engine.vercel.app
```

---

## Roadmap

| Feature | Status |
|---------|--------|
| 7-platform content generation | ✓ Live |
| TEOS Signal Score™ | ✓ Live |
| Arabic / English bilingual mode | ✓ Live |
| Image prompt generation | ✓ Live |
| TikTok video scripts | ✓ Live |
| Real-time lifetime seat counter | ✓ Live |
| TikTok native video generation | ⟳ In development |
| AI image generation (native) | ⟳ In development |
| Social auto-publishing | ◦ Planned |
| Post scheduling | ◦ Planned |
| Full Arabic dashboard (RTL) | ◦ Planned |
| Mobile PWA | ◦ Planned |

*First 500 users get 1 free month when TikTok video generation ships.*

---

## للمؤسسين العرب 🇪🇬

محرك TEOS يولّد محتوى عربيًا أصيلًا — ليس ترجمةً من الإنجليزية. خطافات مثل "هل تعرف لماذا يفشل معظم المؤسسين؟" و"رأي غير شائع:" مع هاشتاقات MENA وتوقيت نشر محلي (GST / EGT).

---

## About

Built and maintained by **Ayman Seif** at [Elmahrosa International](https://www.linkedin.com/company/teos-pharaoh-portal) — Alexandria, Egypt. Established 2007. Software division since 2021. Bootstrapped. No VC.

X: [@KING_TEOS](https://twitter.com/KING_TEOS) · Telegram: [#ElmahrosaPi](https://t.me/elmahrosapi) · LinkedIn: [Teos Pharaoh Portal](https://www.linkedin.com/company/teos-pharaoh-portal)

Licensed under TESL v2.0 · ICBC-v1.0 governance · © 2026 TEOS Network
