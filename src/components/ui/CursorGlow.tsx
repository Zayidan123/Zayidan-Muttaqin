'use client'

import { useEffect, useState } from 'react'

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [visible])

  if (!visible) return null

  return (
    <div
      className="fixed pointer-events-none z-[9999] w-[300px] h-[300px] rounded-full"
      style={{
        left: position.x - 150,
        top: position.y - 150,
        background: 'radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%)',
        opacity: 0.07,
        transition: 'left 0.1s ease-out, top 0.1s ease-out',
      }}
    />
  )
}