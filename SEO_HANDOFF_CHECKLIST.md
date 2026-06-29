# SEO Hand-off Checklist — your actions (no coding)

The code-side SEO is done and verified. Google ranking now depends on these
account actions, which **only you can do** (they need logins to your own
accounts). None require coding. Do them in order — the whole list is ~1 hour.

> Reality check: nobody can *guarantee* "top 5." This checklist + the on-site
> work we shipped is the strongest honest shot. Items 1–4 are the must-dos.

---

## 1. Google Search Console verification — ✅ ALREADY DONE
The `cryptominingindia.com` **Domain** property is already verified via your
**domain name provider (DNS)** — the strongest method (covers all subdomains + http/https).

- There is no "HTML tag" option for a Domain property — that's normal; Domain
  properties verify by DNS only. Nothing more to do here.
- You can **leave `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` blank** in `.env.local` —
  the meta tag is redundant now that DNS proves ownership. No rebuild needed for this.

> **Standard deploy flow on your Droplet** (use this every time you ship the code I wrote):
> `git pull` (or upload files) → `npm install` → `npm run build` → `pm2 restart <app>`.
> One-time: run `npm install sharp` once so Next's image optimisation is fast on the server.

## 2. Submit your sitemap (2 min)
In Search Console → **Sitemaps** → enter `sitemap.xml` → Submit.
(Full URL: `https://cryptominingindia.com/sitemap.xml` — now includes the 6 `/learn` guides
**and every published `/blog` post automatically**.)

> **Blog → Google:** Once the sitemap above is submitted, you never touch it again
> for the blog. Each post you publish in the admin appears in `sitemap.xml` within
> ~1 hour (it revalidates hourly) and Google picks it up on its next crawl. New
> posts also carry `BlogPosting` structured data + an RSS feed at
> `https://cryptominingindia.com/blog/feed.xml`. To get a brand-new post crawled
> faster, paste its URL into Search Console → **URL Inspection** → **Request indexing**.

## 3. Connect the redirect domains properly (10 min)
You own `cmmmining.in`, `cryptominerdelhi.com`, `cryptominerindias.com` (301 → main site).
1. Add **each** of these 3 as a separate **Domain** property in Search Console.
2. For each, go to **Settings → Change of Address** → point it to `cryptominingindia.com`.
   This passes their authority cleanly to your main domain.

## 4. Add Bing Webmaster Tools (5 min) — powers ChatGPT & Copilot search
1. https://www.bing.com/webmasters → add `cryptominingindia.com`
   (you can **import from Google Search Console** in one click).
2. Submit the same `sitemap.xml`.

## 5. Request indexing for the important pages (5 min)
In Search Console → **URL Inspection** (top search bar), paste each URL → **Request Indexing**:
- `https://cryptominingindia.com/`
- `https://cryptominingindia.com/crypto-miner-delhi`
- `https://cryptominingindia.com/learn`
- the 6 guide URLs under `/learn/...` (listed in your sitemap)

## 6. Google Business Profile — biggest lever for "crypto miner delhi" (20 min)
1. https://business.google.com → create/claim a profile for the Delhi location.
2. Use the **exact same** Name, Address, Phone (NAP) as on the site:
   - Name: **Crypto Mining India**
   - Phone: **+91-99119-44472**
   - City: **New Delhi**
3. Add categories ("Computer hardware supplier" / "Electronics store"), business hours, photos of real units/facility, and a few products.
4. This is what makes you show up in Google Maps and the local pack.

## 7. Start collecting real reviews (ongoing)
- Ask happy customers to leave a Google review (link from your Business Profile).
- **Tell me once you have a few real reviews** — I can then safely add
  `aggregateRating` star-rating schema (we deliberately left it off because
  faking reviews gets a site penalised by Google).

## 8. A few local citations / backlinks (ongoing, high ROI)
- List the business on 3–5 India crypto / electronics / B2B directories with the
  **same NAP** as above.
- Any genuine backlink from a crypto/fintech blog or supplier page helps domain authority.

---

## What was shipped in code (for your reference)
- Homepage **FAQ schema** (+ rewrote the old cloud-mining FAQ copy to hardware/₹).
- Product pages: richer **Offer** schema (price validity, 365-day return policy,
  pan-India shipping) + **per-product FAQ** schema; auto-uses real product photos
  when you add them to the catalog.
- New **/learn** hub with **6 in-depth guides** (Article + FAQ + Breadcrumb schema),
  added to the sitemap.
- **llms.txt** at `/llms.txt` for AI search engines.
- **Auto-generated branded preview images** for product & guide pages (no photos needed).
- **Speed**: homepage JavaScript cut from ~203 kB to ~117 kB (lazy-loaded animations).

**Re-measure speed after you deploy:** run https://pagespeed.web.dev on your
homepage and a product page; the mobile scores should improve.

**Deploy reminder (DigitalOcean Droplet + PM2):** the code changes only go live
after you `npm run build` and `pm2 restart` on the server — see the deploy flow in step 1.
