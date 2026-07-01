// In-memory rate limiter for API routes
// Each IP gets a sliding window of `windowMs` milliseconds
// with a maximum of `maxRequests` requests
//
// Note: This module must work in both Edge runtime (middleware) and Node.js runtime (API routes).
// The Edge runtime does NOT have Node.js Timer's .unref() method.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Lazy cleanup: remove expired entries during rateLimit calls instead of setInterval
// This avoids the need for .unref() which doesn't exist in Edge runtime
function cleanup() {
  const now = Date.now()
  // Only cleanup if store is getting large (avoid overhead on every call)
  if (store.size > 1000) {
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key)
    }
  }
}

export interface RateLimitConfig {
  /** Time window in milliseconds (default: 60_000 = 1 minute) */
  windowMs?: number
  /** Max requests per window (default: 60) */
  maxRequests?: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Check if a request from the given identifier is within rate limits.
 * Returns { allowed, remaining, resetAt }.
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  const { windowMs = 60_000, maxRequests = 60 } = config
  const now = Date.now()

  const entry = store.get(identifier)
  if (!entry || now > entry.resetAt) {
    // New window — clean up old entries opportunistically
    cleanup()
    const resetAt = now + windowMs
    store.set(identifier, { count: 1, resetAt })
    return { allowed: true, remaining: maxRequests - 1, resetAt }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}

/**
 * Strict rate limiter for sensitive endpoints (e.g., login attempts, contact form).
 * 10 requests per minute by default.
 */
export function strictRateLimit(identifier: string): RateLimitResult {
  return rateLimit(identifier, { windowMs: 60_000, maxRequests: 10 })
}

/**
 * Get client IP from request headers.
 * Works with both Web API Request (Edge) and NextRequest.
 */
export function getClientIp(request: Request): string {
  const headers = 'headers' in request ? (request as { headers: Headers }).headers : new Headers()
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  )
}