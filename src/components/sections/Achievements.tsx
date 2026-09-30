'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguageStore } from '@/store/language-store'
import { ScrambleText } from '@/components/ui/ScrambleText'
import { TiltCard } from '@/components/ui/TiltCard'
import { Trophy, Zap, Users, Star, Target, BrainCircuit } from 'lucide-react'

const achievementKeys = ['firstSale', 'hundredClients', 'topPerformer', 'teamLeader', 'negotiator', 'quickLearner'] as const
const icons = [Trophy, Users, Star, Zap, Target, BrainCircuit]
const neonColors = ['#00f0ff', '#ff00aa', '#8b5cf6', '#00f0ff', '#ff00aa', '#8b5cf6']

export function Achievements() {
  const { t } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const parallaxRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] })
  // Trophies drift upward slightly faster than the page — feels weightless
  const y = useTransform(scrollYProgress, [0, 1], [-24, 24])

  return (
    <section id="achievements" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8" ref={parallaxRef}>
      <motion.div className="max-w-5xl mx-auto" style={{ y }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 18, transformPerspective: 900 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0, transformPerspective: 900 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 holo-text">
            <ScrambleText text={t('achievements.title')} />
          </h2>
          <div className="section-title-line mx-auto" />
          <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)]">
            {t('achievements.subtitle')}
          </p>
        </motion.div>

        {/* Progress — bar fills up with a shimmering energy sweep */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center justify-center gap-3 mb-10"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-display font-bold text-[var(--neon-cyan)] soft-breathe">6/6</span>
            <span className="text-sm font-mono-custom text-[var(--text-secondary)]">
              {t('achievements.unlocked')}
            </span>
          </div>
          {/* XP-style progress bar */}
          <div className="w-56 sm:w-72 h-2 rounded-full overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-bg)]/60 relative">
            <motion.div
              initial={{ width: '0%' }}
              animate={inView ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full relative skill-flow-fill"
              style={{ boxShadow: '0 0 12px rgba(0, 245, 255, 0.45)' }}
            />
          </div>
        </motion.div>

        {/* Achievement Grid — sequential springy "unlocks" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementKeys.map((key, idx) => {
            const Icon = icons[idx]!
            const color = neonColors[idx]!
            return (
              <motion.div
                key={key}
                initial={prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 36, scale: 0.7, rotate: idx % 2 === 0 ? -4 : 4, transformPerspective: 900 }}
                whileInView={prefersReduced
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1, rotate: 0, transformPerspective: 900 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 15,
                  delay: 0.15 + idx * 0.12,
                }}
              >
                <TiltCard maxTilt={5}>
                  <div
                    className="relative p-5 rounded-xl glass glass-depth border holo-sheen sheen-loop glass-card-advanced card-shine transition-all duration-300 group overflow-hidden"
                    style={{ borderColor: color + '22' }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = color + '44'
                      el.style.boxShadow = '0 0 20px ' + color + '22'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = color + '22'
                      el.style.removeProperty('box-shadow')
                    }}
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, ' + color + '66, transparent)' }} />

                    <div className="flex items-start gap-4">
                      {/* Koin holografik 3D — berayun idle, berputar penuh saat hover */}
                      <div className="ach-3d shrink-0 float-3d" style={{ animationDelay: `${idx * 0.9}s` }}>
                        <div className="coin-cradle">
                          <div className="holo-coin">
                            <div
                              className="holo-coin-face"
                              style={{
                                color: color,
                                borderColor: color + '55',
                                boxShadow:
                                  'inset 0 0 0 3px ' + color + '14, 0 10px 26px -10px rgba(0,0,0,0.5), 0 0 18px ' + color + '26',
                              }}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-display font-bold text-[var(--text-primary)] mb-1">
                          {t(`achievements.items.${key}.title`)}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {t(`achievements.items.${key}.desc`)}
                        </p>
                      </div>
                    </div>

                    {/* Unlocked badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[8px] font-mono-custom px-1.5 py-0.5 rounded tracking-wider soft-breathe" style={{ color: color, backgroundColor: color + '15', border: '1px solid ' + color + '33', animationDelay: `${idx * 0.4}s` }}>
                        {t('achievements.unlockedBadge')}
                      </span>
                    </div>
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
