# Setup & Deploy Guide (Phone-friendly, no laptop needed)

You don't need Node.js locally. Cloudflare Pages builds everything on their servers. You just push and preview on your phone.

---

## 1. Push to GitHub (from Termux or GitHub mobile app)

The old repo `yamraaz99/Amazingdealspricetracker` already exists. From this folder, in Termux:

```bash
git add -A
git commit -m "Migrate to Next.js 14 — production stack"
git push origin main
```

If `main` doesn't exist yet:
```bash
git branch -M main
git push -u origin main
```

That's it locally. Everything else happens in the Cloudflare dashboard on your phone.

---

## 2. Deploy to Cloudflare Pages (free) — 5 min in the dashboard

1. Open **dash.cloudflare.com** on your phone → sign up (free)
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Authorize GitHub, select `Amazingdealspricetracker`
4. **Build settings:**
   - Framework preset: **Next.js**
   - Build command: `npx @cloudflare/next-on-pages@1`
   - Build output directory: `.vercel/output/static`
   - Node version: **20** (Settings → Environment variables → add `NODE_VERSION=20`)
5. **Environment variables** (add these under Production AND Preview):
   ```
   NEXT_PUBLIC_SITE_URL=https://amazingdealstracker.pages.dev
   NEXT_PUBLIC_AMAZON_TAG=azdealzs-21
   ```
   *(Adjust `NEXT_PUBLIC_SITE_URL` to the exact URL Cloudflare gives you after first deploy.)*
6. Click **Save and Deploy**

~2 min later you'll get a URL like `amazingdealstracker.pages.dev`. Open it on your phone → the site is live.

---

## 3. Enable KV cache + rate limiting (2 min, boosts speed + protects site)

Still in the Cloudflare dashboard, on your Pages project:

1. **Settings → Functions → KV namespace bindings → Add binding**
2. Create two namespaces:
   - Variable name: `CACHE` → new namespace `amazingdealz-cache`
   - Variable name: `RL` → new namespace `amazingdealz-ratelimit`
3. Go to **Deployments** → **Retry deployment**

Now every BuyHatke response is cached 15 min and IPs are rate-limited to 20 req/min. The site works without these — they just make it faster and safer.

---

## 4. Iterate

When you want to change something:
- Edit the file in Termux or the GitHub web editor (github.com/yamraaz99/Amazingdealspricetracker)
- Commit + push
- Cloudflare rebuilds in ~90 seconds automatically
- Refresh the page on your phone → new version live

You can watch builds in **Deployments** tab — it shows any errors clearly.

---

## 5. When ready to launch — buy the real domain

1. Cloudflare dashboard → **Domain Registration** → search `amazingdealstracker.com`
2. Buy it (~$10/year, cheapest legit price)
3. Pages project → **Custom domains** → add `amazingdealstracker.com` and `www.amazingdealstracker.com`
4. Cloudflare handles DNS + free SSL automatically (~5 min)
5. Update env var `NEXT_PUBLIC_SITE_URL=https://amazingdealstracker.com` → retry latest deployment

Done. No code changes.

---

## 6. Post-launch checklist (in this order)

- [ ] Enable **Cloudflare Web Analytics** (Pages → Analytics → Enable) — free, no cookie banner needed
- [ ] Submit sitemap to **Google Search Console** → `https://<your-domain>/sitemap.xml`
- [ ] Submit sitemap to **Bing Webmaster Tools**
- [ ] Verify OG preview on WhatsApp/Twitter by sharing a deal URL to yourself
- [ ] Test 5 different marketplace links to make sure detection works
- [ ] Replace `public/logo.jpg` with a transparent-background PNG when you get one (optional polish)

---

## Troubleshooting on phone

**Build fails on Cloudflare with "cannot find module":**
- Make sure Node version is 20. Settings → Environment variables → `NODE_VERSION=20`. Redeploy.

**Site loads but images broken:**
- The `<img>` tags use external CDNs. If Cloudflare's CSP blocks them, check the browser console. Add domain to `next.config.mjs` → `images.remotePatterns`.

**API returns 403 Forbidden origin:**
- Make sure `NEXT_PUBLIC_SITE_URL` matches your actual `.pages.dev` URL exactly (no trailing slash, https not http).

**"Deal not found" for a valid product:**
- BuyHatke's API may not have that specific product yet, or the URL format is uncommon. Try a different well-known product first to confirm the site works.

**Want to test a code change without pushing?**
- The GitHub web editor (github.com/yourrepo → hit `.` key or use "Edit" button) works from mobile. Commit → Cloudflare auto-rebuilds.
