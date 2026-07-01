'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguageStore } from '@/store/language-store'
import { Briefcase, Cpu, Users, HeartHandshake } from 'lucide-react'
import { TiltCard } from '@/components/ui/TiltCard'
import { ScrambleText } from '@/components/ui/ScrambleText'

const statItems = [
  { icon: Briefcase, valueKey: 'stats.experience.value', labelKey: 'stats.experience.label', numericValue: 3, suffix: '+', color: 'cyan' as const },
  { icon: Cpu, valueKey: 'stats.hardSkills.value', labelKey: 'stats.hardSkills.label', numericValue: 7, suffix: '', color: 'magenta' as const },
  { icon: HeartHandshake, valueKey: 'stats.softSkills.value', labelKey: 'stats.softSkills.label', numericValue: 11, suffix: '', color: 'purple' as const },
  { icon: Users, valueKey: 'stats.clients.value', labelKey: 'stats.clients.label', numericValue: 100, suffix: '+', color: 'cyan' as const },
]

const colorMap = {
  cyan: {
    icon: 'text-[var(--neon-cyan)]',
    glow: 'shadow-[var(--glow-cyan)]',
    border: 'border-[var(--neon-cyan)]/20',
    accent: 'bg-[var(--neon-cyan)]',
  },
  magenta: {
    icon: 'text-[var(--neon-magenta)]',
    glow: 'shadow-[var(--glow-magenta)]',
    border: 'border-[var(--neon-magenta)]/20',
    accent: 'bg-[var(--neon-magenta)]',
  },
  purple: {
    icon: 'text-[var(--neon-purple)]',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
    border: 'border-[var(--neon-purple)]/20',
    accent: 'bg-[var(--neon-purple)]',
  },
}

function AnimatedCounter({ target, suffix, inView, duration = 2000 }: { target: number; suffix: string; inView: boolean; duration?: number }) {
  const [count, setCount] = useState(0)

  const animate = useCallback(() => {
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [target, duration])

  useEffect(() => {
    if (inView) {
      animate()
    }
  }, [inView, animate])

  return (
    <span className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums">
      {count}{suffix}
    </span>
  )
}

export function Stats() {
  const { t } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const parallaxRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-15, 15])

  return (
    <section id="stats" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8" ref={parallaxRef}>
      <motion.div className="max-w-6xl mx-auto" style={{ y }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            <ScrambleText text={t('stats.title')} />
          </h2>
          <div className="section-title-line mx-auto" />
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statItems.map((item, idx) => {
            const Icon = item.icon
            const colors = colorMap[item.color]
            return (
              <motion.div
                key={item.valueKey}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <TiltCard className="transition-[box-shadow_0.3s]" maxTilt={6}>
                <div className={`relative p-5 sm:p-6 rounded-xl glass border ${colors.border} glass-hover-glow glass-noise transition-[box-shadow_0.3s]`}>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colors.border} bg-[var(--glass-bg)]`}>
                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <div className="text-[var(--text-primary)]">
                      <AnimatedCounter
                        target={item.numericValue}
                        suffix={item.suffix}
                        inView={inView}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono-custom text-[var(--text-secondary)] tracking-wider uppercase">
                      {t(item.labelKey)}
                    </span>
                  </div>
                  {/* Neon accent dot */}
                  <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${colors.accent} ${colors.glow} opacity-60`} />
                </div>
                </TiltCard>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}