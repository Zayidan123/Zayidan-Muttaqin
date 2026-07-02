'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/lib/theme'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  pulsePhase: number
  pulseSpeed: number
  baseOpacity: number
  trail: { x: number; y: number }[]
}

interface EnergyPulse {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  color: string
  speed: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)

  const initParticles = useCallback((w: number, h: number, isDark: boolean) => {
    const colors = isDark
      ? ['rgba(0,245,255,', 'rgba(255,0,170,', 'rgba(139,92,246,']
      : ['rgba(0,128,255,', 'rgba(204,0,136,', 'rgba(109,40,217,', 'rgba(0,200,150,']

    const count = isDark ? 60 : 90
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const baseOpacity = isDark
        ? Math.random() * 0.5 + 0.1
        : Math.random() * 0.4 + 0.2
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (isDark ? 0.3 : 0.6),
        vy: (Math.random() - 0.5) * (isDark ? 0.3 : 0.6),
        size: isDark ? Math.random() * 2 + 0.5 : Math.random() * 3 + 1,
        opacity: baseOpacity,
        baseOpacity,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        trail: [],
      })
    }
    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    const isDark = theme === 'dark'

    initParticles(w, h, isDark)

    let mouseX = -1000
    let mouseY = -1000
    const energyPulses: EnergyPulse[] = []

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top

      // Create energy pulse on mouse move (light mode only)
      if (!isDark && Math.random() > 0.85) {
        const colors = ['rgba(0,128,255,', 'rgba(204,0,136,', 'rgba(109,40,217,']
        energyPulses.push({
          x: mouseX,
          y: mouseY,
          radius: 0,
          maxRadius: 80 + Math.random() * 60,
          opacity: 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: 1.5 + Math.random() * 1,
        })
      }
    }
    canvas.addEventListener('mousemove', handleMouse)

    const handleMouseLeave = () => {
      mouseX = -1000
      mouseY = -1000
    }
    canvas.addEventListener('mouseleave', handleMouseLeave)

    let time = 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const animate = () => {
      time += 0.016
      const cw = canvas.offsetWidth
      const ch = canvas.offsetHeight

      ctx.clearRect(0, 0, cw, ch)

      const particles = particlesRef.current

      // === LIGHT MODE: Draw animated grid ===
      if (!isDark) {
        const gridSize = 60
        const offsetX = (time * 8) % gridSize
        const offsetY = (time * 5) % gridSize

        ctx.strokeStyle = 'rgba(0, 128, 255, 0.04)'
        ctx.lineWidth = 0.5

        for (let x = -gridSize + offsetX; x < cw + gridSize; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, ch)
          ctx.stroke()
        }
        for (let y = -gridSize + offsetY; y < ch + gridSize; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(cw, y)
          ctx.stroke()
        }

        // Draw pulsing grid intersection nodes
        ctx.fillStyle = 'rgba(0, 128, 255, 0.08)'
        for (let x = -gridSize + offsetX; x < cw + gridSize; x += gridSize) {
          for (let y = -gridSize + offsetY; y < ch + gridSize; y += gridSize) {
            const pulse = Math.sin(time * 2 + x * 0.01 + y * 0.01) * 0.5 + 0.5
            const nodeSize = 1 + pulse * 2
            ctx.beginPath()
            ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Update and draw particles
      for (const p of particles) {
        // Pulse opacity
        p.pulsePhase += p.pulseSpeed
        p.opacity = p.baseOpacity + Math.sin(p.pulsePhase) * (isDark ? 0.1 : 0.2)

        // Move
        p.x += p.vx
        p.y += p.vy

        // Bounce
        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > cw) { p.x = cw; p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > ch) { p.y = ch; p.vy *= -1 }

        // Mouse interaction - stronger in light mode
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const interactRadius = isDark ? 150 : 200
        if (dist < interactRadius && dist > 0) {
          const force = (interactRadius - dist) / interactRadius
          const pushForce = isDark ? 0.5 : 1.2
          p.x -= (dx / dist) * force * pushForce
          p.y -= (dy / dist) * force * pushForce
        }

        // Store trail positions (light mode only)
        if (!isDark) {
          p.trail.push({ x: p.x, y: p.y })
          if (p.trail.length > 6) p.trail.shift()

          // Draw trail
          if (p.trail.length > 1) {
            for (let i = 0; i < p.trail.length - 1; i++) {
              const trailAlpha = (i / p.trail.length) * 0.15
              ctx.beginPath()
              ctx.arc(p.trail[i].x, p.trail[i].y, p.size * 0.5, 0, Math.PI * 2)
              ctx.fillStyle = `${p.color}${trailAlpha})`
              ctx.fill()
            }
          }
        }

        // Draw particle glow (light mode)
        if (!isDark) {
          const glowSize = p.size * 3 + Math.sin(p.pulsePhase) * 2
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize)
          gradient.addColorStop(0, `${p.color}${p.opacity * 0.3})`)
          gradient.addColorStop(1, `${p.color}0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // Draw particle core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.opacity})`
        ctx.fill()
      }

      // Draw connections
      const connectionDist = isDark ? 120 : 160
      const connectionAlpha = isDark ? 0.15 : 0.2

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * connectionAlpha
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)

            if (isDark) {
              ctx.strokeStyle = `rgba(0,245,255,${alpha})`
            } else {
              // Gradient connection line in light mode
              const gradient = ctx.createLinearGradient(
                particles[i].x, particles[i].y,
                particles[j].x, particles[j].y
              )
              gradient.addColorStop(0, `${particles[i].color}${alpha})`)
              gradient.addColorStop(1, `${particles[j].color}${alpha})`)
              ctx.strokeStyle = gradient
            }
            ctx.lineWidth = isDark ? 0.5 : 0.8
            ctx.stroke()
          }
        }
      }

      // === LIGHT MODE: Draw energy pulses ===
      if (!isDark) {
        for (let i = energyPulses.length - 1; i >= 0; i--) {
          const pulse = energyPulses[i]
          pulse.radius += pulse.speed
          pulse.opacity = 0.5 * (1 - pulse.radius / pulse.maxRadius)

          if (pulse.opacity <= 0) {
            energyPulses.splice(i, 1)
            continue
          }

          ctx.beginPath()
          ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `${pulse.color}${pulse.opacity})`
          ctx.lineWidth = 1.5
          ctx.stroke()

          // Inner ring
          if (pulse.radius > 10) {
            ctx.beginPath()
            ctx.arc(pulse.x, pulse.y, pulse.radius * 0.6, 0, Math.PI * 2)
            ctx.strokeStyle = `${pulse.color}${pulse.opacity * 0.5})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // === LIGHT MODE: Draw floating hexagonal patterns ===
      if (!isDark) {
        const hexCount = 3
        for (let h = 0; h < hexCount; h++) {
          const cx = cw * (0.2 + h * 0.3) + Math.sin(time * 0.3 + h * 2) * 30
          const cy = ch * (0.3 + h * 0.2) + Math.cos(time * 0.25 + h * 1.5) * 25
          const hexSize = 30 + h * 10
          const rotation = time * (0.1 + h * 0.05)
          const hexAlpha = 0.03 + Math.sin(time + h) * 0.02

          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + rotation
            const hx = cx + hexSize * Math.cos(angle)
            const hy = cy + hexSize * Math.sin(angle)
            if (i === 0) ctx.moveTo(hx, hy)
            else ctx.lineTo(hx, hy)
          }
          ctx.closePath()
          ctx.strokeStyle = `rgba(0, 128, 255, ${hexAlpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // === LIGHT MODE: Data flow particles along connections ===
      if (!isDark) {
        const flowSpeed = time * 0.5
        for (let i = 0; i < particles.length; i += 4) {
          for (let j = i + 1; j < particles.length; j += 4) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < connectionDist && dist > 30) {
              const t = ((flowSpeed + i * 0.1 + j * 0.07) % 1)
              const fx = particles[i].x + (particles[j].x - particles[i].x) * t
              const fy = particles[i].y + (particles[j].y - particles[i].y) * t
              const flowAlpha = 0.4 * Math.sin(t * Math.PI)

              ctx.beginPath()
              ctx.arc(fx, fy, 1.5, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(0, 128, 255, ${flowAlpha})`
              ctx.fill()
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    if (!prefersReducedMotion) {
      animate()
    }

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [theme, initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      aria-hidden="true"
    />
  )
}