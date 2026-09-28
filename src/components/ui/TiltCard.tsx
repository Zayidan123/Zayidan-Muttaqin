'use client'

import { useRef, useCallback, type MouseEvent } from 'react'

/**
 * TiltCard — 3D perspective tilt with an optional cursor-tracked glare.
 *
 * On hover the card tilts in 3D space and two CSS custom properties
 * (`--mx` / `--my`, in %) are updated so child elements using the
 * `.tilt-glare` class render a light reflection that follows the cursor.
 * Fully backward compatible: children without `.tilt-glare` are unaffected.
 */
function TiltCard({
  children,
  className,
  maxTilt = 6,
  glare = false,
}: {
  children: React.ReactNode
  className?: string
  maxTilt?: number
  glare?: boolean
}) {
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
    // Cursor position in % — consumed by the .tilt-glare overlay
    el.style.setProperty('--mx', `${(x / rect.width) * 100}%`)
    el.style.setProperty('--my', `${(y / rect.height) * 100}%`)
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
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)' }}
      className={className}
    >
      {children}
      {glare && <div className="tilt-glare" aria-hidden="true" />}
    </div>
  )
}

export { TiltCard }
