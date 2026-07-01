'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'cyan' | 'magenta' | 'purple' | 'none'
  showHUDBrackets?: boolean
  hover?: boolean
}

export function GlassCard({
  children,
  className,
  glowColor = 'none',
  showHUDBrackets = false,
  hover = true,
}: GlassCardProps) {
  const glowClass = {
    cyan: 'hover:shadow-[var(--glow-cyan)]',
    magenta: 'hover:shadow-[var(--glow-magenta)]',
    purple: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]',
    none: '',
  }[glowColor]

  return (
    <div
      className={cn(
        'relative rounded-xl glass p-6',
        showHUDBrackets && 'hud-bracket',
        glowColor === 'magenta' && showHUDBrackets && 'hud-bracket-magenta',
        hover && 'transition-all duration-300 hover:scale-[1.02]',
        glowClass,
        className
      )}
    >
      {children}
    </div>
  )
}