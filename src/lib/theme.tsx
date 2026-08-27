'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'theme-3d' | 'liquid-glass' | 'skeuomorphic'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'theme'
const RECENT_KEY = 'theme-recent'
const USAGE_KEY = 'theme-usage'
const MAX_RECENT = 4
const THEMES: Theme[] = ['light', 'dark', 'theme-3d', 'liquid-glass', 'skeuomorphic']

function applyThemeClass(theme: Theme) {
  const html = document.documentElement
  html.classList.remove(...THEMES)

  if (theme === 'dark') {
    html.classList.add('dark')
  } else if (theme === 'theme-3d') {
    html.classList.add('theme-3d')
  } else if (theme === 'liquid-glass') {
    html.classList.add('liquid-glass')
  } else if (theme === 'skeuomorphic') {
    html.classList.add('skeuomorphic')
  }
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  // Priority 1: URL hash ?theme=xxx or #theme=xxx (shareable links)
  try {
    const url = new URL(window.location.href)
    const hashTheme = url.searchParams.get('theme') || window.location.hash.replace(/^#theme=/, '').replace(/^#/, '')
    if (hashTheme && THEMES.includes(hashTheme as Theme)) {
      // Persist to localStorage so it sticks after URL is cleared
      try { localStorage.setItem(STORAGE_KEY, hashTheme) } catch { /* ignore */ }
      // Clean the URL (remove theme param) so refresh doesn't keep overriding
      if (url.searchParams.has('theme')) {
        url.searchParams.delete('theme')
        window.history.replaceState({}, '', url.toString())
      } else if (window.location.hash.includes('theme=')) {
        window.history.replaceState({}, '', window.location.pathname + window.location.search)
      }
      return hashTheme as Theme
    }
  } catch { /* ignore URL parse errors */ }

  // Priority 2: localStorage
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && THEMES.includes(stored as Theme)) {
    return stored as Theme
  }

  return 'dark'
}

// Track recently used themes (for quick access in ThemeCustomizer)
export function pushRecentTheme(theme: Theme) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    let recent: Theme[] = raw ? JSON.parse(raw) : []
    // Remove if already present, then prepend
    recent = recent.filter(t => t !== theme)
    recent.unshift(theme)
    // Cap at MAX_RECENT
    recent = recent.slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent))
  } catch { /* ignore */ }
}

// Track theme usage counts (for 'most used' stat in ThemeCustomizer)
export function incrementThemeUsage(theme: Theme) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(USAGE_KEY)
    const usage: Record<string, number> = raw ? JSON.parse(raw) : {}
    usage[theme] = (usage[theme] || 0) + 1
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
  } catch { /* ignore */ }
}

export function getThemeUsage(): Record<Theme, number> {
  if (typeof window === 'undefined') return {} as Record<Theme, number>
  try {
    const raw = localStorage.getItem(USAGE_KEY)
    const usage = raw ? JSON.parse(raw) : {}
    return usage as Record<Theme, number>
  } catch { return {} as Record<Theme, number> }
}

export function getMostUsedTheme(): { theme: Theme; count: number } | null {
  const usage = getThemeUsage()
  let max: Theme | null = null
  let maxCount = 0
  ;(Object.keys(usage) as Theme[]).forEach(t => {
    if (usage[t] > maxCount) {
      max = t
      maxCount = usage[t]
    }
  })
  return max ? { theme: max, count: maxCount } : null
}

// Reset all theme usage stats (for 'reset stats' button in ThemeCustomizer)
export function resetThemeUsage() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(USAGE_KEY)
    localStorage.removeItem(RECENT_KEY)
  } catch { /* ignore */ }
}

// Theme scheduler — auto-switch theme based on time of day
const SCHEDULE_KEY = 'theme-schedule-enabled'
const SCHEDULE_MAP: { startHour: number; theme: Theme; labelId: string; labelEn: string }[] = [
  { startHour: 6, theme: 'light', labelId: 'Pagi (06-12)', labelEn: 'Morning (6-12)' },
  { startHour: 12, theme: 'skeuomorphic', labelId: 'Siang (12-17)', labelEn: 'Afternoon (12-17)' },
  { startHour: 17, theme: 'liquid-glass', labelId: 'Sore (17-19)', labelEn: 'Evening (17-19)' },
  { startHour: 19, theme: 'dark', labelId: 'Malam (19-06)', labelEn: 'Night (19-6)' },
]

export function isThemeScheduleEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(SCHEDULE_KEY) === '1'
  } catch { return false }
}

export function setThemeScheduleEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SCHEDULE_KEY, enabled ? '1' : '0')
  } catch { /* ignore */ }
}

// Get the theme that should be active based on current hour
export function getScheduledTheme(date: Date = new Date()): { theme: Theme; labelId: string; labelEn: string } | null {
  const hour = date.getHours()
  let match = SCHEDULE_MAP[SCHEDULE_MAP.length - 1] // default to last (night)
  for (const entry of SCHEDULE_MAP) {
    if (hour >= entry.startHour) match = entry
  }
  // Wrap: hours 0-5 are still "night" (last entry)
  return { theme: match.theme, labelId: match.labelId, labelEn: match.labelEn }
}

export function getScheduleInfo() {
  return SCHEDULE_MAP.map(e => ({ ...e }))
}

export function getRecentThemes(): Theme[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    const recent: Theme[] = raw ? JSON.parse(raw) : []
    return recent.filter(t => THEMES.includes(t))
  } catch { return [] }
}

// Generate a shareable URL with theme embedded
export function getShareableThemeUrl(theme: Theme): string {
  if (typeof window === 'undefined') return ''
  const url = new URL(window.location.href)
  url.searchParams.set('theme', theme)
  // Clear hash to avoid confusion
  url.hash = ''
  return url.toString()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())

  useEffect(() => {
    applyThemeClass(theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme: (nextTheme: Theme) => {
        if (!THEMES.includes(nextTheme)) return
        setThemeState(nextTheme)
        try {
          localStorage.setItem(STORAGE_KEY, nextTheme)
        } catch {
          // ignore localStorage failures
        }
        // Track in recent themes + usage stats
        pushRecentTheme(nextTheme)
        incrementThemeUsage(nextTheme)
        applyThemeClass(nextTheme)
      },
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
