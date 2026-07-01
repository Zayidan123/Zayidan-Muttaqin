import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD || 'zayidan-admin-2024'
  return auth === `Bearer ${password}`
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)

  const rl = rateLimit(ip, { windowMs: 60_000, maxRequests: 60 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1') || 1
    const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') || '20') || 20, 100)

    const [items, total] = await Promise.all([
      db.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          message: true,
          ip: true,
          createdAt: true,
        },
      }),
      db.contactSubmission.count(),
    ])

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}