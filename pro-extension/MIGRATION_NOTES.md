# Migration Notes — x-teos-pro → Teos-AI-Engine

**Date**: 2026-05-12
**Strategy**: Option B — Dedicated module (`/pro-extension`)

## What happened

The `x-teos-pro` repository (124 commits) was rebuilt as a module inside `Teos-AI-Engine` (133 commits). `Teos-AI-Engine` is the primary base; `x-teos-pro` assets live under `/pro-extension/`.

## File mapping

| x-teos-pro path | Merged to |
|---|---|
| `lib/access.ts` | `pro-extension/lib/access.ts` |
| `lib/claude.ts` | `pro-extension/lib/claude.ts` |
| `lib/constants.ts` | `pro-extension/lib/constants.ts` |
| `lib/origin.ts` | `pro-extension/lib/origin.ts` |
| `lib/plans.ts` | `pro-extension/lib/plans.ts` |
| `lib/rateLimit.ts` | `pro-extension/lib/rateLimit.ts` |
| `lib/tap.ts` | `pro-extension/lib/tap.ts` |
| `lib/trial.ts` | `pro-extension/lib/trial.ts` |
| `lib/validation.ts` | `pro-extension/lib/validation.ts` |
| `types/next-auth.d.ts` | `pro-extension/types/next-auth.d.ts` |
| `components/Providers.tsx` | `pro-extension/components/Providers.tsx` |
| `components/plans.ts` | `pro-extension/components/plans.ts` |
| `app/privacy/page.tsx` | `pro-extension/app/privacy/page.tsx` |
| `app/terms/page.tsx` | `pro-extension/app/terms/page.tsx` |
| `scripts/git-sync-launch.sh` | `pro-extension/scripts/git-sync-launch.sh` |
| `AUDIT.md` | `pro-extension/docs/AUDIT.md` |
| `PRELAUNCH_QA.md` | `pro-extension/docs/PRELAUNCH_QA.md` |
| `vercel.json` | `pro-extension/config/vercel.json` |
| `.vercelignore` | `pro-extension/config/vercelignore` |
| `next.config.mjs` | `pro-extension/config/next.config.mjs` |
| `page.tsx` (dashboard) | `pro-extension/app/dashboard-og.tsx` |

## Config alignment

| Config | Teos-AI-Engine (base) | x-teos-pro (merged) |
|---|---|---|
| TypeScript strict | `true` | `false` (legacy) |
| `allowJs` | `false` | `true` |
| `jsx` | `preserve` | `react-jsx` |
| Next.js version | 14.x | 16.x (legacy config) |
| Test framework | Vitest | None |
| Auth | JWT | NextAuth (legacy) |

The base `tsconfig.json` already covers `pro-extension/` via `**/*.ts` and `**/*.tsx` globs.

## Env vars added from x-teos-pro

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — OAuth
- `ANTHROPIC_API_KEY` — Claude AI
- `TAP_WEBHOOK_SECRET`, `TAP_PRO_INVOICE_LINK`, `TAP_AGENCY_INVOICE_LINK` — Tap Payments

## Next steps

1. Migrate any active x-teos-pro deployments to this unified repo
2. Archive the original `x-teos-pro` repo on GitHub
3. Update Vercel project to point to this repo
4. Run `npm install` and verify build
