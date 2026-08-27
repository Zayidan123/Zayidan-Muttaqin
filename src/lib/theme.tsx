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
        // Track in recent themes
        pushRecentTheme(nextTheme)
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
