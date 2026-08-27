'use client'
import { useEffect } from 'react'
import { useTheme, type Theme } from '@/lib/theme'
import { useLanguageStore } from '@/store/language-store'

// Module-level flag — CommandPalette sets this to true when open
let _commandPaletteOpen = false
export function setCommandPaletteOpen(open: boolean) {
  _commandPaletteOpen = open
}

// Full theme cycle order for the 'T' shortcut
const THEME_CYCLE: Theme[] = ['dark', 'light', 'skeuomorphic', 'liquid-glass', 'theme-3d']

export function useKeyboardShortcuts() {
  const { theme, setTheme } = useTheme()
  const { toggleLang } = useLanguageStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      // Don't trigger when command palette is open
      if (_commandPaletteOpen) return

      switch (e.key.toLowerCase()) {
        case 't':
          // Cycle through all 5 themes: dark → light → skeuomorphic → liquid-glass → theme-3d → dark...
          {
            const currentIdx = THEME_CYCLE.indexOf(theme)
            const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % THEME_CYCLE.length
            const nextTheme = THEME_CYCLE[nextIdx]
            setTheme(nextTheme)

            // Clean up special theme classes when switching (applyThemeClass handles the target class,
            // but we need to clear any others since ThemeCustomizer applies classes directly)
            const html = document.documentElement
            html.classList.remove('dark', 'light', 'theme-3d', 'liquid-glass', 'skeuomorphic')
            if (nextTheme === 'dark') html.classList.add('dark')
            else if (nextTheme === 'theme-3d') html.classList.add('theme-3d')
            else if (nextTheme === 'liquid-glass') html.classList.add('liquid-glass')
            else if (nextTheme === 'skeuomorphic') html.classList.add('skeuomorphic')

            // Clear custom preset so ThemeCustomizer won't restore old one
            try { localStorage.removeItem('theme-preset') } catch { /* ignore */ }
          }
          break
        case 'l':
          toggleLang()
          break
        case '1':
          document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
          break
        case '2':
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
          break
        case '3':
          document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
          break
        case '4':
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [theme, setTheme, toggleLang])
}