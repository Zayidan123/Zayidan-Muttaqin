import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

// Simple bot detection patterns
const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i, /harvest/i,
  /fetch/i, /curl/i, /wget/i, /python-requests/i, /httpclient/i,
  /java\/|go-http/i, /node-fetch/i,
]

// Paths that require stricter rate limiting
const SENSITIVE_PATHS = ['/api/analytics/track', '/api/contact']

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const url = request.nextUrl
  const ip = getClientIp(request)
  const ua = request.headers.get('user-agent') || ''

  // ─── 1. Security Headers ─────────────────────────────────────────────────
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://www.googletagmanager.com https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.githubusercontent.com https://media.giphy.com https://i.pravatar.cc https://*.googleapis.com https://*.gstatic.com https://images.unsplash.com",
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://www.google.com https://*.google.com https://maps.google.com https://*.maps.google.com https://www.openstreetmap.org https://*.openstreetmap.org",
      "connect-src 'self' https://formspree.io https://vitals.vercel-insights.com https://*.googleapis.com https://maps.googleapis.com",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://formspree.io",
    ].join('; ')
  )

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Clickjacking protection
  response.headers.set('X-Frame-Options', 'DENY')

  // XSS Protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy — disable unnecessary browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  )

  // HSTS (HTTP Strict Transport Security) — 1 year, include subdomains
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )

  // Remove Server header (set by middleware, overrides default)
  response.headers.set('Server', '')

  // ─── 2. Global Rate Limiting ────────────────────────────────────────────
  // More aggressive rate limiting for public API endpoints
  if (url.pathname.startsWith('/api/')) {
    const isSensitive = SENSITIVE_PATHS.some((p) => url.pathname.startsWith(p))
    const maxReq = isSensitive ? 20 : 120
    const rl = rateLimit(ip, { windowMs: 60_000, maxRequests: maxReq })

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    response.headers.set('X-RateLimit-Remaining', String(rl.remaining))
  }

  // ─── 3. Block obviously malicious user agents ────────────────────────────
  // Only for public API endpoints, not admin
  if (url.pathname.startsWith('/api/analytics/track')) {
    // Skip known legitimate UAs
    if (!ua || ua.length < 10) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Block if UA matches known bot patterns (allow legitimate search crawlers)
    const isBot = BOT_PATTERNS.some((pattern) => pattern.test(ua)) &&
      !/googlebot|bingbot|slurp|duckduckbot/i.test(ua)

    if (isBot) {
      // Don't block but don't track either — return silently
      return NextResponse.json({ success: true, data: { id: 'ignored' } })
    }
  }

  return response
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals, static files, and public assets
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.webp$|.*\\.gif$|.*\\.pdf$|.*\\.json$|.*\\.js$).*)',
  ],
}