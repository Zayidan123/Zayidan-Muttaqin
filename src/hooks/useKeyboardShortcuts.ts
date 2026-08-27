'use client'
import { useEffect } from 'react'
import { useTheme, type Theme } from '@/lib/theme'
import { useLanguageStore } from '@/store/language-store'
import { useToastStore } from '@/store/toast-store'

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
  const { addToast } = useToastStore()

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

            // Show toast feedback so user knows which theme is now active
            const themeLabels: Record<Theme, { id: string; en: string; emoji: string }> = {
              dark: { id: 'Tema Gelap', en: 'Dark Theme', emoji: '🌙' },
              light: { id: 'Tema Terang', en: 'Light Theme', emoji: '☀️' },
              skeuomorphic: { id: 'Skeuomorfisme Cahaya', en: 'Light Skeuomorphism', emoji: '✨' },
              'liquid-glass': { id: 'Liquid Glass', en: 'Liquid Glass', emoji: '💧' },
              'theme-3d': { id: 'Dunia 3D', en: '3D World', emoji: '🧊' },
            }
            const lang = typeof localStorage !== 'undefined' ? (localStorage.getItem('lang') as 'id' | 'en' | null) || 'id' : 'id'
            const label = themeLabels[nextTheme]
            const message = lang === 'en' ? `${label.emoji} ${label.en}` : `${label.emoji} ${label.id}`
            addToast(message, 'info')
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

      // Alt+1..5: quick switch to specific theme (no conflict with 1-4 section nav)
      if (e.altKey && !e.metaKey && !e.ctrlKey) {
        const themeMap: Record<string, Theme> = {
          '1': 'dark',
          '2': 'light',
          '3': 'skeuomorphic',
          '4': 'liquid-glass',
          '5': 'theme-3d',
        }
        const target = themeMap[e.key]
        if (target) {
          e.preventDefault()
          setTheme(target)
          const html = document.documentElement
          html.classList.remove('dark', 'light', 'theme-3d', 'liquid-glass', 'skeuomorphic')
          if (target === 'dark') html.classList.add('dark')
          else if (target === 'theme-3d') html.classList.add('theme-3d')
          else if (target === 'liquid-glass') html.classList.add('liquid-glass')
          else if (target === 'skeuomorphic') html.classList.add('skeuomorphic')
          try { localStorage.removeItem('theme-preset') } catch { /* ignore */ }

          const themeLabels: Record<Theme, { id: string; en: string; emoji: string }> = {
            dark: { id: 'Tema Gelap', en: 'Dark Theme', emoji: '🌙' },
            light: { id: 'Tema Terang', en: 'Light Theme', emoji: '☀️' },
            skeuomorphic: { id: 'Skeuomorfisme Cahaya', en: 'Light Skeuomorphism', emoji: '✨' },
            'liquid-glass': { id: 'Liquid Glass', en: 'Liquid Glass', emoji: '💧' },
            'theme-3d': { id: 'Dunia 3D', en: '3D World', emoji: '🧊' },
          }
          const lang = typeof localStorage !== 'undefined' ? (localStorage.getItem('lang') as 'id' | 'en' | null) || 'id' : 'id'
          const label = themeLabels[target]
          const message = lang === 'en' ? `${label.emoji} ${label.en}` : `${label.emoji} ${label.id}`
          addToast(message, 'info')
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [theme, setTheme, toggleLang, addToast])
}