'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'theme-3d' | 'liquid-glass' | 'skeuomorphic'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'theme'
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

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && THEMES.includes(stored as Theme)) {
    return stored as Theme
  }

  return 'dark'
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
