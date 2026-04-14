# MustardSeed Productions — Landing Page

A cinematic, single-page landing experience for MustardSeed Productions.

## 🌐 Live URLs

| Environment | URL |
|---|---|
| **Production (Cloudflare Pages)** | https://mseedproductions-site.pages.dev |
| **Latest Deployment** | https://fed839ac.mseedproductions-site.pages.dev |
| **Motion Graphic (Cloudflare R2)** | https://pub-00891786ee42488cb8a715a9bc019602.r2.dev/mustardseed-motion.mp4 |

---

## 🎬 Experience

1. Motion graphic auto-plays full-screen on load (muted by default)
2. Video plays **once only** — no loop
3. On end: **freezes on the final frame** (Canvas capture — zero flicker)
4. After freeze:
   - Subtle **golden leaves** drift down from top (organic, shimmer, glow)
   - **Ambient gold dust** particles float upward
   - Text fades in: *"Be patient… currently planting seeds"* with gold glow + pulse
5. **Sound toggle** (bottom-right) — fade in/out, auto-fades at video end

---

## 🏗️ Architecture

### Media Delivery
The motion graphic (`mustardseed-motion.mp4`) is hosted on **Cloudflare R2** public bucket:
- **Bucket**: `mustardseed-assets`
- **Public URL**: `https://pub-00891786ee42488cb8a715a9bc019602.r2.dev/`
- Supports `Accept-Ranges: bytes` for proper browser video streaming
- **Not bundled** in the repo or deployment — pure CDN delivery

### Hosting
- **Platform**: Cloudflare Pages
- **Worker**: Hono (minimal — serves `index.html` and static assets)
- **Build output**: `dist/` — 52KB total (HTML + Worker JS)
- **Build time**: ~500ms

### Tech Stack
```
Frontend:  Pure HTML/CSS/JavaScript (no frameworks)
Backend:   Hono on Cloudflare Workers  
Video CDN: Cloudflare R2 (public bucket, Accept-Ranges streaming)
Hosting:   Cloudflare Pages
```

---

## 🚀 Deployment

### Prerequisites
- Cloudflare account with R2 enabled
- Wrangler CLI authenticated

### Deploy to Cloudflare Pages
```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name mseedproductions-site
```

### Upload video to R2 (if needed)
```bash
npx wrangler r2 object put mustardseed-assets/mustardseed-motion.mp4 \
  --file=./mustardseed-motion.mp4 \
  --content-type="video/mp4" \
  --remote

# Enable public access
npx wrangler r2 bucket dev-url enable mustardseed-assets
```

---

## 💻 Local Development

```bash
npm install
npm run build
pm2 start ecosystem.config.cjs
# Open http://localhost:3000
```

> The page references the R2 video URL directly, so the motion graphic
> streams from Cloudflare R2 even in local dev (requires internet).
> Optionally place `mustardseed-motion.mp4` in `public/` for fully offline dev.

---

## 📁 Project Structure

```
webapp/
├── public/
│   ├── index.html          # Landing page (source of truth)
│   └── static/
│       └── style.css
├── src/
│   └── index.tsx           # Hono worker (minimal static serving)
├── dist/                   # Build output (gitignored)
├── ecosystem.config.cjs    # PM2 local dev config
├── wrangler.jsonc          # Cloudflare Pages config
├── vite.config.ts          # Build config
└── package.json
```

---

## ✅ Completed Features

- [x] Cinematic full-screen video autoplay
- [x] Freeze on final frame (seamless Canvas capture)
- [x] Golden leaves animation (shimmer, glow, organic drift)
- [x] Ambient dust particles
- [x] Glowing gold text with pulse animation
- [x] Sound toggle with fade in/out
- [x] Fully responsive (desktop + mobile)
- [x] Video hosted on Cloudflare R2 CDN (production-ready)
- [x] Deployed to Cloudflare Pages
- [x] Fast builds (~500ms, no video in bundle)

---

*From Small Faith, Great Stories Grow.*
