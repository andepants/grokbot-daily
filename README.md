# Grok Bot Daily

Open-source daily email digest of the most interesting things people are doing with [Grok Bot](https://x.ai/bot), sourced from public posts on X.

- Landing page + email signup (double opt-in via Resend)
- `/archive` and `/issues/[slug]` rendered from `content/issues/*.md`
- RSS at `/feed.xml`
- React Email templates + `pnpm send:preview` / `pnpm send:broadcast`

## Stack

Next.js 15 (App Router), React 19, Geist, Resend. Plain CSS tokens, light theme only, one SVG bot mark with a CSS blink animation (static under `prefers-reduced-motion`).

## Local development

```bash
pnpm install
cp .env.example .env.local
# fill RESEND_API_KEY, RESEND_AUDIENCE_ID, RESEND_FROM, NEXT_PUBLIC_SITE_URL, CONFIRM_SECRET
pnpm dev
```

## Content

Add an issue as `content/issues/YYYY-MM-DD.md` with front matter:

```md
---
title: "Issue title"
date: "2026-10-08"
description: "One-line summary"
---

Markdown body…
```

## Email

- `POST /api/subscribe` — honeypot + rate limit; creates an **unsubscribed** Resend contact; sends confirm email
- `GET /api/confirm?token=…` — marks the contact subscribed
- `GET|POST /api/unsubscribe?token=…` — one-click unsubscribe (+ `List-Unsubscribe` header)

```bash
pnpm send:preview 2026-10-08 you@example.com
pnpm send:broadcast 2026-10-08 --confirm   # refuses without --confirm; refuses in CI
```

Broadcasts never auto-send. Keep a human gate.

## Self-host

1. Fork this repo
2. Create a Resend audience + API key (sending + audiences)
3. Verify a sending domain
4. Deploy to Vercel (or any Next host) with the env vars in `.env.example`
5. Point `NEXT_PUBLIC_SITE_URL` at your production URL

## License

MIT
