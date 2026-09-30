'use client'

import { useState, type MouseEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink, RotateCw, Undo2, Layers } from 'lucide-react'
import { useLanguageStore } from '@/store/language-store'
import { projects, type ProjectEntry } from '@/data/projects'
import { ScrambleText } from '@/components/ui/ScrambleText'

/* ===== Full-3D Holographic Flip Card =====
   Front: ringkasan + stack utama. Back: deskripsi penuh + tautan.
   - Desktop : hover otomatis membalik kartu (rotateY 180°)
   - Touch   : ketuk kartu untuk membalik
   - Keyboard: fokus ke tautan di sisi belakang ikut membalik (focus-within)
   - Teks penuh tetap ada di DOM → SEO tetap utuh */
function ProjectFlipCard({
  project,
  idx,
  inView,
  t,
  lang,
}: {
  project: ProjectEntry
  idx: number
  inView: boolean
  t: (k: string) => string
  lang: 'id' | 'en'
}) {
  const [flipped, setFlipped] = useState(false)
  const prefersReduced = useReducedMotion()
  const isLeft = idx % 2 === 0

  const description = project.description[lang]
  const summary =
    description.length > 165 ? `${description.slice(0, 165).trimEnd()}…` : description
  const allTags = project.tags[lang]
  const shownTags = allTags.slice(0, 6)
  const moreCount = allTags.length - shownTags.length

  const handleFlip = (e: MouseEvent<HTMLDivElement>) => {
    // Jangan balik kartu jika pengguna sedang memilih teks
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) return
    // Klik pada tautan di sisi belakang tidak boleh menutup kartu
    if ((e.target as HTMLElement).closest('a')) return
    setFlipped((f) => !f)
  }

  return (
    <motion.div
      initial={prefersReduced
        ? { opacity: 0 }
        : { opacity: 0, y: 40, rotateY: isLeft ? -18 : 18, rotateX: 14, transformPerspective: 1100 }}
      animate={inView
        ? (prefersReduced
            ? { opacity: 1 }
            : { opacity: 1, y: 0, rotateY: 0, rotateX: 0, transformPerspective: 1100 })
        : {}}
      transition={{ duration: 0.8, delay: 0.15 + idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div
        className={`flip-3d h-full cursor-pointer select-none ${flipped ? 'flipped' : ''}`}
        onClick={handleFlip}
        role="button"
        aria-pressed={flipped}
        aria-label={`${project.title} — ${flipped ? t('projects.flipBack') : t('projects.flip')}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if ((e.target as HTMLElement).closest('a,button')) return
            e.preventDefault()
            setFlipped((f) => !f)
          }
        }}
      >
        <div className="flip-3d-inner">
          {/* ===== FRONT — ringkasan ===== */}
          <div className="flip-3d-face flip-3d-front relative rounded-xl p-5 sm:p-6 glass-depth holo-sheen sheen-loop group flex flex-col h-full">
            {/* Holographic project index watermark */}
            <span
              className="absolute top-3 right-4 font-display text-4xl font-bold text-[var(--text-primary)] opacity-[0.05] select-none pointer-events-none z-[5]"
              aria-hidden="true"
            >
              {String(idx + 1).padStart(2, '0')}
            </span>
            {/* HUD Brackets */}
            <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[var(--neon-cyan)] opacity-60 group-hover:opacity-100 transition-opacity z-[6]" />
            <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-[var(--neon-magenta)] opacity-60 group-hover:opacity-100 transition-opacity z-[6]" />
            <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-[var(--neon-magenta)] opacity-60 group-hover:opacity-100 transition-opacity z-[6]" />
            <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[var(--neon-cyan)] opacity-60 group-hover:opacity-100 transition-opacity z-[6]" />

            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4 text-[var(--neon-cyan)] shrink-0" />
              <h3 className="font-display text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                {project.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4 flex-1">
              {summary}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {shownTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono-custom text-[var(--text-secondary)] bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                >
                  {tag}
                </span>
              ))}
              {moreCount > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-custom text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30">
                  +{moreCount}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--glass-border)]">
              <span className="text-[10px] font-mono-custom text-[var(--text-secondary)]/70 tracking-wide">
                {t('projects.tapHint')}
              </span>
              <span className="flip-hint inline-flex items-center gap-1.5 text-[10px] font-mono-custom text-[var(--neon-cyan)]">
                <RotateCw className="h-3 w-3" />
                {t('projects.flip')}
              </span>
            </div>
          </div>

          {/* ===== BACK — detail penuh ===== */}
          <div className="flip-3d-face flip-3d-back flip-3d-backface rounded-xl p-5 sm:p-6 glass-depth flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono-custom text-[var(--neon-magenta)] tracking-[0.2em] uppercase">
                {t('projects.stackLabel')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono-custom text-[var(--text-secondary)]/70">
                <Undo2 className="h-3 w-3" />
                {t('projects.flipBack')}
              </span>
            </div>

            <h3 className="font-display text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-3">
              {project.title}
            </h3>

            {/* Tautan aksi di atas — langsung terlihat saat kartu dibalik */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <motion.a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={prefersReduced ? undefined : { scale: 1.05, y: -2 }}
                whileTap={prefersReduced ? undefined : { scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 17 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-[var(--glass-border)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:shadow-[var(--glow-cyan)] transition-all duration-300"
                aria-label={`${t('projects.viewRepo')} — ${project.title}`}
              >
                <Github className="h-3.5 w-3.5" />
                {t('projects.viewRepo')}
              </motion.a>
              {project.demoUrl && (
                <motion.a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={prefersReduced ? undefined : { scale: 1.05, y: -2 }}
                  whileTap={prefersReduced ? undefined : { scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 17 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-[var(--glass-border)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--neon-magenta)] hover:border-[var(--neon-magenta)]/30 hover:shadow-[var(--glow-magenta)] transition-all duration-300"
                  aria-label={`${t('projects.viewDemo')} — ${project.title}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t('projects.viewDemo')}
                </motion.a>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4 flex-1">
              {description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-[var(--glass-border)]">
              {allTags.map((tag) => (
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

        {/* Bayangan lantai 3D */}
        <div className="flip-3d-shadow" aria-hidden="true" />
      </div>
    </motion.div>
  )
}

export function Projects() {
  const { t, lang } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="projects" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 18, transformPerspective: 900 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0, transformPerspective: 900 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 holo-text">
            <ScrambleText text={t('projects.title')} />
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-3">{t('projects.subtitle')}</p>
          <div className="section-title-line" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, idx) => (
            <ProjectFlipCard
              key={project.id}
              project={project}
              idx={idx}
              inView={inView}
              t={t}
              lang={lang}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
