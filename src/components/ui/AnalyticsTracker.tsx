'use client'

import { useEffect, useRef, useCallback } from 'react'

const SECTION_IDS = ['hero', 'about', 'stats', 'techstack', 'achievements', 'experience', 'faq', 'contact']

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem('analytics-session')
  if (!sid) {
    sid = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
    sessionStorage.setItem('analytics-session', sid)
  }
  return sid
}

export function AnalyticsTracker() {
  const sessionIdRef = useRef('')
  const trackedRef = useRef<Set<string>>(new Set())
  const lastTrackRef = useRef(0)

  const track = useCallback((section: string, duration: number = 0) => {
    const now = Date.now()
    if (now - lastTrackRef.current < 3000) return
    if (trackedRef.current.has(section)) return
    lastTrackRef.current = now
    trackedRef.current.add(section)

    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          section,
          duration,
          userAgent: navigator.userAgent,
          referrer: document.referrer || undefined,
        }),
      }).catch(() => {})
    } catch {}
  }, [])

  useEffect(() => {
    sessionIdRef.current = getSessionId()
    track('hero')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            track(entry.target.id)
          }
        }
      },
      { threshold: 0.3 }
    )

    const timer = setTimeout(() => {
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 1000)

    const handleUnload = () => { navigator.sendBeacon('/api/analytics/track', JSON.stringify({ sessionId: sessionIdRef.current, section: 'leave', duration: 0 })) }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [track])

  return null
}