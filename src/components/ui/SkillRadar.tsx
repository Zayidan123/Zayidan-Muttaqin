'use client'

import { useEffect, useRef } from 'react'
import { useLanguageStore } from '@/store/language-store'
import { useInView } from 'react-intersection-observer'

interface SkillRadarProps {
  skills: { name: string; value: number; color: string }[]
  className?: string
}

export function SkillRadar({ skills, className = '' }: SkillRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 280
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const maxR = size / 2 - 40
    const n = skills.length
    const angleStep = (Math.PI * 2) / n
    const startAngle = -Math.PI / 2

    let progress = 0
    const duration = 60 // frames
    let frame = 0
    let animId: number

    const draw = () => {
      frame++
      progress = inView ? Math.min(frame / duration, 1) : 0
      const ease = 1 - Math.pow(1 - progress, 3) // easeOutCubic

      ctx.clearRect(0, 0, size, size)

      // Grid rings
      for (let ring = 1; ring <= 4; ring++) {
        const r = (maxR / 4) * ring
        ctx.beginPath()
        for (let i = 0; i <= n; i++) {
          const angle = startAngle + angleStep * i
          const x = cx + Math.cos(angle) * r
          const y = cy + Math.sin(angle) * r
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Axis lines
      for (let i = 0; i < n; i++) {
        const angle = startAngle + angleStep * i
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR)
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Data polygon
      ctx.beginPath()
      for (let i = 0; i <= n; i++) {
        const idx = i % n
        const angle = startAngle + angleStep * idx
        const r = (skills[idx].value / 100) * maxR * ease
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()

      // Fill gradient
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR)
      gradient.addColorStop(0, 'rgba(0, 245, 255, 0.15)')
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)')
      gradient.addColorStop(1, 'rgba(255, 0, 170, 0.08)')
      ctx.fillStyle = gradient
      ctx.fill()

      // Stroke
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.6)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Data points + labels
      for (let i = 0; i < n; i++) {
        const angle = startAngle + angleStep * i
        const r = (skills[i].value / 100) * maxR * ease
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r

        // Glow point
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = skills[i].color
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.fillStyle = skills[i].color + '33'
        ctx.fill()

        // Label
        const labelR = maxR + 22
        const lx = cx + Math.cos(angle) * labelR
        const ly = cy + Math.sin(angle) * labelR
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(skills[i].name, lx, ly)
      }

      if (progress < 1) {
        animId = requestAnimationFrame(draw)
      }
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [inView, skills])

  return (
    <div ref={ref} className={`flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  )
}