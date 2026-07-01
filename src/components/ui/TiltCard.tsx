'use client'

import { useRef, useCallback, type MouseEvent } from 'react'

function TiltCard({ children, className, maxTilt = 6 }: { children: React.ReactNode; className?: string; maxTilt?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }, [maxTilt])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </div>
  )
}

export { TiltCard }