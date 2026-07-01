'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  const scaleX = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0
      setScrollProgress(progress)
      scaleX.set(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scaleX])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta), var(--neon-purple))',
        boxShadow: '0 0 10px var(--neon-cyan), 0 0 20px var(--neon-magenta), 0 0 30px var(--neon-purple)',
      }}
    />
  )
}