'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = ''
    }, 1500)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-6 ${visible ? '' : 'pointer-events-none'}`}
      style={{
        background: 'var(--dark-base, #0A0A0F)',
      }}
      aria-hidden={!visible}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 glass" style={{ background: 'rgba(10, 10, 15, 0.95)' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* ZAYIDAN text — div instead of h1 to maintain single h1 per page for SEO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.3em]"
          style={{
            color: 'var(--neon-cyan, #00F5FF)',
            textShadow: '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3), 0 0 60px rgba(0, 245, 255, 0.15)',
          }}
          role="presentation"
          aria-hidden="true"
        >
          ZAYIDAN
        </motion.div>

        {/* Loading bar */}
        <div className="w-48 sm:w-64 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, var(--neon-cyan, #00F5FF), var(--neon-magenta, #FF00AA), var(--neon-purple, #8B5CF6))',
              animation: 'loading-bar 1.5s ease-in-out forwards',
              boxShadow: '0 0 10px rgba(0, 245, 255, 0.4), 0 0 20px rgba(255, 0, 170, 0.3)',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}