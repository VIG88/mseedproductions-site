import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve the video file
app.use('/mustardseed-motion.mp4', serveStatic({ root: './' }))

// Serve static assets (CSS, JS, etc.)
app.use('/static/*', serveStatic({ root: './' }))

// Serve the main landing page
app.use('/', serveStatic({ path: './index.html', root: './' }))

export default app
