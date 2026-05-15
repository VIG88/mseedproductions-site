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

// ── PLANT A SEED — EARLY INTEREST / WAITLIST API ────────────────────────────
app.post('/api/seed', async (c) => {
  try {
    const body = await c.req.json()
    const { firstName, email, character } = body as {
      firstName: string
      email: string
      character: string
    }

    // Validation
    if (!firstName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ ok: false, error: 'Please enter a valid name and email.' }, 400)
    }

    const accessKey = (c.env?.WEB3FORMS_KEY) || 'b446c862-92aa-40d0-99c7-5a261b45a094'
    const characterLabel = character
      ? character.charAt(0).toUpperCase() + character.slice(1)
      : 'Unknown'

    // ── 1. Notify MustardSeed of new seed submission ──────────────────────────
    const notifyBody = [
      `🌱 New Early Interest Submission`,
      ``,
      `Name:      ${firstName}`,
      `Email:     ${email}`,
      `Character: Growing Up with ${characterLabel}`,
      ``,
      `This visitor has joined the early story list for future release updates.`,
    ].join('\n')

    const notifyRes = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `🌱 A Seed Has Been Planted — Growing Up with ${characterLabel}`,
        from_name: `${firstName} (MustardSeed Early List)`,
        replyto: email,
        message: notifyBody,
      }),
    })

    const notifyData = await notifyRes.json() as { success: boolean }
    if (!notifyData.success) {
      console.error('[seed] Web3Forms notify error:', notifyData)
      return c.json({ ok: false, error: 'Could not record your interest. Please try again.' }, 502)
    }

    // ── 2. Send confirmation email to the visitor ─────────────────────────────
    const confirmBody = [
      `Hi ${firstName},`,
      ``,
      `Thank you for planting a seed with MustardSeed Productions.`,
      ``,
      `Your journey into the world of Stories in Motion has officially begun.`,
      ``,
      `We created MustardSeed to tell heartfelt cinematic stories that help children feel seen, valued, inspired, and emotionally connected to who they are becoming.`,
      ``,
      `As our stories continue growing, you'll be among the first to receive early updates about future book releases, Stories in Motion premieres, and collectible edition announcements.`,
      ``,
      `Something beautiful is growing…`,
      ``,
      `And we're grateful you're part of it from the very beginning.`,
      ``,
      `MustardSeed Productions`,
      `www.mseedproductions.com`,
    ].join('\n')

    // Web3Forms supports sending a copy to the submitter via the `from_email` field
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `🌱 A Seed Has Been Planted`,
        from_name: 'MustardSeed Productions',
        replyto: 'info@mseedproductions.com',
        to: email,
        message: confirmBody,
      }),
    })

    return c.json({ ok: true })
  } catch (err) {
    console.error('[seed] Unexpected error:', err)
    return c.json({ ok: false, error: 'Server error. Please try again.' }, 500)
  }
})

// ── STATIC ASSETS ────────────────────────────────────────────────────────────
app.use('/static/*', serveStatic({ root: './' }))

// Catch-all fallback
app.use('/*', serveStatic({ root: './' }))

export default app
