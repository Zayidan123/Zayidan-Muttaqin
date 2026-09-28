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
    const targetTheme = theme === 'dark' ? 'light' : 'dark'

    // Theme transition overlay — a soft flash that masks the palette swap
    const overlay = document.createElement('div')
    overlay.id = 'theme-transition-overlay'
    const overlayBg = targetTheme === 'light' ? '#ffffff' : '#050510'
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

    setTheme(targetTheme)
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={handleToggle}
      className="relative w-9 h-9 rounded-lg glass flex items-center justify-center transition-all duration-300 hover:shadow-[var(--glow-cyan)] group cursor-pointer [perspective:200px]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Tema Terang' : 'Tema Gelap'}
    >
      {/* 3D flip: sun and moon swap with a rotateY turn */}
      <Sun
        className="h-4 w-4 absolute transition-all duration-500 text-[var(--neon-cyan)] group-hover:rotate-90 group-hover:scale-110"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotateY(90deg) scale(0.6)' : 'rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
        }}
      />
      <Moon
        className="h-4 w-4 absolute transition-all duration-500 text-[var(--neon-cyan)] group-hover:-rotate-12 group-hover:scale-110"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotateY(0deg) scale(1)' : 'rotateY(-90deg) scale(0.6)',
          transformStyle: 'preserve-3d',
        }}
      />
    </button>
  )
}
