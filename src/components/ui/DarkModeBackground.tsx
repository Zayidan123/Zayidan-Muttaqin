'use client'

import { useTheme } from '@/lib/theme'
import { useState, useEffect } from 'react'

export function DarkModeBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  if (!isDark) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top-to-bottom gradient flow */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg,
          rgba(0,245,255,0.03) 0%, transparent 20%,
          transparent 40%, rgba(255,0,170,0.02) 60%,
          transparent 80%, rgba(139,92,246,0.03) 100%)`,
      }} />

      {/* Floating orbs */}
      <div className="absolute rounded-full" style={{ width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0,245,255,0.07) 0%, transparent 70%)', top: '-20%', left: '-15%', filter: 'blur(80px)', animation: 'dm-orb-1 35s ease-in-out infinite' }} />
      <div className="absolute rounded-full" style={{ width: '550px', height: '550px', background: 'radial-gradient(circle, rgba(255,0,170,0.06) 0%, transparent 70%)', top: '30%', right: '-12%', filter: 'blur(70px)', animation: 'dm-orb-2 28s ease-in-out infinite' }} />
      <div className="absolute rounded-full" style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', bottom: '-20%', left: '20%', filter: 'blur(75px)', animation: 'dm-orb-3 32s ease-in-out infinite' }} />
      <div className="absolute rounded-full" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 70%)', top: '55%', left: '10%', filter: 'blur(50px)', animation: 'dm-orb-4 22s ease-in-out infinite' }} />

      {/* Data stream lines */}
      {[8, 25, 42, 60, 78, 92].map((left, i) => (
        <div key={i} className="absolute hidden md:block" style={{
          left: `${left}%`, top: '-20%', height: '140%', width: '1px',
          background: `linear-gradient(to bottom, transparent, rgba(0,245,255,${0.12 - i * 0.015}), transparent 40%, transparent 60%, rgba(255,0,170,${0.08 - i * 0.01}), transparent)`,
          animation: `dm-stream ${14 + i * 2}s linear infinite`,
          animationDelay: `${-i * 3}s`,
        }} />
      ))}

      {/* Subtle grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,245,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.3))',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.3))',
      }} />

      {/* Geometric shapes */}
      <div className="absolute hidden md:block" style={{ top: '12%', left: '5%', width: '70px', height: '70px', border: '1px solid rgba(0,245,255,0.06)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animation: 'dm-geo-float 20s ease-in-out infinite' }} />
      <div className="absolute hidden lg:block" style={{ top: '35%', right: '7%', width: '50px', height: '50px', border: '1px solid rgba(255,0,170,0.05)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', animation: 'dm-geo-float 16s ease-in-out infinite reverse' }} />
      <div className="absolute hidden md:block" style={{ top: '60%', left: '12%', width: '40px', height: '40px', border: '1px solid rgba(139,92,246,0.05)', transform: 'rotate(45deg)', animation: 'dm-geo-float 22s ease-in-out infinite', animationDelay: '-6s' }} />

      {/* Scanlines */}
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }} />

      {/* Flow sweep */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,245,255,0.02) 50%, transparent 100%)', backgroundSize: '100% 200%', animation: 'dm-flow-sweep 12s ease-in-out infinite' }} />

      {/* Orbit rings */}
      <div className="absolute hidden xl:block" style={{ top: '50%', left: '50%', width: '900px', height: '900px', marginTop: '-450px', marginLeft: '-450px', border: '1px solid rgba(0,245,255,0.02)', borderRadius: '50%', animation: 'dm-orbit 80s linear infinite' }} />
    </div>
  )
}