'use client'
import { useEffect } from 'react'
import { useTheme } from '@/lib/theme'
import { useLanguageStore } from '@/store/language-store'
import { useToastStore } from '@/store/toast-store'
import { playThemeSwitchSound } from '@/lib/theme-sound'

// Module-level flag — CommandPalette sets this to true when open
let _commandPaletteOpen = false
export function setCommandPaletteOpen(open: boolean) {
  _commandPaletteOpen = open
}

const THEME_LABELS = {
  dark: { id: 'Tema Gelap', en: 'Dark Theme', emoji: '🌙' },
  light: { id: 'Tema Terang', en: 'Light Theme', emoji: '☀️' },
} as const

export function useKeyboardShortcuts() {
  const { theme, setTheme } = useTheme()
  const { toggleLang } = useLanguageStore()
  const { addToast } = useToastStore()

  useEffect(() => {
    const switchTheme = (target: 'dark' | 'light') => {
      setTheme(target)
      const lang = typeof localStorage !== 'undefined' ? (localStorage.getItem('lang') as 'id' | 'en' | null) || 'id' : 'id'
      const label = THEME_LABELS[target]
      const message = lang === 'en' ? `${label.emoji} ${label.en}` : `${label.emoji} ${label.id}`
      addToast(message, 'info')
      // Play theme switch sound effect (chime per theme)
      playThemeSwitchSound(target)
    }

    const handler = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      // Don't trigger when command palette is open
      if (_commandPaletteOpen) return

      switch (e.key.toLowerCase()) {
        case 't':
          // Toggle the two themes: Gelap ↔ Terang
          switchTheme(theme === 'dark' ? 'light' : 'dark')
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

      // Alt+1/2: quick switch to a specific theme (no conflict with 1-4 section nav)
      if (e.altKey && !e.metaKey && !e.ctrlKey) {
        const themeMap: Record<string, 'dark' | 'light'> = {
          '1': 'dark',
          '2': 'light',
        }
        const target = themeMap[e.key]
        if (target) {
          e.preventDefault()
          switchTheme(target)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [theme, setTheme, toggleLang, addToast])
}
