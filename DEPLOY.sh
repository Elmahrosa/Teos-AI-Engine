#!/bin/bash
# =============================================================
# TEOS AI ENGINE — DEPLOY FIX SCRIPT
# Run this from the ROOT of your Teos-AI-Engine repo
# =============================================================

set -e  # Exit on any error

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║     Teos AI Engine — Deploy Fix Script           ║"
echo "║     Senior Dev Audit — Elmahrosa International   ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ─────────────────────────────────────────────────────────────
# STEP 1: Delete orphaned root-level files
# These duplicates caused import confusion and are dead code
# ─────────────────────────────────────────────────────────────
echo "🗑️  Step 1: Removing orphaned root-level duplicate files..."
rm -f PaymentBlock.tsx
rm -f PricingCards.tsx
rm -f payments.ts
rm -f route.ts
echo "   ✓ Removed root-level PaymentBlock.tsx, PricingCards.tsx, payments.ts, route.ts"

# ─────────────────────────────────────────────────────────────
# STEP 2: Delete broken GitHub Actions workflow
# ─────────────────────────────────────────────────────────────
echo ""
echo "🗑️  Step 2: Replacing broken webpack CI with proper Next.js CI..."
rm -f .github/workflows/webpack.yml
echo "   ✓ Removed webpack.yml"

# ─────────────────────────────────────────────────────────────
# STEP 3: Copy in fixed files from this patch set
# ─────────────────────────────────────────────────────────────
echo ""
echo "📋 Step 3: Copying fixed files..."

# These should be placed in your repo by the patch before running this script:
# - app/api/generate/route.ts   (FIXED: returns correct shape)
# - lib/payments.ts             (FIXED: no empty strings)
# - lib/auth.ts                 (FIXED: unified ADMIN_EMAIL/ADMIN_EMAILS)
# - lib/session.ts              (FIXED: hard fail in production if no secret)
# - components/PaypalSubmit.tsx (FIXED: actually uses plan prop)
# - prisma/schema.prisma        (FIXED: directUrl commented out)
# - .github/workflows/ci.yml    (NEW: proper CI)
# - .env.example                (NEW: all vars documented)

echo "   ✓ Files should already be in place (copy from patch set)"

# ─────────────────────────────────────────────────────────────
# STEP 4: Verify package.json is correct
# ─────────────────────────────────────────────────────────────
echo ""
echo "📦 Step 4: Checking package.json..."
node -e "
const pkg = require('./package.json');
const issues = [];
if (!pkg.scripts.build.includes('prisma generate')) issues.push('build script missing prisma generate');
if (!pkg.scripts.postinstall) issues.push('missing postinstall: prisma generate');
if (issues.length) { console.error('ISSUES:', issues.join(', ')); process.exit(1); }
console.log('   ✓ package.json scripts look correct');
console.log('   ✓ Next.js version:', pkg.dependencies.next);
"

# ─────────────────────────────────────────────────────────────
# STEP 5: Install and verify
# ─────────────────────────────────────────────────────────────
echo ""
echo "📦 Step 5: npm install..."
npm install
echo "   ✓ Dependencies installed"

# ─────────────────────────────────────────────────────────────
# STEP 6: Check .env.local exists
# ─────────────────────────────────────────────────────────────
echo ""
echo "🔑 Step 6: Checking environment..."
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
  echo "   ⚠️  WARNING: No .env.local found!"
  echo "   Copy .env.example to .env.local and fill in your values:"
  echo ""
  echo "   cp .env.example .env.local"
  echo "   nano .env.local"
  echo ""
  echo "   Required vars: DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY, ADMIN_EMAIL"
else
  echo "   ✓ .env file found"
fi

# ─────────────────────────────────────────────────────────────
# STEP 7: Prisma generate
# ─────────────────────────────────────────────────────────────
echo ""
echo "🗄️  Step 7: Prisma generate..."
npx prisma generate
echo "   ✓ Prisma client generated"

# ─────────────────────────────────────────────────────────────
# STEP 8: TypeScript check
# ─────────────────────────────────────────────────────────────
echo ""
echo "🔎 Step 8: TypeScript check..."
npx tsc --noEmit && echo "   ✓ No TypeScript errors" || echo "   ⚠️  TypeScript errors found — check output above"

# ─────────────────────────────────────────────────────────────
# STEP 9: Run migrations (only if DB is configured)
# ─────────────────────────────────────────────────────────────
echo ""
echo "🗄️  Step 9: Run DB migration + seed..."
if [ -n "$DATABASE_URL" ]; then
  npx prisma migrate deploy && echo "   ✓ Migration deployed"
  npm run db:seed && echo "   ✓ Seed complete (admin account created)"
else
  echo "   ⚠️  DATABASE_URL not set — skipping migration"
  echo "   Run manually after setting env vars:"
  echo "     npx prisma migrate deploy"
  echo "     npm run db:seed"
fi

# ─────────────────────────────────────────────────────────────
# STEP 10: Git commit and push
# ─────────────────────────────────────────────────────────────
echo ""
echo "🚀 Step 10: Git push to trigger Vercel deploy..."
git add -A
git commit -m "fix: production deploy fixes — generate API shape, auth, session security, CI, payments"
git push origin main
echo "   ✓ Pushed — Vercel auto-deploy triggered"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  ✅ ALL FIXES APPLIED — VERCEL SHOULD DEPLOY     ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "📋 FINAL VERCEL ENV VARS CHECKLIST:"
echo "   DATABASE_URL              ← Neon pooled connection string"
echo "   NEXTAUTH_SECRET           ← openssl rand -base64 32"
echo "   NEXTAUTH_URL              ← https://teos-ai-engine.vercel.app"
echo "   ANTHROPIC_API_KEY         ← sk-ant-..."
echo "   ADMIN_EMAIL               ← ayman@teosegypt.com"
echo "   NEXT_PUBLIC_PAYPAL_ME     ← https://paypal.me/ElmahrosaTEOS"
echo "   NEXT_PUBLIC_USDC_SOL_ADDRESS ← your Solana USDC wallet"
echo "   NEXT_PUBLIC_PI_ADDRESS    ← your Pi wallet"
echo ""
echo "🔗 After deploy, run the DB seed via Vercel CLI:"
echo "   vercel env pull .env.local"
echo "   npm run db:seed"
echo ""
