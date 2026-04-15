import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

/**
 * MustardSeed Productions
 *
 * Routes:
 *  /          — Cinematic landing page (motion graphic + ambient sound)
 *  /garden    — Full MustardSeed Productions site (children's storytelling world)
 *  /static/*  — Shared static assets (favicon, VIG logo, CSS)
 */

// Static assets
app.use('/static/*', serveStatic({ root: './' }))

// Catch-all: let Cloudflare Pages serve the correct HTML file from dist/
// index.html → served at /
// garden.html → served at /garden
app.use('/*', serveStatic({ root: './' }))

export default app
