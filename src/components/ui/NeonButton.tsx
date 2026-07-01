'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface NeonButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  download?: boolean
}

export function NeonButton({
  children,
  variant = 'primary',
  href,
  onClick,
  className,
  type = 'button',
  disabled = false,
  download = false,
}: NeonButtonProps) {
  const baseClasses = 'ripple-effect relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-display text-sm tracking-wider uppercase transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dark-base)] disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: cn(
      'border border-[var(--neon-cyan)] text-[var(--neon-cyan)]',
      'hover:shadow-[var(--glow-cyan)] hover:bg-[var(--neon-cyan)] hover:text-[var(--dark-base)]',
      'bg-transparent'
    ),
    secondary: cn(
      'border border-[var(--neon-magenta)] text-[var(--neon-magenta)]',
      'hover:shadow-[var(--glow-magenta)] hover:bg-[var(--neon-magenta)] hover:text-white',
      'bg-transparent'
    ),
    ghost: cn(
      'border-transparent text-[var(--neon-cyan)]',
      'hover:text-[var(--neon-magenta)]',
      'bg-transparent'
    ),
  }

  const classes = cn(baseClasses, variantClasses[variant], className)

  if (href) {
    return (
      <a href={href} download={download || undefined} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  )
}