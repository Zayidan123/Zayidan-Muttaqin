'use client'

/**
 * MotionKit — Reusable animation primitives powering the site-wide
 * motion system. Covers both SCROLL-DRIVEN effects (reveal, parallax,
 * scroll-linked rotation) and IDLE/AMBIENT loops (float, breathe, drift).
 *
 * All components respect `prefers-reduced-motion` via framer-motion's
 * `useReducedMotion` where loops are involved.
 */

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionProps,
} from 'framer-motion'
import { useRef, type ReactNode, type CSSProperties } from 'react'

/* ============================================================
 * 1. Reveal — scroll-triggered entrance with direction variants
 * ============================================================ */

type RevealVariant =
  | 'up' | 'down' | 'left' | 'right'
  | 'scale' | 'blur' | 'flip3d' | 'flip3dLeft' | 'flip3dRight' | 'fade'

const revealVariantsMap: Record<RevealVariant, { from: any; to: any }> = {
  up:       { from: { opacity: 0, y: 40 },                    to: { opacity: 1, y: 0 } },
  down:     { from: { opacity: 0, y: -40 },                   to: { opacity: 1, y: 0 } },
  left:     { from: { opacity: 0, x: -50 },                   to: { opacity: 1, x: 0 } },
  right:    { from: { opacity: 0, x: 50 },                    to: { opacity: 1, x: 0 } },
  scale:    { from: { opacity: 0, scale: 0.85 },              to: { opacity: 1, scale: 1 } },
  blur:     { from: { opacity: 0, y: 20, filter: 'blur(8px)' }, to: { opacity: 1, y: 0, filter: 'blur(0px)' } },
  flip3d:   { from: { opacity: 0, y: 40, rotateX: 28, transformPerspective: 900 }, to: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 900 } },
  flip3dLeft:  { from: { opacity: 0, x: -40, rotateY: 22, transformPerspective: 900 }, to: { opacity: 1, x: 0, rotateY: 0, transformPerspective: 900 } },
  flip3dRight: { from: { opacity: 0, x: 40, rotateY: -22, transformPerspective: 900 }, to: { opacity: 1, x: 0, rotateY: 0, transformPerspective: 900 } },
  fade:     { from: { opacity: 0 },                           to: { opacity: 1 } },
}

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.7,
  className,
  style,
  once = true,
  amount = 0.25,
  ...rest
}: {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
  once?: boolean
  amount?: number
} & MotionProps) {
  const prefersReduced = useReducedMotion()
  const v = revealVariantsMap[variant]!
  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : v.from}
      whileInView={prefersReduced ? { opacity: 1 } : v.to}
      viewport={{ once, amount }}
      transition={{ duration: prefersReduced ? 0.3 : duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* ============================================================
 * 2. Stagger / StaggerItem — sequenced scroll reveals
 * ============================================================ */

export function Stagger({
  children,
  className,
  style,
  gap = 0.09,
  delay = 0,
  once = true,
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  gap?: number
  delay?: number
  once?: boolean
  amount?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  style,
  variant = 'up',
  duration = 0.6,
  ...rest
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  variant?: 'up' | 'scale' | 'flip3d' | 'left' | 'right'
  duration?: number
} & MotionProps) {
  const itemVariants: Record<string, any> = {
    up:     { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0 } },
    scale:  { hidden: { opacity: 0, scale: 0.82 }, show: { opacity: 1, scale: 1 } },
    flip3d: { hidden: { opacity: 0, y: 30, rotateX: 24, transformPerspective: 900 }, show: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 900 } },
    left:   { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
    right:  { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
  }
  return (
    <motion.div
      variants={itemVariants[variant]}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* ============================================================
 * 3. Parallax — scroll-linked depth movement
 * ============================================================ */

export function Parallax({
  children,
  speed = 0.2,
  className,
  style,
  rotate = 0,
  scaleRange,
}: {
  children: ReactNode
  /** Negative = moves opposite to scroll (slower), positive = faster */
  speed?: number
  className?: string
  style?: CSSProperties
  /** Optional extra rotation across the scroll range, in degrees */
  rotate?: number
  /** Optional [from, to] scale across the scroll range */
  scaleRange?: [number, number]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100])
  const r = useTransform(scrollYProgress, [0, 1], [rotate / 2, -rotate / 2])
  const s = useTransform(scrollYProgress, [0, 0.5, 1], [scaleRange?.[0] ?? 1, 1, scaleRange?.[1] ?? 1])

  return (
    <motion.div
      ref={ref}
      style={prefersReduced ? style : { ...style, y, rotate: r, scale: s }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ============================================================
 * 4. Float — idle ambient floating loop (when NOT scrolling)
 * ============================================================ */

export function Float({
  children,
  className,
  style,
  amplitude = 10,
  duration = 5,
  delay = 0,
  rotate = 0,
  sway = false,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Vertical travel in px */
  amplitude?: number
  /** Seconds per full cycle */
  duration?: number
  delay?: number
  /** Subtle rotation sway in degrees */
  rotate?: number
  /** Adds a horizontal sway component */
  sway?: boolean
}) {
  const prefersReduced = useReducedMotion()
  if (prefersReduced) return <div className={className} style={style}>{children}</div>

  const anim: any = { y: [0, -amplitude, 0, amplitude, 0] }
  if (sway) anim.x = [0, amplitude * 0.4, 0, -amplitude * 0.4, 0]
  if (rotate) anim.rotate = [0, rotate, 0, -rotate, 0]

  return (
    <motion.div
      animate={anim}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/* ============================================================
 * 5. GlowPulse — breathing glow halo (idle)
 * ============================================================ */

export function GlowPulse({
  children,
  className,
  style,
  color = 'var(--neon-cyan)',
  intensity = 0.35,
  duration = 3.5,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  color?: string
  intensity?: number
  duration?: number
  delay?: number
}) {
  const prefersReduced = useReducedMotion()
  if (prefersReduced) return <div className={className} style={style}>{children}</div>

  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 12px ${color}00`,
          `0 0 26px ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`,
          `0 0 12px ${color}00`,
        ],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
      style={{ borderRadius: 'inherit', ...style }}
    >
      {children}
    </motion.div>
  )
}

/* ============================================================
 * 6. ScrollRotate — continuous rotation driven by scroll position
 * ============================================================ */

export function ScrollRotate({
  children,
  className,
  style,
  from = -8,
  to = 8,
  axis = 'rotateX',
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  from?: number
  to?: number
  axis?: 'rotateX' | 'rotateY' | 'rotate'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const transform = useTransform(scrollYProgress, [0, 1], [from, to])
  const transformStyle = { [axis]: transform, transformPerspective: 1000 }

  return (
    <motion.div
      ref={ref}
      style={prefersReduced ? style : { ...style, ...transformStyle }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ============================================================
 * 7. Marquee — infinite horizontal ticker (idle motion)
 * ============================================================ */

export function Marquee({
  children,
  className,
  style,
  duration = 26,
  reverse = false,
  gap = '3rem',
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  duration?: number
  reverse?: boolean
  gap?: string
}) {
  const prefersReduced = useReducedMotion()
  const track = (
    <div className="flex items-center shrink-0" style={{ gap }}>
      {children}
    </div>
  )
  return (
    <div
      className={`flex overflow-hidden ${className ?? ''}`}
      style={{ maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)', ...style }}
    >
      {prefersReduced ? (
        <div className="flex" style={{ gap }}>{children}</div>
      ) : (
        <>
          <motion.div
            className="flex shrink-0"
            animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
            transition={{ duration, repeat: Infinity, ease: 'linear' }}
            style={{ gap, display: 'flex', paddingRight: gap }}
          >
            {children}{children}
          </motion.div>
        </>
      )}
    </div>
  )
}

/* ============================================================
 * 8. Magnetic — element gently follows the cursor on hover
 * ============================================================ */

export function Magnetic({
  children,
  className,
  style,
  strength = 0.3,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  strength?: number
}) {
  const prefersReduced = useReducedMotion()
  if (prefersReduced) return <div className={className} style={style}>{children}</div>

  return (
    <motion.div
      className={className}
      style={{ display: 'inline-block', ...style }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      onMouseMove={(e) => {
        const el = e.currentTarget as HTMLElement
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) * strength
        const y = (e.clientY - rect.top - rect.height / 2) * strength
        el.style.transform = `translate(${x}px, ${y}px) scale(1.04)`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(0px, 0px) scale(1)'
      }}
    >
      {children}
    </motion.div>
  )
}

/* ============================================================
 * 9. WordsReveal — word-by-word scroll reveal for paragraphs
 * ============================================================ */

export function WordsReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.03,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
}) {
  const prefersReduced = useReducedMotion()
  const words = text.split(' ')
  if (prefersReduced) return <p className={className}>{text}</p>

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={wordClassName}
          style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
          variants={{
            hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}{'\u00A0'}
        </motion.span>
      ))}
    </motion.p>
  )
}

/* ============================================================
 * 10. ScrollFloatGroup — children drift at different scroll
 *     speeds creating a parallax depth field
 * ============================================================ */

export function ScrollFloatGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}
