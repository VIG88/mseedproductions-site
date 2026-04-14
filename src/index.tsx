import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

/**
 * MustardSeed Productions — static landing page
 *
 * Architecture:
 *  - Landing page (index.html) served as a Cloudflare Pages static asset
 *  - Motion graphic hosted on Cloudflare R2 (public bucket)
 *    URL: https://pub-00891786ee42488cb8a715a9bc019602.r2.dev/mustardseed-motion.mp4
 *  - No server-side logic required for the core experience
 *  - This Hono worker handles /static/* for any additional assets
 */

// Serve any supplemental static assets
app.use('/static/*', serveStatic({ root: './' }))

// Catch-all: serve the landing page
app.use('/*', serveStatic({ root: './' }))

export default app
