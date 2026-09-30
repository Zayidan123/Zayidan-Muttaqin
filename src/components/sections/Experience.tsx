'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguageStore } from '@/store/language-store'
import { experiences, formatDate } from '@/data/experiences'
import { ScrambleText } from '@/components/ui/ScrambleText'

export function Experience() {
  const { t, lang } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const parallaxRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  // Section-level gentle parallax
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-15, 15])

  // ---- SCROLL-DRIVEN TIMELINE: the neon spine draws itself in real time
  // as the visitor scrolls through the career history (not a one-shot).
  const { scrollYProgress: lineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 60%"],
  })
  const lineScale = useSpring(lineProgress, { stiffness: 90, damping: 24 })
  // A glowing "comet head" rides the tip of the line as it draws
  const headY = useTransform(lineProgress, [0, 1], ['0%', '100%'])
  const headOpacity = useTransform(lineProgress, [0, 0.02, 0.96, 1], [0, 1, 1, 0])

  const locale = lang === 'id' ? 'id-ID' : 'en-US'

  return (
    <section id="experience" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8" ref={parallaxRef}>
      <motion.div className="max-w-4xl mx-auto" style={{ y }} ref={ref}>
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 18, transformPerspective: 900 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0, transformPerspective: 900 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 holo-text">
            <ScrambleText text={t('experience.title')} />
          </h2>
          <div className="section-title-line" />
        </motion.div>

        {/* Timeline */}
        <div className="relative" ref={timelineRef}>
          {/* Timeline Line — continuously drawn by scroll progress */}
          <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-[var(--glass-border)]/40">
            <motion.div
              style={prefersReduced ? { height: '100%' } : { scaleY: lineScale, transformOrigin: 'top' }}
              className="absolute inset-0 bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--neon-magenta)] to-[var(--neon-purple)] opacity-60"
            />
            {/* Comet head — glowing energy tip riding the draw line */}
            {!prefersReduced && (
              <motion.div
                style={{ top: headY, opacity: headOpacity }}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
                aria-hidden="true"
              >
                <div className="absolute inset-0 rounded-full bg-[var(--neon-cyan)] blur-[6px]" />
                <div className="absolute -inset-2 rounded-full border border-[var(--neon-cyan)]/30 animate-pulse" />
              </motion.div>
            )}
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
                  initial={prefersReduced
                    ? { opacity: 0 }
                    : { opacity: 0, x: isLeft ? -46 : 46, rotateY: isLeft ? 14 : -14, transformPerspective: 900 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, transformPerspective: 900 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Node — breathing halo ring, forever alive */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10 mt-6">
                    <div className="relative w-3 h-3 rounded-full bg-[var(--neon-cyan)] shadow-[var(--glow-cyan)]">
                      <div className="absolute inset-0 rounded-full bg-[var(--neon-cyan)] animate-ping opacity-30" />
                      <div className="node-ring absolute inset-0 rounded-full" />
                    </div>
                  </div>

                  {/* Spacer for mobile */}
                  <div className="w-10 shrink-0 sm:hidden" />

                  {/* Card — koridor 3D (dinding lorong miring, lurus saat hover)
                      + sheen idle loop dari lapisan ambient */}
                  <div className={`flex-1 sm:w-[calc(50%-2rem)] corridor-${isLeft ? 'l' : 'r'} ${isLeft ? 'sm:pr-8' : 'sm:pl-8'}`}>
                    <div
                      className="corridor-card relative p-5 sm:p-6 rounded-xl glass glass-depth border border-[var(--glass-border)] glass-card-advanced holo-sheen sheen-loop group"
                    >
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

                      {/* Description — bullets cascade in one by one */}
                      <ul className="space-y-1.5 mb-4">
                        {description.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.4, delay: 0.25 + i * 0.1 }}
                            className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-start gap-2"
                          >
                            <span className="text-[var(--neon-cyan)] mt-1.5 shrink-0">▹</span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags[lang].map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono-custom text-[var(--text-secondary)] bg-[var(--glass-bg)] border border-[var(--glass-border)] transition-colors duration-300 group-hover:border-[var(--neon-cyan)]/20"
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
