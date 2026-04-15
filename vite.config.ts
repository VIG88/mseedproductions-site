import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    build(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ],
  // Exclude the large video from being copied to dist on every build.
  // The motion graphic is hosted on Cloudflare R2 and referenced by URL.
  publicDir: 'public',
  assetsInclude: ['**/*.html'],
  build: {
    rollupOptions: {
      // No special exclusions needed — the video isn't imported by code
    }
  }
})
