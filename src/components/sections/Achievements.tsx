'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-15, 15])

  return (
    <section id="achievements" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8" ref={parallaxRef}>
      <motion.div className="max-w-5xl mx-auto" style={{ y }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            <ScrambleText text={t('achievements.title')} />
          </h2>
          <div className="section-title-line mx-auto" />
          <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)]">
            {t('achievements.subtitle')}
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <span className="text-2xl font-display font-bold text-[var(--neon-cyan)]">6/6</span>
          <span className="text-sm font-mono-custom text-[var(--text-secondary)]">
            {t('achievements.unlocked')}
          </span>
        </motion.div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementKeys.map((key, idx) => {
            const Icon = icons[idx]!
            const color = neonColors[idx]!
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.08 }}
              >
                <TiltCard maxTilt={5}>
                  <div
                    className="relative p-5 rounded-xl glass border glass-card-advanced card-shine transition-all duration-300 group overflow-hidden"
                    style={{ borderColor: color + '22' }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = color + '44'
                      el.style.boxShadow = '0 0 20px ' + color + '22'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = color + '22'
                      el.style.boxShadow = 'none'
                    }}
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, ' + color + '66, transparent)' }} />

                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{ color: color, borderColor: color + '33', backgroundColor: color + '0D' }}
                      >
                        <Icon className="h-5 w-5" />
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
                      <span className="text-[8px] font-mono-custom px-1.5 py-0.5 rounded tracking-wider" style={{ color: color, backgroundColor: color + '15', border: '1px solid ' + color + '33' }}>
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