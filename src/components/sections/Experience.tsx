'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguageStore } from '@/store/language-store'
import { experiences, formatDate } from '@/data/experiences'
import { ScrambleText } from '@/components/ui/ScrambleText'
export function Experience() {
  const { t, lang } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [lineRef, lineInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const parallaxRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-15, 15])

  const locale = lang === 'id' ? 'id-ID' : 'en-US'

  return (
    <section id="experience" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8" ref={parallaxRef}>
      <motion.div className="max-w-4xl mx-auto" style={{ y }} ref={ref}>
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            <ScrambleText text={t('experience.title')} />
          </h2>
          <div className="section-title-line" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line — draws in on scroll */}
          <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 overflow-hidden" ref={lineRef}>
            <motion.div
              initial={{ height: 0 }}
              animate={lineInView ? { height: '100%' } : { height: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="w-full bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--neon-magenta)] to-[var(--neon-purple)] opacity-40"
            />
          </div>

          <div className="space-y-8 sm:space-y-12">
            {experiences.map((exp, idx) => {
              const isLeft = idx % 2 === 0
              const role = exp.role[lang]
              const company = exp.company[lang]
              const description = exp.description[lang]
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + idx * 0.15 }}
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10 mt-6">
                    <div className="w-3 h-3 rounded-full bg-[var(--neon-cyan)] shadow-[var(--glow-cyan)] relative">
                      <div className="absolute inset-0 rounded-full bg-[var(--neon-cyan)] animate-ping opacity-30" />
                    </div>
                  </div>

                  {/* Spacer for mobile */}
                  <div className="w-10 shrink-0 sm:hidden" />

                  {/* Card */}
                  <div className={`flex-1 sm:w-[calc(50%-2rem)] ${isLeft ? 'sm:pr-8' : 'sm:pl-8'}`}>
                    <div className="relative p-5 sm:p-6 rounded-xl glass border border-[var(--glass-border)] glass-card-advanced group">
                      {/* HUD Brackets */}
                      <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[var(--neon-cyan)] opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-[var(--neon-magenta)] opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-[var(--neon-magenta)] opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[var(--neon-cyan)] opacity-60 group-hover:opacity-100 transition-opacity" />

                      {/* Period */}
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono-custom text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/20 mb-3">
                        {formatDate(exp.period.start, t('experience.present'), locale)} – {formatDate(exp.period.end, t('experience.present'), locale)}
                      </span>

                      {/* Role */}
                      <h3 className="font-display text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-1">
                        {role}
                      </h3>

                      {/* Company */}
                      <p className="text-sm text-[var(--neon-magenta)] font-medium mb-3">
                        {company}
                      </p>

                      {/* Description */}
                      <ul className="space-y-1.5 mb-4">
                        {description.map((item, i) => (
                          <li key={i} className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-start gap-2">
                            <span className="text-[var(--neon-cyan)] mt-1.5 shrink-0">▹</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags[lang].map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono-custom text-[var(--text-secondary)] bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden sm:block flex-1 sm:w-[calc(50%-2rem)]" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </section>
  )
}