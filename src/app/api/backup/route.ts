import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { backupImportItemSchema } from '@/lib/validators'
import { sanitizeInput } from '@/lib/sanitize'
import { z } from 'zod/v4'

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD || 'zayidan-admin-2024'
  return auth === `Bearer ${password}`
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)

  const rl = rateLimit(ip, { windowMs: 60_000, maxRequests: 30 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const items = await db.cmsContent.findMany({ orderBy: { category: 'asc' } })
    const backup = { exportedAt: new Date().toISOString(), version: 1, items }
    return NextResponse.json(backup)
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  const rl = rateLimit(ip, { windowMs: 60_000, maxRequests: 10 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()

    // Validate items array
    const itemsSchema = z.array(backupImportItemSchema).max(500)
    let items: z.infer<typeof itemsSchema>

    if (Array.isArray(body.items)) {
      const result = itemsSchema.safeParse(body.items)
      if (!result.success) {
        return NextResponse.json(
          { error: `Invalid backup format: ${result.error.issues[0]?.message}` },
          { status: 400 }
        )
      }
      items = result.data
    } else if (Array.isArray(body)) {
      const result = itemsSchema.safeParse(body)
      if (!result.success) {
        return NextResponse.json(
          { error: `Invalid backup format: ${result.error.issues[0]?.message}` },
          { status: 400 }
        )
      }
      items = result.data
    } else {
      return NextResponse.json({ error: 'items array required' }, { status: 400 })
    }

    await db.cmsContent.deleteMany({})
    for (const item of items) {
      await db.cmsContent.upsert({
        where: { key: sanitizeInput(item.key) },
        update: { value: sanitizeInput(item.value), category: item.category ? sanitizeInput(item.category) : 'general' },
        create: { key: sanitizeInput(item.key), value: sanitizeInput(item.value), category: item.category ? sanitizeInput(item.category) : 'general' },
      })
    }
    return NextResponse.json({ success: true, imported: items.length })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}