'use client'

import { useTheme } from '@/lib/theme'
import { Sun, Moon } from 'lucide-react'
import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}
const getServerSnapshot = () => false

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    getServerSnapshot
  )
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  const handleToggle = () => {
    // If currently in a special theme (3D, liquid-glass, skeuomorphic), clear the preset
    // so ThemeCustomizer won't re-apply it
    if (theme === 'theme-3d' || theme === 'liquid-glass' || theme === 'skeuomorphic') {
      try { localStorage.removeItem('theme-preset') } catch { /* ignore */ }
    }

    // Determine target: switch between dark and light
    // skeuomorphic is a light theme, so toggling goes to dark
    const targetTheme = (theme === 'light' || theme === 'skeuomorphic') ? 'dark' : 'light'

    // Theme transition overlay
    const overlay = document.createElement('div')
    overlay.id = 'theme-transition-overlay'
    const overlayBg = (targetTheme === 'light') ? '#ffffff' : '#050510'
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', zIndex: '9999',
      background: overlayBg, pointerEvents: 'none', opacity: '0',
    })
    document.body.appendChild(overlay)
    const anim = overlay.animate(
      [{ opacity: 0 }, { opacity: 0.3 }, { opacity: 0 }],
      { duration: 400, easing: 'ease-in-out' },
    )
    anim.onfinish = () => overlay.remove()

    // Clean up special theme classes
    document.documentElement.classList.remove('theme-3d', 'liquid-glass', 'skeuomorphic')

    setTheme(targetTheme)
  }

  const isDark = theme !== 'light' && theme !== 'skeuomorphic'

  return (
    <button
      onClick={handleToggle}
      className="relative w-9 h-9 rounded-lg glass flex items-center justify-center transition-all duration-300 hover:shadow-[var(--glow-cyan)] group cursor-pointer"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun className="h-4 w-4 absolute transition-all duration-300 text-[var(--neon-cyan)] group-hover:rotate-90 group-hover:scale-110" style={{ opacity: isDark ? 0 : 1 }} />
      <Moon className="h-4 w-4 absolute transition-all duration-300 text-[var(--neon-cyan)] group-hover:-rotate-12 group-hover:scale-110" style={{ opacity: isDark ? 1 : 0 }} />
    </button>
  )
}