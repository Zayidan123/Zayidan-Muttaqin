'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
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
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-15, 15])

  const toggle = (idx: number) => {
    setOpenIndex(prev => prev === idx ? null : idx)
  }

  return (
    <section id="faq" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8" ref={parallaxRef}>
      <motion.div className="max-w-3xl mx-auto" style={{ y }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
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
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
              >
                <div
                  className={`rounded-xl glass border transition-all duration-300 ${
                    isOpen
                      ? 'border-[var(--neon-cyan)]/30 shadow-[0_0_20px_rgba(0,245,255,0.08)]'
                      : 'border-[var(--glass-border)] hover:border-[var(--glass-border)]/80'
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <HelpCircle className={`h-4 w-4 shrink-0 transition-colors duration-300 ${isOpen ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-secondary)]'}`} />
                    <span className={`flex-1 text-sm font-medium transition-colors duration-300 ${isOpen ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-primary)]'}`}>
                      {t(`faq.${key}`)}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[var(--text-secondary)] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pl-12">
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {t(`faq.a${key.slice(1)}`)}
                          </p>
                        </div>
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