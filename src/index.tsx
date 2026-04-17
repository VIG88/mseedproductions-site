import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

/**
 * MustardSeed Productions — Cloudflare Pages Worker
 *
 * Static HTML files are served directly by Cloudflare Pages from dist/
 * The worker handles API routes and static assets only.
 * Clean URLs (e.g. /stories → stories.html) are handled by Pages' built-in
 * HTML handling — no worker intervention needed for those routes.
 */

// Static assets only — let Cloudflare Pages serve HTML files natively
app.use('/static/*', serveStatic({ root: './' }))

// Catch-all fallback
app.use('/*', serveStatic({ root: './' }))

export default app
