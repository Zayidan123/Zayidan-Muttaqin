'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/lib/theme'
import { use3DLightSource } from '@/hooks/use3DLightSource'

function Cube3D({ className, variant = 'cyan', size = 40 }: { className?: string; variant?: 'cyan' | 'magenta' | 'purple'; size?: number }) {
  const half = size / 2
  return (
    <div className={`theme-3d-cube ${variant} ${className || ''}`} style={{ width: size, height: size }}>
      <div className="face face-front" style={{ width: size, height: size, transform: `translateZ(${half}px)` }} />
      <div className="face face-back" style={{ width: size, height: size, transform: `rotateY(180deg) translateZ(${half}px)` }} />
      <div className="face face-left" style={{ width: size, height: size, transform: `rotateY(-90deg) translateZ(${half}px)` }} />
      <div className="face face-right" style={{ width: size, height: size, transform: `rotateY(90deg) translateZ(${half}px)` }} />
      <div className="face face-top" style={{ width: size, height: size, transform: `rotateX(90deg) translateZ(${half}px)` }} />
      <div className="face face-bottom" style={{ width: size, height: size, transform: `rotateX(-90deg) translateZ(${half}px)` }} />
    </div>
  )
}

export function Theme3DBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  use3DLightSource()

  if (!mounted) return null

  const is3D = theme === 'theme-3d'

  if (!is3D) return null

  return (
    <div className="theme-3d-bg">
      {/* 3D Grid Floor */}
      <div className="theme-3d-grid" />

      {/* Floating 3D Cubes */}
      <div style={{ position: 'absolute', top: '10%', left: '8%', animation: 'float-3d 12s ease-in-out infinite', animationDelay: '0s' }}>
        <Cube3D variant="cyan" size={35} />
      </div>
      <div style={{ position: 'absolute', top: '25%', right: '12%', animation: 'float-3d 15s ease-in-out infinite', animationDelay: '-3s' }}>
        <Cube3D variant="magenta" size={25} />
      </div>
      <div style={{ position: 'absolute', top: '60%', left: '5%', animation: 'float-3d 18s ease-in-out infinite', animationDelay: '-6s' }}>
        <Cube3D variant="purple" size={30} />
      </div>
      <div style={{ position: 'absolute', bottom: '30%', right: '8%', animation: 'float-3d 14s ease-in-out infinite', animationDelay: '-2s' }}>
        <Cube3D variant="cyan" size={20} />
      </div>
      <div style={{ position: 'absolute', top: '45%', left: '15%', animation: 'float-3d 20s ease-in-out infinite', animationDelay: '-8s' }}>
        <Cube3D variant="magenta" size={18} />
      </div>
      <div style={{ position: 'absolute', bottom: '15%', right: '20%', animation: 'float-3d 16s ease-in-out infinite', animationDelay: '-5s' }}>
        <Cube3D variant="purple" size={22} />
      </div>

      {/* Wireframe Spheres */}
      <div className="theme-3d-sphere" style={{ top: '15%', right: '20%', width: 120, height: 120 }} />
      <div className="theme-3d-sphere" style={{ top: '55%', left: '10%', width: 80, height: 80, borderColor: 'var(--neon-magenta)', animationDelay: '-3s' }} />
      <div className="theme-3d-sphere" style={{ bottom: '20%', right: '30%', width: 100, height: 100, borderColor: 'var(--neon-purple)', animationDelay: '-5s' }} />

      {/* Orbiting Particles - Top Right */}
      <div className="theme-3d-orbit-container" style={{ top: '20%', right: '15%', width: 160, height: 160 }}>
        <div className="theme-3d-orbit-dot" style={{ top: '50%', left: '50%', marginTop: -2, marginLeft: -2 }} />
        <div className="theme-3d-orbit-dot" style={{ top: '50%', left: '50%', marginTop: -2, marginLeft: -2, animationDelay: '-4s', background: 'var(--neon-magenta)', boxShadow: '0 0 8px var(--neon-magenta), 0 0 16px rgba(255,45,170,0.3)' }} />
      </div>

      {/* Orbiting Particles - Center Left */}
      <div className="theme-3d-orbit-container" style={{ top: '40%', left: '5%', width: 120, height: 120, animationDirection: 'reverse' }}>
        <div className="theme-3d-orbit-dot" style={{ top: '50%', left: '50%', marginTop: -2, marginLeft: -2, animationDuration: '6s' }} />
      </div>

      {/* Orbiting Particles - Bottom */}
      <div className="theme-3d-orbit-container" style={{ bottom: '25%', right: '10%', width: 200, height: 200, animationDuration: '40s' }}>
        <div className="theme-3d-orbit-dot" style={{ top: '50%', left: '50%', marginTop: -2, marginLeft: -2, animationDuration: '10s', background: 'var(--neon-purple)', boxShadow: '0 0 8px var(--neon-purple), 0 0 16px rgba(167,139,250,0.3)' }} />
        <div className="theme-3d-orbit-dot" style={{ top: '50%', left: '50%', marginTop: -2, marginLeft: -2, animationDuration: '7s', animationDelay: '-3s' }} />
      </div>

      {/* Ambient Glow Orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,255,0.04), transparent 70%)', filter: 'blur(40px)', animation: 'float-3d 20s ease-in-out infinite', animationDelay: '-4s', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', right: '15%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,170,0.03), transparent 70%)', filter: 'blur(40px)', animation: 'float-3d 25s ease-in-out infinite', animationDelay: '-7s', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.03), transparent 70%)', filter: 'blur(40px)', animation: 'float-3d 22s ease-in-out infinite', animationDelay: '-10s', pointerEvents: 'none' }} />
    </div>
  )
}