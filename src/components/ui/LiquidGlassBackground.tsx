'use client'

import { useTheme } from '@/lib/theme'
import { useMemo, useState, useEffect } from 'react'

/**
 * Liquid Glass Background — morphing pastel gradient blobs
 * Inspired by https://liquid-glass-cb7251.webflow.io/
 * Only visible when "Liquid Glass" theme is active.
 */

const BLOBS = [
  { color: 'rgba(200, 160, 255, 0.5)', size: 700, x: '20%', y: '25%', duration: 22, delay: 0 },
  { color: 'rgba(248, 187, 217, 0.45)', size: 600, x: '75%', y: '15%', duration: 18, delay: -5 },
  { color: 'rgba(165, 230, 207, 0.4)', size: 550, x: '50%', y: '70%', duration: 25, delay: -10 },
  { color: 'rgba(187, 222, 251, 0.35)', size: 480, x: '80%', y: '60%', duration: 20, delay: -3 },
  { color: 'rgba(255, 224, 178, 0.3)', size: 400, x: '10%', y: '80%', duration: 23, delay: -8 },
  { color: 'rgba(225, 190, 231, 0.35)', size: 500, x: '40%', y: '30%', duration: 19, delay: -12 },
]

export function LiquidGlassBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isLiquidGlass = theme === 'liquid-glass'

  if (!isLiquidGlass) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 30%, #e0f2f1 60%, #fff3e0 100%)',
        }}
      />

      {/* Morphing liquid blobs */}
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="absolute liquid-blob"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            animation: `liquid-morph-${i % 3} ${blob.duration}s ease-in-out infinite`,
            animationDelay: `${blob.delay}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Noise texture overlay for glass depth */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Soft inner glow vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.3) 100%)',
        }}
      />
    </div>
  )
}

/**
 * Floating sparkle particles
 */
export function SparkleField() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const sparkles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      // Pure, deterministic pseudo-random generator to satisfy render purity constraints
      const random1 = (Math.abs(Math.sin(i * 12.9898 + 78.233)) * 43758.5453) % 1
      const random2 = (Math.abs(Math.sin(i * 4.1414 + 11.235)) * 43758.5453) % 1
      const random3 = (Math.abs(Math.sin(i * 7.1121 + 88.541)) * 43758.5453) % 1
      const random4 = (Math.abs(Math.sin(i * 9.5412 + 23.321)) * 43758.5453) % 1
      const random5 = (Math.abs(Math.sin(i * 3.1415 + 45.123)) * 43758.5453) % 1
      return {
        id: i,
        x: random1 * 100,
        y: random2 * 100,
        size: 2 + random3 * 4,
        duration: 2 + random4 * 4,
        delay: random5 * 5,
        opacity: 0.3 + random1 * 0.7,
      }
    })
  }, [])

  if (!mounted) return null

  const isLiquidGlass = theme === 'liquid-glass'

  if (!isLiquidGlass) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute sparkle-particle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: 0,
            animation: `sparkle-twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 10 10" fill="none">
            <path
              d="M5 0L6.18 3.82L10 5L6.18 6.18L5 10L3.82 6.18L0 5L3.82 3.82L5 0Z"
              fill="white"
              fillOpacity={s.opacity}
            />
          </svg>
        </div>
      ))}
    </div>
  )
}