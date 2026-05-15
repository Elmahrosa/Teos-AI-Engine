# Integration Guide — All 4 Conversion Pieces

## File Placement

```
components/StickyCTA.tsx        ← Mobile sticky CTA bar
components/ExitPopup.tsx        ← Exit intent popup
components/useSeats.ts          ← Live seat counter hook
app/api/seats/route.ts          ← KV-backed seats API (GET + POST bump)
README.md                       ← Product Hunt-ready readme
```

All already wired into `app/page.tsx`.

---

## How It Works Together

```
useSeats() hook
    ↓
fetches /api/seats every 60s
    ↓
returns { taken, total, left, pct, soldOut }
    ↓
passes to:
  ├── SeatsBar (in pricing card)     ← shows live progress bar
  ├── StickyCTA (mobile bar)         ← shows seats left + $149 CTA
  └── ExitPopup (exit intent)        ← shows seat scarcity + offer
```

---

## Vercel KV Setup

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) → Storage → Create → KV
2. Link to your Teos-AI-Engine project
3. Vercel auto-adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` to env
4. Seed initial value in KV dashboard CLI:
   ```
   SET lifetime_seats_taken 37
   ```
5. Add `INTERNAL_KEY` to Vercel env vars (any random string)

---

## Wire the Seat Bump into Dodo Webhook

In `app/api/webhooks/dodo/route.ts`, add after confirming a successful lifetime payment:

```ts
async function bumpSeatCount() {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/seats`,
      {
        method: "POST",
        headers: {
          "x-internal-key": process.env.INTERNAL_KEY ?? "",
        },
      }
    );
  } catch {
    console.warn("[seats] bump failed — non-fatal");
  }
}
```

Then inside your payment handler:

```ts
if (event.type === "payment.succeeded" && isLifetimePlan(event.data)) {
  await bumpSeatCount();
}
```

---

## Dodo Payment Links

| Plan | Link |
|------|------|
| Pro Monthly $29 | https://dodo.pe/ljkagv2ixcr |
| Agency Monthly $69 | https://dodo.pe/dbvnd9a4pp |
| Pro Lifetime $149 | https://dodo.pe/relh2gradr9 |
| Agency Lifetime $349 | https://dodo.pe/91zcmc4xi27 |
| Pro Yearly $290 | https://dodo.pe/ep9cgmojbua |
| Agency Yearly $690 | https://dodo.pe/79q4irl1347 |
