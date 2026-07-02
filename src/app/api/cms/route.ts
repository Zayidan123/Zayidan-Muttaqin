import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { cmsPutSchema, cmsDeleteSchema } from '@/lib/validators'
import { sanitizeInput } from '@/lib/sanitize'

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD || 'zayidan-admin-2024'
  return auth === `Bearer ${password}`
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)

  // Rate limit: 60 requests per minute
  const rl = rateLimit(ip, { windowMs: 60_000, maxRequests: 60 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  // Allow unauthenticated access for reading CMS data (public content)
  // Authentication is only required for PUT/DELETE operations
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const where = category ? { category: sanitizeInput(category) } : {}
    const items = await db.cmsContent.findMany({ where, orderBy: { category: 'asc' } })
    const grouped: Record<string, { key: string; value: string }[]> = {}
    for (const item of items) {
      if (!grouped[item.category]) grouped[item.category] = []
      grouped[item.category].push({ key: item.key, value: item.value })
    }
    return NextResponse.json({ success: true, data: items, grouped })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const ip = getClientIp(request)

  const rl = rateLimit(ip, { windowMs: 60_000, maxRequests: 60 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = cmsPutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: `Validation error: ${parsed.error.issues[0]?.message || 'Invalid data'}` },
        { status: 400 }
      )
    }

    const { key, value, category } = parsed.data
    const safeKey = sanitizeInput(key)
    const safeValue = sanitizeInput(value)
    const safeCategory = category ? sanitizeInput(category) : 'general'

    const item = await db.cmsContent.upsert({
      where: { key: safeKey },
      update: { value: safeValue, category: safeCategory },
      create: { key: safeKey, value: safeValue, category: safeCategory },
    })
    return NextResponse.json({ success: true, data: item })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const ip = getClientIp(request)

  const rl = rateLimit(ip, { windowMs: 60_000, maxRequests: 60 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = cmsDeleteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: `Validation error: ${parsed.error.issues[0]?.message || 'Invalid data'}` },
        { status: 400 }
      )
    }

    await db.cmsContent.delete({ where: { key: sanitizeInput(parsed.data.key) } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}