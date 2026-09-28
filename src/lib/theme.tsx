'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * Unified two-theme system — Terang (light) & Gelap (dark).
 *
 * Both themes share the same modern 3D design language; the whole site
 * (backgrounds, cards, buttons, animations) adapts to the active theme.
 *
 * Resolution order:
 *  1. `?theme=` / `#theme=` URL param (shareable links)
 *  2. localStorage (`theme`)
 *  3. OS preference (`prefers-color-scheme`) — the site follows the system
 *     until the visitor explicitly picks a theme.
 *
 * Legacy themes from the old 5-theme system are mapped gracefully so
 * returning visitors never see a broken state.
 */

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'theme'
const THEMES: Theme[] = ['light', 'dark']

// Legacy theme → nearest new theme (keeps old localStorage values working)
const LEGACY_THEME_MAP: Record<string, Theme> = {
  'theme-3d': 'dark',
  'liquid-glass': 'dark',
  'skeuomorphic': 'light',
}

export function normalizeTheme(value: string | null | undefined): Theme | null {
  if (!value) return null
  if ((THEMES as string[]).includes(value)) return value as Theme
  return LEGACY_THEME_MAP[value] ?? null
}

function applyThemeClass(theme: Theme) {
  const html = document.documentElement
  // Also strip legacy classes in case a visitor still has one applied
  html.classList.remove('dark', 'light', 'theme-3d', 'liquid-glass', 'skeuomorphic')
  html.classList.add(theme)
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  // Priority 1: URL hash ?theme=xxx or #theme=xxx (shareable links)
  try {
    const url = new URL(window.location.href)
    const hashTheme = url.searchParams.get('theme') || window.location.hash.replace(/^#theme=/, '').replace(/^#/, '')
    const normalized = normalizeTheme(hashTheme)
    if (normalized) {
      // Persist to localStorage so it sticks after URL is cleared
      try { localStorage.setItem(STORAGE_KEY, normalized) } catch { /* ignore */ }
      // Clean the URL (remove theme param) so refresh doesn't keep overriding
      if (url.searchParams.has('theme')) {
        url.searchParams.delete('theme')
        window.history.replaceState({}, '', url.toString())
      } else if (window.location.hash.includes('theme=')) {
        window.history.replaceState({}, '', window.location.pathname + window.location.search)
      }
      return normalized
    }
  } catch { /* ignore URL parse errors */ }

  // Priority 2: localStorage (legacy values migrated transparently)
  try {
    const stored = normalizeTheme(localStorage.getItem(STORAGE_KEY))
    if (stored) return stored
  } catch { /* ignore */ }

  // Priority 3: follow the OS preference
  try {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
  } catch { /* ignore */ }

  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())

  useEffect(() => {
    applyThemeClass(theme)
  }, [theme])

  // Follow live OS theme changes while the visitor hasn't explicitly chosen
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          const next: Theme = e.matches ? 'light' : 'dark'
          setThemeState(next)
          applyThemeClass(next)
        }
      } catch { /* ignore */ }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme: (nextTheme: Theme) => {
        if (!(THEMES as string[]).includes(nextTheme)) return
        setThemeState(nextTheme)
        try {
          localStorage.setItem(STORAGE_KEY, nextTheme)
        } catch {
          // ignore localStorage failures
        }
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
