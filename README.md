# 🚀 Teos AI Engine

> AI is the new search engine.  
> Mentions influence AI answers. Context decides visibility.

**Teos AI Engine** is an AI-powered SaaS platform that generates high-impact social media content and visuals across **X, Facebook, Instagram, and LinkedIn**.

Built for creators, founders, and agencies to turn ideas into **discoverable, high-performing content**.

---

## ✨ Features

- ✍️ AI Post Generation (multi-platform)
- 🎨 AI Image Generation (per post)
- 🔥 Visibility Scoring & Optimization
- 🧠 Platform-Specific Content Strategies
- 🏷️ Smart Hashtag Generation
- 💾 Save & Manage Posts
- 🔐 Plan System (Starter / Pro / Agency)
- 💰 Crypto Payments (USDC + Pi Network)

---

## 🧠 How It Works

1. Enter your topic  
2. Choose platform (X, Instagram, Facebook, LinkedIn)  
3. Generate AI content + image  
4. Get hashtags + optimized output  
5. Save and reuse  

---

## 💰 Pricing (Launch)

| Plan    | Features                              |
|--------|----------------------------------------|
| Starter | 10 posts, 3 platforms                  |
| Pro     | Unlimited posts, AI images             |
| Agency  | All features + LinkedIn + priority     |

🔥 **Pi users get 50% discount (first 300 users)**

---

## 💳 Payments

- **USDC (Solana)**
- **Pi Network**
- Manual confirmation (launch mode)

---

## 🧪 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- OpenAI API
- Tailwind CSS
- Vercel

---

## ⚙️ Setup (Local)

```bash
git clone https://github.com/Elmahrosa/Teos-AI-Engine
cd Teos-AI-Engine

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
````

---

## 🔐 Environment Variables

Create `.env`:

```env
DATABASE_URL=
DATABASE_URL_DIRECT=

NEXTAUTH_SECRET=
ADMIN_EMAIL=

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-nano

NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_USDC_SOL_ADDRESS=
NEXT_PUBLIC_PI_ADDRESS=
```

---

## 🚀 Deploy (Production)

```bash
npx prisma migrate deploy
npm run build
vercel --prod
```

---

## 🧾 Payment Flow (Launch Mode)

1. User sends payment (USDC / Pi)
2. User submits proof
3. Admin confirms in `/admin`
4. Plan is activated

---

## 🧠 Product Vision

Teos AI Engine is not just a content generator.

👉 It is an **AI Visibility Engine**
built for the era where AI systems decide what gets seen.

---

## 🌍 Built By

**Elmahrosa International 🇪🇬**

---

## ⚠️ Disclaimer

* Early access (launch mode)
* Payments are manually confirmed
* Some features will be automated in future releases

---

## 📈 Roadmap (Next)

* Auto payment verification
* Analytics engine
* Content scoring system
* Scheduling & automation
* Multi-account support

---

## ⭐ Support

If you like this project, star the repo ⭐
or share it with your network.

---

## 🚀 Live

👉 [Add your deployed link here]

```
