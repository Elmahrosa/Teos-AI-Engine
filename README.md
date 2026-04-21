# 🏛️ UPDATED README (FINAL — COPY/PASTE)

Use this as your **new production README**:

````md
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
- 🔒 Secure authentication (NextAuth)
- 🧠 Plan-based feature gating
- 💾 Persistent database (Prisma + PostgreSQL)
- 🛠 Admin dashboard (manual activation + billing control)
- 💳 Payment-ready (Dodo / PayPal / Crypto / Pi)

---

## 🧠 SaaS Logic (NEW)

This version includes a **fully integrated usage engine**:

- Starter → 5 posts lifetime
- Pro → 50 posts/day
- Agency → 200 posts/day
- Lifetime → 100/day (limited offer)

Features:
- Daily reset system
- Per-user tracking
- Automatic limit enforcement
- Post persistence

---

## 💰 Pricing (Launch Model)

| Plan      | Price | Features |
|----------|------|--------|
| Starter  | Free | 5 posts total |
| Pro      | $19/mo | 50 posts/day |
| Agency   | $49/mo | 200 posts/day + LinkedIn |
| Lifetime | $99 (limited) | 100/day forever |

🔥 **First 100 users get Lifetime access**

---

## 💳 Payments

Supports:

- Dodo Payments (primary checkout)
- PayPal (manual approval)
- USDC (Solana)
- Pi Network (discount model)

Admin dashboard controls:
- Activation
- Plan upgrades
- Billing validation

---

## 🧪 Development

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev -- --webpack
````

---

## 🏗️ Architecture

* Next.js 16 (App Router)
* Prisma ORM
* PostgreSQL (Neon recommended)
* NextAuth authentication
* Claude/OpenAI (AI layer)

---

## 🧠 Project Status

✅ Core SaaS engine implemented
✅ Usage + billing system integrated
✅ Ready for production testing
🚀 Launch-ready after final payment + UI polish

---

## ⚠️ Notes

* This repo is private during stabilization
* Public release will follow after launch validation
* Old version (x-teos-pro) has been deprecated

---

## 🏛️ Elmahrosa International

Founder: Ayman Seif
Vision: Build sovereign AI-powered systems for global scale

---

## 📜 License

Proprietary – Elmahrosa International
Not for redistribution without permission

````
