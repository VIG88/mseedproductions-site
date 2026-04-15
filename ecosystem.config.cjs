module.exports = {
  apps: [
    {
      name: 'mustardseed',
      script: 'npx',
      // NOTE: The motion graphic is served from Cloudflare R2 CDN in production.
      // For local dev: place mustardseed-motion.mp4 in public/ if you want local playback,
      // OR the page will stream it from R2 directly (requires internet).
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
