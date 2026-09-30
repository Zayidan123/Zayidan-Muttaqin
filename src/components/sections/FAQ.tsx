'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguageStore } from '@/store/language-store'
import { ScrambleText } from '@/components/ui/ScrambleText'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqKeys = ['q0', 'q1', 'q2', 'q3', 'q4'] as const

export function FAQ() {
  const { t } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-15, 15])

  const toggle = (idx: number) => {
    setOpenIndex(prev => prev === idx ? null : idx)
  }

  return (
    <section id="faq" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8" ref={parallaxRef}>
      <motion.div className="max-w-3xl mx-auto" style={{ y }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 18, transformPerspective: 900 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0, transformPerspective: 900 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 holo-text">
            <ScrambleText text={t('faq.title')} />
          </h2>
          <div className="section-title-line mx-auto" />
          <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)]">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqKeys.map((key, idx) => {
            const isOpen = openIndex === idx
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 15, rotateX: 18, transformPerspective: 900 }}
                animate={inView ? { opacity: 1, y: 0, rotateX: 0, transformPerspective: 900 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
              >
                <div
                  className={`rounded-xl glass border holo-edge transition-all duration-300 ${
                    isOpen
                      ? 'border-[var(--neon-cyan)]/30 shadow-[0_0_20px_rgba(0,245,255,0.08)] soft-breathe'
                      : 'border-[var(--glass-border)] hover:border-[var(--glass-border)]/80'
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left group"
                    aria-expanded={isOpen}
                  >
                    <motion.span
                      animate={prefersReduced ? undefined : { rotate: isOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      className="shrink-0"
                    >
                      <HelpCircle className={`h-4 w-4 transition-colors duration-300 group-hover:text-[var(--neon-cyan)] ${isOpen ? 'text-[var(--neon-cyan)] icon-glow-pulse' : 'text-[var(--text-secondary)]'}`} />
                    </motion.span>
                    <span className={`flex-1 text-sm font-medium transition-colors duration-300 ${isOpen ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)]'}`}>
                      {t(`faq.${key}`)}
                    </span>
                    <motion.span
                      animate={prefersReduced ? undefined : { y: isOpen ? 0 : [0, -2, 0] }}
                      transition={isOpen ? { duration: 0.3 } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="shrink-0"
                    >
                      <ChevronDown
                        className={`h-4 w-4 text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, rotateX: -14 }}
                        animate={{ height: 'auto', opacity: 1, rotateX: 0 }}
                        exit={{ height: 0, opacity: 0, rotateX: -14 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformOrigin: 'top center', transformPerspective: 700 }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={prefersReduced ? undefined : { opacity: 0, y: -6 }}
                          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.12 }}
                          className="px-5 pb-4 pl-12"
                        >
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {t(`faq.a${key.slice(1)}`)}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}