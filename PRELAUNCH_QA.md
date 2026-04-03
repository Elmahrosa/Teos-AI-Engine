# X‑Teos Pro — Pre-Launch QA Checklist

Run through every item before going live. Check off as you go.

---

## 1. Auth flows

### Google login
- [ ] Click "Continue with Google" → redirects to Google consent screen
- [ ] Approve → lands on `/dashboard` with session active
- [ ] User row created in DB (check Prisma Studio: `npx prisma studio`)
- [ ] Name + avatar pulled from Google profile

### Email magic link
- [ ] Enter email → "Check your inbox" screen shown
- [ ] Email received from `noreply@yourdomain.com` (check spam)
- [ ] Click link → lands on `/dashboard`
- [ ] Expired link (wait 24h or tamper with token) → shows error, not crash

### Admin access
- [ ] Sign in with `ayman@teosegypt.com` → "Admin ↗" link visible in nav
- [ ] `/admin` accessible, shows user table + stats
- [ ] Sign in with non-admin email → no "Admin ↗" link in nav
- [ ] Manually navigate to `/admin` as non-admin → silently redirected to `/dashboard`

### Dev demo login
- [ ] `NODE_ENV=development`: dev login button visible on `/login`
- [ ] `NODE_ENV=production`: dev login button NOT visible
- [ ] Deploying to Vercel: confirm button absent on live URL

---

## 2. Content generation

### Basic generation
- [ ] Enter prompt on X → generates post ≤ 280 chars (most of the time)
- [ ] Enter prompt on Instagram → generates with hashtags
- [ ] Enter prompt on LinkedIn → professional tone, ends with question
- [ ] Enter prompt on Facebook → conversational tone
- [ ] Empty prompt → Generate button disabled (not clickable)

### Platform access (plan enforcement)
- [ ] Starter user: Facebook + LinkedIn tiles show "Pro" badge, are greyed out
- [ ] Clicking locked platform → nothing happens (button disabled)
- [ ] Pro/Agency user: all 4 platforms selectable

### Daily limit enforcement
- [ ] Starter user hits 5 posts → error "Daily limit reached" shown
- [ ] Error includes upgrade nudge link
- [ ] `UsageLog` table updated correctly (check Prisma Studio)
- [ ] Next calendar day → limit resets (manually set `date` in DB to yesterday to test)

---

## 3. Saved posts

- [ ] After generating, click "Save post" → success state shown
- [ ] Switch to "Saved posts" tab → post appears
- [ ] Filter by platform → only matching posts shown
- [ ] Filter by status (draft / published) → correct filter applied
- [ ] "Mark published" button → status badge changes to green "published"
- [ ] "Mark draft" button → reverts to grey "draft"
- [ ] "Copy" button → content copied to clipboard, button shows "✓ Copied"
- [ ] "Delete" button → confirmation prompt; post removed from list

---

## 4. Payment & plan upgrade

### Tap webhook (test mode)
- [ ] In Tap dashboard, set webhook URL to `https://your-app.vercel.app/api/webhooks/tap`
- [ ] Send test `charge.success` event from Tap dashboard
- [ ] Check logs: `tap_plan_upgraded` log entry present
- [ ] User plan updated in DB
- [ ] Check `WebhookEvent` table: event stored (idempotency)
- [ ] Send same event again → `tap_webhook_duplicate` log, no DB change

### Success redirect
- [ ] After Tap checkout, redirect to `/upgrade/success`
- [ ] Session refreshes automatically (new plan shown in nav badge)
- [ ] Auto-redirects to `/dashboard` after 5 seconds

### Trial banners
- [ ] Set `trialEndsAt` to 2 days from now in DB → amber banner shown
- [ ] Set `trialEndsAt` to yesterday → red "trial expired" banner shown
- [ ] Starter with no `trialEndsAt` → no banner shown

---

## 5. Security checks

- [ ] Rate limit: send 31 POST requests to `/api/generate` in < 60s → 429 response on 31st
- [ ] Webhook without valid HMAC signature → 401 response
- [ ] `/api/admin/update-plan` called without admin session → 403 response
- [ ] License key set in env: call `/api/generate` without session and without header → 403 response
- [ ] All API routes return JSON errors (not HTML stack traces)

---

## 6. Mobile view

- [ ] Login page: readable on 375px width (iPhone SE)
- [ ] Dashboard: platform selector wraps to 2×2 grid on mobile
- [ ] Generate + output: no horizontal overflow
- [ ] Saved posts: all action buttons visible / accessible
- [ ] Admin panel: table scrolls horizontally on mobile

---

## 7. Environment & deployment

- [ ] All vars in `.env.example` are set in Vercel environment variables
- [ ] `NEXTAUTH_URL` set to production URL (not localhost)
- [ ] `GOOGLE_CLIENT_ID` authorized redirect URI matches production URL
- [ ] `DATABASE_URL` points to production Neon (not dev branch)
- [ ] Neon password rotated after any local dev exposure
- [ ] `prisma db push` run against production DB after schema changes
- [ ] Vercel build passes with no type errors

---

## 8. Final smoke test (production URL)

- [ ] `/` or `/login` loads correctly
- [ ] Full Google sign-in flow works end-to-end
- [ ] Generate one post per platform (with Pro account)
- [ ] Save + copy + toggle status all work
- [ ] Admin panel accessible with admin email
- [ ] Sign out → redirected to `/login`

---

**Sign-off**: All items checked → safe to announce launch. 🚀
