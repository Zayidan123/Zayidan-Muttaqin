'use client'

import { useTheme } from '@/lib/theme'
import { useState, useEffect } from 'react'

/**
 * Skeuomorphic Background — "Skeuomorfisme Cahaya"
 * Light skeuomorphism: soft warm surfaces, subtle paper grain,
 * gentle floating light orbs (cahaya), and a soft vignette.
 * Inspired by stripped-down early Apple UI + sleeker brighter 3D realism (2026 trend).
 * Only visible when the "Skeuomorfisme Cahaya" theme is active.
 */

const LIGHT_ORBS = [
  { size: 520, x: '18%', y: '22%', color: 'rgba(212, 162, 76, 0.18)', duration: 26, delay: 0 },
  { size: 440, x: '78%', y: '18%', color: 'rgba(180, 140, 95, 0.16)', duration: 22, delay: -6 },
  { size: 460, x: '52%', y: '68%', color: 'rgba(232, 200, 150, 0.15)', duration: 30, delay: -12 },
  { size: 360, x: '85%', y: '62%', color: 'rgba(200, 160, 110, 0.13)', duration: 24, delay: -3 },
  { size: 300, x: '10%', y: '78%', color: 'rgba(240, 215, 170, 0.14)', duration: 28, delay: -9 },
]

export function SkeuomorphicBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isSkeuomorphic = theme === 'skeuomorphic'

  if (!isSkeuomorphic) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden skeuomorphic-bg">
      {/* Base warm ivory gradient — soft, tactile surface */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, #F6F1E7 0%, #EFE8DA 45%, #E8DFCD 100%)',
        }}
      />

      {/* Subtle paper grain texture (SVG noise, very low opacity) */}
      <div
        className="absolute inset-0 skeuomorphic-grain"
        style={{
          opacity: 0.4,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          mixBlendMode: 'multiply',
        }}
      />

      {/* Soft warm vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, transparent 0%, transparent 55%, rgba(120, 100, 70, 0.10) 100%)',
        }}
      />

      {/* Gentle floating light orbs (cahaya) — soft illumination */}
      {LIGHT_ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute skeuomorphic-orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 65%)`,
            filter: 'blur(48px)',
            animation: `skeuomorphic-float-${i % 3} ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Subtle embossed grid lines (very faint, like pressed paper) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(120, 100, 70, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(120, 100, 70, 0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      {/* Top light bevel highlight — like light hitting a raised surface from above */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 252, 245, 0.5) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
