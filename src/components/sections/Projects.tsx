'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink } from 'lucide-react'
import { useLanguageStore } from '@/store/language-store'
import { projects } from '@/data/projects'
import { ScrambleText } from '@/components/ui/ScrambleText'

export function Projects() {
  const { t, lang } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="projects" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            <ScrambleText text={t('projects.title')} />
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-3">{t('projects.subtitle')}</p>
          <div className="section-title-line" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, idx) => {
            const description = project.description[lang]
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.15 }}
                className="relative p-5 sm:p-6 rounded-xl glass border border-[var(--glass-border)] glass-card-advanced group flex flex-col"
              >
                <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[var(--neon-cyan)] opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-[var(--neon-magenta)] opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-[var(--neon-magenta)] opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[var(--neon-cyan)] opacity-60 group-hover:opacity-100 transition-opacity" />

                <h3 className="font-display text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4 flex-1">
                  {description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags[lang].map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-mono-custom text-[var(--text-secondary)] bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-auto">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-[var(--glass-border)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:shadow-[var(--glow-cyan)] transition-all duration-300"
                    aria-label={`${t('projects.viewRepo')} — ${project.title}`}
                  >
                    <Github className="h-3.5 w-3.5" />
                    {t('projects.viewRepo')}
                  </a>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-[var(--glass-border)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--neon-magenta)] hover:border-[var(--neon-magenta)]/30 hover:shadow-[var(--glow-magenta)] transition-all duration-300"
                      aria-label={`${t('projects.viewDemo')} — ${project.title}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t('projects.viewDemo')}
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
