'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface HUDBracketProps {
  children: ReactNode
  className?: string
  color?: 'cyan' | 'magenta' | 'purple'
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: '[&::before]:w-3 [&::before]:h-3 [&::after]:w-3 [&::after]:h-3',
  md: '[&::before]:w-4 [&::before]:h-4 [&::after]:w-4 [&::after]:h-4',
  lg: '[&::before]:w-6 [&::before]:h-6 [&::after]:w-6 [&::after]:h-6',
}

export function HUDBracket({ children, className, color = 'cyan', size = 'md' }: HUDBracketProps) {
  const colorVar = {
    cyan: 'var(--neon-cyan)',
    magenta: 'var(--neon-magenta)',
    purple: 'var(--neon-purple)',
  }[color]

  return (
    <div className={cn('relative', sizeClasses[size], className)} style={{
      '--bracket-color': colorVar,
    } as React.CSSProperties}>
      <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 pointer-events-none z-10"
        style={{ borderColor: colorVar }} />
      <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 pointer-events-none z-10"
        style={{ borderColor: colorVar }} />
      <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 pointer-events-none z-10"
        style={{ borderColor: colorVar }} />
      <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 pointer-events-none z-10"
        style={{ borderColor: colorVar }} />
      {children}
    </div>
  )
}