# MustardSeed Productions — Website

A cinematic, multi-page storytelling website for MustardSeed Productions — home of the *Seeds of Greatness* children's book series and *Stories in Motion* animated experiences.

---

## 🌐 Live URLs

| Environment | URL |
|---|---|
| **Production (Cloudflare Pages)** | https://mseedproductions-site.pages.dev |
| **Custom Domain** | https://www.mseedproductions.com |
| **Journal** | https://www.mseedproductions.com/journal |
| **GitHub Repository** | https://github.com/[org]/mseedproductions |

---

## ✅ Completed Features

### Core Site
- [x] Cinematic full-screen landing page with video autoplay
- [x] Freeze on final frame (seamless Canvas capture)
- [x] Golden leaves animation (shimmer, glow, organic drift)
- [x] Ambient dust particles + glowing gold text
- [x] Sound toggle with fade in/out
- [x] Characters: Yeshua, Messiah, Levi, Jadery — individual pages with book covers, synopses
- [x] Stories in Motion — individual character animation pages
- [x] About, Philosophy, Contact pages
- [x] "Join Seed Planters" cinematic email modal on all character pages (Web3Forms)
- [x] Journal nav link on all 13+ major site pages

### The MustardSeed Journal (7 pages)
- [x] `/journal/index.html` — Blog index with category filter, featured post, 6-card grid, enhanced newsletter, social follow
- [x] 6 individual article pages with BlogPosting JSON-LD schema, OG/Twitter meta
- [x] Social follow CTA section (Instagram/TikTok/YouTube/Facebook) on every article
- [x] Cinematic newsletter with animated gold accents on journal index

### SEO & Discoverability
- [x] `sitemap.xml` — 22 URLs covering all site pages + journal articles
- [x] `robots.txt` — allows all crawling, points to sitemap
- [x] Canonical URLs on all 20 pages using `https://www.mseedproductions.com`
- [x] Open Graph meta on all 20 pages (og:title, og:description, og:url, og:image)
- [x] Twitter Card meta on all 20 pages
- [x] BlogPosting JSON-LD structured data on all 6 journal articles
- [x] `_routes.json` post-build patch for proper Cloudflare routing of `/journal/*`

---

## 🗺️ Site Structure

```
/                          — Landing page (cinematic video)
/about                     — About MustardSeed Productions
/stories                   — Characters overview
/philosophy                — Brand philosophy
/contact                   — Contact page
/characters/yeshua         — Character page
/characters/messiah        — Character page
/characters/levi           — Character page (with book cover)
/characters/jadery         — Character page (with book cover)
/story-in-motion/          — Stories in Motion overview
/story-in-motion/yeshua    — Yeshua animation page
/story-in-motion/messiah   — Messiah animation page
/story-in-motion/levi      — Levi animation page
/story-in-motion/jadery    — Jadery animation page
/journal                   — Journal index (category filter, 6 posts)
/journal/why-stories-make-children-emotionally-strong
/journal/raising-a-child-with-purpose
/journal/building-confidence-in-children
/journal/behind-the-story-seeds-of-greatness
/journal/stories-in-motion-what-it-means
/journal/seeds-of-greatness-series-guide
/sitemap.xml               — XML sitemap (22 URLs)
/robots.txt                — Crawler instructions
```

---

## 🔍 Google Search Console — Submission Guide

### Step 1 — Add & Verify Your Property
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add property** → choose **URL prefix**
3. Enter: `https://www.mseedproductions.com`
4. Choose verification method:
   - **HTML file** (recommended): Download the file, place it in `/home/user/webapp/public/`, rebuild + redeploy
   - **HTML tag**: Add the provided `<meta name="google-site-verification" ...>` tag to the `<head>` of `public/index.html`, then rebuild + redeploy
5. Click **Verify**

### Step 2 — Submit the Sitemap
1. In Search Console, select your property
2. In the left sidebar: **Indexing → Sitemaps**
3. In the "Add a new sitemap" field, enter: `sitemap.xml`
4. Click **Submit**
5. The full sitemap URL is: `https://www.mseedproductions.com/sitemap.xml`

### Step 3 — Request Indexing (Optional, for faster pickup)
For any specific URL (e.g. new journal posts):
1. Use the **URL Inspection** tool in Search Console
2. Enter the full URL (e.g. `https://www.mseedproductions.com/journal/why-stories-make-children-emotionally-strong`)
3. Click **Request Indexing**
4. Repeat for each new or updated URL

### Recommended Indexing Workflow
After deploying new content:
1. Run `npm run build && npx wrangler pages deploy dist --project-name mseedproductions-site`
2. Go to Search Console → URL Inspection
3. Inspect the new page URL → **Request Indexing**
4. For sitemap updates (new articles added), re-submit the sitemap
5. Check **Coverage** report 24–72 hours later to confirm indexed

### File Locations
| File | Path | Public URL |
|---|---|---|
| Sitemap | `public/sitemap.xml` | `https://www.mseedproductions.com/sitemap.xml` |
| Robots.txt | `public/robots.txt` | `https://www.mseedproductions.com/robots.txt` |

### Robots.txt Contents
```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://www.mseedproductions.com/sitemap.xml
```

---

## 🏗️ Architecture

### Media Delivery
The motion graphic (`mustardseed-motion.mp4`) is hosted on **Cloudflare R2** public bucket:
- **Bucket**: `mustardseed-assets`
- **Public URL**: `https://pub-00891786ee42488cb8a715a9bc019602.r2.dev/`

### Hosting
- **Platform**: Cloudflare Pages
- **Worker**: Hono (serves API routes + static assets)
- **Build output**: `dist/` — generated by Vite + `@hono/vite-build/cloudflare-pages`
- **Routing fix**: Post-build Node.js script patches `_routes.json` to add `/journal` and `/journal/*` to the `exclude` array

### Tech Stack
```
Frontend:  Pure HTML/CSS/JavaScript (Cinzel + Lora + Inter fonts, inline SVG icons)
Backend:   Hono on Cloudflare Workers
Video CDN: Cloudflare R2 (public bucket, Accept-Ranges streaming)
Forms:     Web3Forms (browser-side, free plan)
Hosting:   Cloudflare Pages
```

### CSS Design Tokens
```css
--gold:    #d4af37
--gold-lt: #f0d060
--gold-dim: rgba(212,175,55,0.55)
--cream:   #fdf8ee
--deep:    #060409
--nav-h:   68px
```

---

## 🚀 Deployment

### Build & Deploy
```bash
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name mseedproductions-site
```

### Local Development
```bash
npm run build
pm2 start ecosystem.config.cjs
# Open http://localhost:3000
```

### Adding a New Journal Article
1. Create `public/journal/your-article-slug.html` (copy an existing article as template)
2. Update canonical, OG, and JSON-LD URLs to match the new slug
3. Add the article to `public/sitemap.xml` with appropriate `lastmod` and `priority`
4. Add a post card to `public/journal/index.html`
5. Run `npm run build && npx wrangler pages deploy dist --project-name mseedproductions-site`
6. Submit the new URL to Google Search Console via URL Inspection

---

## 📁 Project Structure

```
webapp/
├── public/
│   ├── index.html              # Landing page
│   ├── about.html
│   ├── stories.html
│   ├── philosophy.html
│   ├── contact.html
│   ├── sitemap.xml             # XML sitemap (22 URLs)
│   ├── robots.txt              # Crawler config
│   ├── characters/
│   │   ├── yeshua.html
│   │   ├── messiah.html
│   │   ├── levi.html
│   │   └── jadery.html
│   ├── story-in-motion/
│   │   ├── yeshua.html
│   │   ├── messiah.html
│   │   ├── levi.html
│   │   └── jadery.html
│   ├── journal/
│   │   ├── index.html          # Journal blog index
│   │   ├── why-stories-make-children-emotionally-strong.html
│   │   ├── raising-a-child-with-purpose.html
│   │   ├── building-confidence-in-children.html
│   │   ├── behind-the-story-seeds-of-greatness.html
│   │   ├── stories-in-motion-what-it-means.html
│   │   └── seeds-of-greatness-series-guide.html
│   └── static/
│       ├── favicon.svg
│       ├── seed-glow.jpg
│       ├── characters/
│       └── ...
├── src/
│   └── index.tsx               # Hono worker (API routes + static)
├── dist/                       # Build output (gitignored)
├── ecosystem.config.cjs        # PM2 local dev config
├── wrangler.jsonc              # Cloudflare Pages config
├── vite.config.ts              # Build config
└── package.json                # Includes _routes.json patch script
```

---

*From Small Faith, Great Stories Grow.*
