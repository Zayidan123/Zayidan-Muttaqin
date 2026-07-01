'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

/**
 * Tracks mouse position globally and sets CSS custom properties on <html>
 * for dynamic 3D lighting effects in the cyber-3d theme.
 *
 * Sets:
 *   --light-x: -1 to 1 (normalized, left to right)
 *   --light-y: -1 to 1 (normalized, top to bottom)
 *   --light-px: pixel X position
 *   --light-py: pixel Y position
 */
export function use3DLightSource() {
  const { theme } = useTheme()
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0 })

  useEffect(() => {
    if (theme !== 'theme-3d') {
      // Clear vars when not in 3D mode
      document.documentElement.style.removeProperty('--light-x')
      document.documentElement.style.removeProperty('--light-y')
      document.documentElement.style.removeProperty('--light-px')
      document.documentElement.style.removeProperty('--light-py')
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.px = e.clientX
      mouseRef.current.py = e.clientY
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    const updateCSS = () => {
      const { x, y, px, py } = mouseRef.current
      const root = document.documentElement.style
      root.setProperty('--light-x', x.toFixed(3))
      root.setProperty('--light-y', y.toFixed(3))
      root.setProperty('--light-px', `${px}px`)
      root.setProperty('--light-py', `${py}px`)
      rafRef.current = requestAnimationFrame(updateCSS)
    }

    // Initialize at center
    mouseRef.current.x = 0
    mouseRef.current.y = 0
    mouseRef.current.px = window.innerWidth / 2
    mouseRef.current.py = window.innerHeight / 2

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(updateCSS)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [theme])
}