'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * CursorGlow — ambient cursor aura.
 * A large soft halo follows the pointer on springs (buttery lag), plus a
 * small bright core that tracks instantly. Disabled on touch devices.
 */
export function CursorGlow() {
  const [visible, setVisible] = useState(false)
  const prefersReduced = useReducedMotion()

  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const haloX = useSpring(x, { stiffness: 120, damping: 22, mass: 0.7 })
  const haloY = useSpring(y, { stiffness: 120, damping: 22, mass: 0.7 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [visible, x, y])

  if (!visible || prefersReduced) return null

  return (
    <>
      {/* Large trailing halo */}
      <motion.div
        className="fixed pointer-events-none z-[9998] w-[340px] h-[340px] rounded-full"
        style={{
          left: haloX,
          top: haloY,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%)',
          opacity: 0.07,
        }}
      />
      {/* Small bright core — follows instantly */}
      <motion.div
        className="fixed pointer-events-none z-[9999] w-[36px] h-[36px] rounded-full"
        style={{
          left: x,
          top: y,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, var(--neon-magenta) 0%, transparent 65%)',
          opacity: 0.12,
        }}
      />
    </>
  )
}
