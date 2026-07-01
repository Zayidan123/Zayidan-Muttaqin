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

  // Rate limit: 30 requests per minute per IP
  const rl = rateLimit(ip, { windowMs: 60_000, maxRequests: 30 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    )
  }

  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const totalVisitors = await db.visitorSession.count()
    const totalPageViews = await db.pageView.count()
    const contactSubmissions = await db.contactSubmission.count()

    const sectionViews = await db.pageView.groupBy({
      by: ['section'],
      _count: { section: true },
      orderBy: { _count: { section: 'desc' } },
    })

    const recentVisitorsRaw = await db.visitorSession.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { pageViews: { select: { section: true, createdAt: true } } },
    })

    const recentVisitors = recentVisitorsRaw.map((v: any) => ({
      sessionId: v.sessionId,
      timestamp: v.createdAt.toISOString(),
      country: v.country || 'Unknown',
      sectionsViewed: v.pageViews.map((pv: any) => pv.section),
    }))

    const contactSubmissionsList = await db.contactSubmission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, subject: true, createdAt: true },
    })

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const dailyTrend = await db.$queryRaw<{ date: string; count: number }[]>`
      SELECT DATE(createdAt) as date, COUNT(DISTINCT sessionId) as count
      FROM VisitorSession
      WHERE createdAt >= ${sevenDaysAgo.toISOString()}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `

    const avgSectionsPerVisit = totalVisitors > 0 ? Math.round((totalPageViews / totalVisitors) * 10) / 10 : 0

    return NextResponse.json({
      success: true,
      data: {
        totalVisitors,
        totalPageViews,
        contactSubmissions,
        avgSectionsPerVisit,
        sectionViews: sectionViews.map((s: any) => ({ section: s.section, views: s._count.section })),
        recentVisitors,
        contactSubmissionsList: contactSubmissionsList.map((cs: any) => ({
          id: cs.id,
          name: cs.name,
          email: cs.email,
          subject: cs.subject,
          timestamp: cs.createdAt.toISOString(),
        })),
        dailyTrend,
      },
    }, {
      headers: {
        'X-RateLimit-Remaining': String(rl.remaining),
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const ip = getClientIp(request)

  const rl = rateLimit(ip, { windowMs: 60_000, maxRequests: 10 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await db.pageView.deleteMany({})
    await db.visitorSession.deleteMany({})
    return NextResponse.json({ success: true, message: 'Analytics data cleared' })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}