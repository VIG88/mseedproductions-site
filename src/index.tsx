import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  WEB3FORMS_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

/**
 * MustardSeed Productions — Cloudflare Pages Worker
 *
 * Static HTML files are served directly by Cloudflare Pages from dist/
 * The worker handles API routes and static assets only.
 */

// ── CONTACT FORM API ────────────────────────────────────────────────────────
app.use('/api/*', cors())

app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, message, interests } = body as {
      name: string
      email: string
      message?: string
      interests?: string[]
    }

    // Basic server-side validation
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ ok: false, error: 'Invalid submission.' }, 400)
    }

    const interestMap: Record<string, string> = {
      'book-releases':  'Notify me about Book Releases',
      'plant-a-seed':   'I\'d like to Plant a Seed (Donations)',
      'join-community': 'I want to Join the Community',
    }
    const interestText = (interests && interests.length)
      ? interests.map((v: string) => interestMap[v] || v).join('\n  • ')
      : 'None selected'

    const emailBody = [
      `Name:    ${name}`,
      `Email:   ${email}`,
      ``,
      `Interests:`,
      `  • ${interestText}`,
      ``,
      message ? `Message:\n${message}` : '',
    ].filter(Boolean).join('\n')

    // Web3Forms — free service, routes to the registered recipient email.
    // Access key is stored as a Cloudflare secret: WEB3FORMS_KEY
    // Sign up free at https://web3forms.com to get a key tied to info@mseedproductions.com
    // Use env secret if set, otherwise fall back to the public access key
    const accessKey = (c.env?.WEB3FORMS_KEY) || 'b446c862-92aa-40d0-99c7-5a261b45a094'

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `MustardSeed Community — ${name}`,
        from_name: name,
        replyto: email,
        message: emailBody,
      }),
    })

    const data = await res.json() as { success: boolean; message?: string }

    if (!data.success) {
      console.error('[contact] Web3Forms error:', data)
      return c.json({ ok: false, error: 'Could not deliver message. Please try again.' }, 502)
    }

    return c.json({ ok: true })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return c.json({ ok: false, error: 'Server error. Please try again.' }, 500)
  }
})

// ── STATIC ASSETS ────────────────────────────────────────────────────────────
app.use('/static/*', serveStatic({ root: './' }))

// Catch-all fallback
app.use('/*', serveStatic({ root: './' }))

export default app
