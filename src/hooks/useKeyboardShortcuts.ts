'use client'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useLanguageStore } from '@/store/language-store'

// Module-level flag — CommandPalette sets this to true when open
let _commandPaletteOpen = false
export function setCommandPaletteOpen(open: boolean) {
  _commandPaletteOpen = open
}

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
          setTheme(theme === 'dark' ? 'light' : 'dark')
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