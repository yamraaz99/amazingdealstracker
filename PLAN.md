# Production Roadmap

## ✅ Phase 1 — Foundation (DONE)
- Next.js 14 App Router + TypeScript + Tailwind
- Server-only BuyHatke client (browser never sees external API)
- Typed lib layer (platforms, url-detect, track, format, cache, ratelimit)
- Edge API route with Zod validation

## ✅ Phase 2 — Multi-page (DONE)
- Landing: Hero → Trending → How It Works → Stores → Recently Searched → Telegram → FAQ
- Routes: `/`, `/track`, `/trending`, `/deal/[store]/[pid]`, `/stores/[store]`, `/about`, `/privacy`, `/terms`
- Custom 404
- Header + footer with Amazon Associates disclosure

## ✅ Phase 3 — SEO (DONE)
- Dynamic `<title>` + meta per page + per deal
- JSON-LD: WebSite, Organization, Product+AggregateOffer, BreadcrumbList
- OpenGraph + Twitter Cards
- Dynamic per-deal OG image (opengraph-image.tsx via next/og)
- sitemap.xml (auto-generated, includes all stores)
- robots.txt
- PWA manifest
- Canonical URLs

## ✅ Phase 4 — Security (DONE)
- Origin-locked CORS (kills wildcard)
- SSRF hardening on URL input (blocks 127.*, 10.*, 169.254.*, etc.)
- CSP + full security headers via middleware
- Rate limiting (KV-backed, 20 req/min per IP)
- Zod validation on all inputs
- Amazon affiliate tag auto-injected on outbound links
- Kept as future extensions: Turnstile CAPTCHA, HMAC signing (add once we see abuse)

## 🟡 Phase 5 — Data layer (FOUNDATION DONE, needs Turso setup)
- Cache module ready (KV-backed, memory fallback in dev)
- Rate limit module ready
- **User to complete:** sign up for Turso, add tables for search logs + trending
- **User to complete:** wire /trending and /stores/[store] to real data

## 🟡 Phase 6 — Deploy (READY, needs user action)
- wrangler.toml + Cloudflare Pages config ready
- SETUP.md has step-by-step deploy instructions
- **User to complete:** push to GitHub, connect Cloudflare, add KV bindings

## 🟢 Phase 7 — Polish (post-launch)
- Sentry error tracking
- Real favicon + OG image
- Turnstile CAPTCHA (only once bots appear)
- HMAC request signing (only if abuse continues)
- Newsletter signup (Resend / Buttondown)
- Dark mode toggle
- Amazon PA-API integration (once Associates account has qualifying sales)

---

## Notes on things intentionally deferred

- **Turnstile CAPTCHA:** Adding it before we see real bot traffic just annoys users. The rate limit + origin lock is enough for launch.
- **HMAC signing:** Same reasoning — over-engineering before we have a threat.
- **User accounts / saved deals:** Not in scope for v1. Recently-searched already works via localStorage without accounts.
- **Automated scraping fallback:** Deferred until BuyHatke actually breaks. Structure allows plugging in a second source.
- **Manual admin panel for curated deals:** Postponed; trending will auto-derive from search logs in Phase 5.
