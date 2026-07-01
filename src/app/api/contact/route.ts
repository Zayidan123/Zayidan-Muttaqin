import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { strictRateLimit, getClientIp } from '@/lib/rate-limit'
import { sanitizeInput } from '@/lib/sanitize'
import { contactFormSchema } from '@/lib/validators'

// Execution timeout: 15 seconds
const TIMEOUT_MS = 15_000

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // Strict rate limit: 5 submissions per minute per IP
  const rl = strictRateLimit(ip)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait before sending another.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    )
  }

  // Parse JSON body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body. Please send valid JSON.' }, { status: 400 })
  }

  // Runtime type validation with Zod
  const parsed = contactFormSchema.safeParse(body)
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
    return NextResponse.json(
      { error: 'Validation failed', details: errors },
      { status: 400 }
    )
  }

  const { name, email, subject, message } = parsed.data

  // Sanitize all inputs before storing
  const safeName = sanitizeInput(name)
  const safeEmail = sanitizeInput(email)
  const safeSubject = sanitizeInput(subject)
  const safeMessage = sanitizeInput(message)

  // Timeout wrapper
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    // Store submission in database
    const submission = await db.contactSubmission.create({
      data: {
        name: safeName,
        email: safeEmail,
        subject: safeSubject,
        message: safeMessage,
        ip: ip !== 'unknown' ? ip.slice(0, 45) : null,
      },
    })

    // If Formspree ID is configured, also forward to Formspree
    const formspreeId = process.env.FORMSPREE_ID
    if (formspreeId) {
      try {
        await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: safeName, email: safeEmail, subject: safeSubject, message: safeMessage }),
          signal: controller.signal,
        })
      } catch {
        // Formspree failure doesn't affect local storage
      }
    }

    return NextResponse.json(
      { success: true, message: 'Message received. Thank you!' },
      {
        status: 201,
        headers: { 'X-RateLimit-Remaining': String(rl.remaining) },
      }
    )
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return NextResponse.json({ error: 'Request took too long. Please try again.' }, { status: 504 })
    }
    return NextResponse.json({ error: 'Failed to process your message. Please try again later.' }, { status: 500 })
  } finally {
    clearTimeout(timeout)
  }
}

// GET is not allowed — submissions are admin-only via /api/contact-submissions
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}