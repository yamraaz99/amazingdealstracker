# Amazing Dealz Tracker

Production-grade price tracker for Indian marketplaces (Amazon, Flipkart, Myntra, JioMart, etc.).

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + custom design system
- **Charts:** Chart.js via react-chartjs-2
- **Deployment:** Cloudflare Pages (free tier: 100k req/day)
- **Cache/DB:** Cloudflare KV + Turso SQLite (planned Phase 5)
- **Data source:** BuyHatke API (server-side only, cached)

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm run pages:build` — build for Cloudflare Pages
- `npm run pages:deploy` — deploy to Cloudflare Pages

## Structure

```
app/                   # Next.js routes
  page.tsx             # Landing (hero, trending, how-it-works, FAQ)
  track/               # Full tracker (search-focused)
  deal/[store]/[pid]/  # Individual deal pages (SEO-indexable)
  trending/            # Top deals right now
  stores/[store]/      # Deals per marketplace
  api/track/           # Protected server endpoint (BuyHatke proxy)
components/            # Reusable UI
lib/                   # Server logic (URL detection, BuyHatke client, cache)
public/                # Static assets, favicon, manifest
legacy/                # Original single-page HTML (archived)
```

## Security

- All external API calls are server-side only
- Origin-locked CORS
- HMAC-signed requests (Phase 4)
- Cloudflare Turnstile CAPTCHA (Phase 4)
- Rate-limited via Cloudflare KV (Phase 4)
- SSRF-hardened URL input
- Strict CSP + full security headers

## Deploy

Testing URL: `https://amazingdealstracker.pages.dev` (free Cloudflare subdomain)
Production: `amazingdealstracker.com` (post-launch)
