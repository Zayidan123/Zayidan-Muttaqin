'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export function LightModeBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  if (isDark) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated gradient mesh base */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 800px 800px at 15% 25%, rgba(0, 128, 255, 0.06), transparent 70%),
          radial-gradient(ellipse 600px 600px at 85% 15%, rgba(204, 0, 136, 0.04), transparent 70%),
          radial-gradient(ellipse 500px 500px at 50% 85%, rgba(109, 40, 217, 0.04), transparent 70%),
          radial-gradient(ellipse 400px 400px at 70% 50%, rgba(0, 200, 150, 0.03), transparent 70%)
        `,
      }} />

      {/* Floating mesh orb 1 - large, slow */}
      <div
        className="absolute rounded-full"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 128, 255, 0.08) 0%, transparent 70%)',
          top: '-15%',
          right: '-10%',
          filter: 'blur(60px)',
          animation: 'mesh-float-1 30s ease-in-out infinite',
        }}
      />

      {/* Floating mesh orb 2 - medium */}
      <div
        className="absolute rounded-full"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(204, 0, 136, 0.06) 0%, transparent 70%)',
          bottom: '5%',
          left: '-8%',
          filter: 'blur(50px)',
          animation: 'mesh-float-2 25s ease-in-out infinite',
        }}
      />

      {/* Floating mesh orb 3 - small, accent */}
      <div
        className="absolute rounded-full"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(0, 200, 150, 0.05) 0%, transparent 70%)',
          top: '40%',
          right: '20%',
          filter: 'blur(45px)',
          animation: 'mesh-float-3 20s ease-in-out infinite',
        }}
      />

      {/* Subtle flowing grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 128, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 128, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'grid-flow 12s linear infinite',
        }}
      />

      {/* Floating geometric shapes scattered across page */}
      <div
        className="absolute hidden md:block"
        style={{
          top: '18%',
          left: '6%',
          width: '80px',
          height: '80px',
          border: '1.5px solid rgba(0, 128, 255, 0.06)',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          animation: 'float-geometric 18s ease-in-out infinite',
        }}
      />

      <div
        className="absolute hidden lg:block"
        style={{
          top: '45%',
          right: '8%',
          width: '60px',
          height: '60px',
          border: '1.5px solid rgba(204, 0, 136, 0.05)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          animation: 'float-geometric 15s ease-in-out infinite reverse',
        }}
      />

      <div
        className="absolute hidden md:block"
        style={{
          top: '70%',
          left: '15%',
          width: '50px',
          height: '50px',
          border: '1.5px solid rgba(109, 40, 217, 0.05)',
          transform: 'rotate(45deg)',
          animation: 'float-geometric 20s ease-in-out infinite',
          animationDelay: '-5s',
        }}
      />

      <div
        className="absolute hidden xl:block"
        style={{
          top: '25%',
          right: '30%',
          width: '100px',
          height: '100px',
          border: '1px solid rgba(0, 200, 150, 0.04)',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          animation: 'float-geometric 22s ease-in-out infinite',
          animationDelay: '-8s',
        }}
      />

      <div
        className="absolute hidden lg:block"
        style={{
          top: '85%',
          right: '25%',
          width: '70px',
          height: '70px',
          border: '1px solid rgba(0, 128, 255, 0.04)',
          borderRadius: '50%',
          animation: 'pulse-ring 6s ease-in-out infinite',
        }}
      />

      {/* Vertical data stream lines */}
      <div
        className="absolute hidden lg:block"
        style={{
          left: '10%',
          height: '200px',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, rgba(0, 128, 255, 0.08), transparent)',
          animation: 'data-stream 10s linear infinite',
        }}
      />
      <div
        className="absolute hidden lg:block"
        style={{
          left: '50%',
          height: '150px',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, rgba(204, 0, 136, 0.06), transparent)',
          animation: 'data-stream 12s linear infinite',
          animationDelay: '-3s',
        }}
      />
      <div
        className="absolute hidden lg:block"
        style={{
          right: '15%',
          height: '180px',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, rgba(109, 40, 217, 0.06), transparent)',
          animation: 'data-stream 9s linear infinite',
          animationDelay: '-6s',
        }}
      />
      <div
        className="absolute hidden xl:block"
        style={{
          left: '85%',
          height: '120px',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, rgba(0, 200, 150, 0.06), transparent)',
          animation: 'data-stream 14s linear infinite',
          animationDelay: '-2s',
        }}
      />
      <div
        className="absolute hidden xl:block"
        style={{
          left: '30%',
          height: '160px',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, rgba(0, 128, 255, 0.05), transparent)',
          animation: 'data-stream 11s linear infinite',
          animationDelay: '-8s',
        }}
      />

      {/* Orbit ring decorations */}
      <div
        className="absolute hidden xl:block"
        style={{
          top: '50%',
          left: '50%',
          width: '800px',
          height: '800px',
          marginTop: '-400px',
          marginLeft: '-400px',
          border: '1px solid rgba(0, 128, 255, 0.03)',
          borderRadius: '50%',
          animation: 'orbit-spin 90s linear infinite',
        }}
      />
      <div
        className="absolute hidden 2xl:block"
        style={{
          top: '50%',
          left: '50%',
          width: '1200px',
          height: '1200px',
          marginTop: '-600px',
          marginLeft: '-600px',
          border: '1px solid rgba(204, 0, 136, 0.02)',
          borderRadius: '50%',
          animation: 'orbit-spin 120s linear infinite reverse',
        }}
      />
    </div>
  )
}