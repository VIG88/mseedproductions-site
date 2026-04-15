import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

/**
 * MustardSeed Productions
 *
 * Routes:
 *  /               — Cinematic landing page (motion graphic + ambient sound)
 *  /about                    — About page
 *  /stories                  — Stories page (Seeds of Greatness + Children's Books)
 *  /tv-properties            — TV Properties page (Animated + Television)
 *  /philosophy               — Philosophy page
 *  /characters/yeshua        — Character page: Growing Up with Yeshua
 *  /static/*                 — Shared static assets (favicon, VIG logo, CSS)
 */

// Static assets
app.use('/static/*', serveStatic({ root: './' }))

// Catch-all: let Cloudflare Pages serve the correct HTML file from dist/
app.use('/*', serveStatic({ root: './' }))

export default app
