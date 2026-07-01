'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageStore } from '@/store/language-store'

const SECTION_IDS = ['hero', 'about', 'stats', 'techstack', 'achievements', 'experience', 'faq', 'contact']

const LABELS_ID = ['', 'Tentang', 'Stats', 'Tech', 'Pencapaian', 'Pengalaman', 'FAQ', 'Kontak']
const LABELS_EN = ['', 'About', 'Stats', 'Tech', 'Achievements', 'Experience', 'FAQ', 'Contact']

export function ScrollSpy() {
  const { lang, t } = useLanguageStore()
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getLabels = useCallback(() => {
    return lang === 'en' ? LABELS_EN : LABELS_ID
  }, [lang])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      let current = 0

      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i])
        if (el) {
          const top = el.offsetTop - windowHeight * 0.35
          if (scrollY >= top) {
            current = i
            break
          }
        }
      }

      setActiveIndex(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (index: number) => {
    const id = SECTION_IDS[index]
    if (!id) return
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const labels = getLabels()

  return (
    <nav
      className="fixed right-3 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-3"
      aria-label="Section navigation"
    >
      {SECTION_IDS.map((id, index) => {
        const label = labels[index]
        if (!label) return null

        const isActive = activeIndex === index
        const isHovered = hoveredIndex === index

        return (
          <div
            key={id}
            className="relative flex items-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-6 whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-md bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md text-[var(--text-primary)]"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>

            <button
              onClick={() => handleClick(index)}
              className="relative w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: isActive
                  ? 'var(--neon-cyan)'
                  : 'var(--glass-border)',
                boxShadow: isActive
                  ? '0 0 12px var(--neon-cyan), 0 0 24px var(--neon-cyan)'
                  : 'none',
              }}
              aria-label={label}
            >
              {isActive && (
                <span
                  className="absolute inset-[-4px] rounded-full border-2 border-[var(--neon-cyan)]/40"
                  style={{
                    animation: 'neon-pulse-ring 2s ease-out infinite',
                  }}
                />
              )}
            </button>
          </div>
        )
      })}
    </nav>
  )
}