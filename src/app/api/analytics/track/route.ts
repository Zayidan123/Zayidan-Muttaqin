import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, strictRateLimit, getClientIp } from '@/lib/rate-limit'
import { sanitizeInput } from '@/lib/sanitize'
import { analyticsTrackSchema } from '@/lib/validators'
import { z } from 'zod/v4'

// Execution timeout: 10 seconds
const TIMEOUT_MS = 10_000

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // Rate limit: 30 requests per minute per IP
  const rl = rateLimit(ip, { windowMs: 60_000, maxRequests: 30 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    )
  }

  // Parse and validate body with Zod
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = analyticsTrackSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return NextResponse.json(
      { error: `Validation error: ${firstError?.message || 'Invalid data'}` },
      { status: 400 }
    )
  }

  const { sessionId, section, duration } = parsed.data

  // Sanitize inputs
  const safeSessionId = sanitizeInput(sessionId)
  const safeSection = sanitizeInput(section)

  // Execution timeout wrapper
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const existing = await db.visitorSession.findUnique({ where: { sessionId: safeSessionId } })
    if (!existing) {
      await db.visitorSession.create({
        data: {
          sessionId: safeSessionId,
          ip: ip !== 'unknown' ? ip.slice(0, 45) : null,
          userAgent: typeof body.userAgent === 'string' ? (body.userAgent as string).slice(0, 500) : null,
          referrer: typeof body.referrer === 'string' ? (body.referrer as string).slice(0, 2000) : null,
        },
      })
    }

    const pageView = await db.pageView.create({
      data: {
        sessionId: safeSessionId,
        section: safeSection,
        duration: z.number().int().min(0).max(86400).parse(duration ?? 0),
      },
    })

    return NextResponse.json({ success: true, data: pageView }, {
      headers: {
        'X-RateLimit-Remaining': String(rl.remaining),
      },
    })
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    clearTimeout(timeout)
  }
}