'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguageStore } from '@/store/language-store'
import { Keyboard, ChevronRight } from 'lucide-react'

export function KeyboardShortcutsHint() {
  const { t } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  // Auto-hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setIsVisible(false)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [isOpen])

  // Reset visibility timer on open/close
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
    if (!isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const shouldShow = isVisible || isHovering

  return (
    <div
      className="hidden lg:block fixed bottom-6 left-6 z-50"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-xl glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-all duration-300 hover:shadow-[var(--glow-cyan)]"
        aria-label={t('shortcuts.title')}
      >
        <Keyboard className="h-4 w-4" />
      </button>

      {/* Shortcuts Panel */}
      <div
        className={`absolute bottom-14 left-0 transition-all duration-300 ease-out ${
          isOpen && shouldShow
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="w-64 p-4 rounded-xl glass border border-[var(--glass-border)] glass-noise">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-display text-xs font-semibold text-[var(--text-primary)]">
              {t('shortcuts.title')}
            </h3>
            <ChevronRight className={`h-3 w-3 text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
          </div>

          <div className="space-y-2">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--text-secondary)]">{t('shortcuts.theme')}</span>
              <kbd className="inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-md text-[10px] font-mono-custom text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5">T</kbd>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--text-secondary)]">{t('shortcuts.language')}</span>
              <kbd className="inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-md text-[10px] font-mono-custom text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5">L</kbd>
            </div>

            {/* Sections */}
            <div className="pt-1 border-t border-[var(--glass-border)]">
              <span className="text-[10px] text-[var(--text-secondary)] block mb-1.5">{t('shortcuts.sections')}</span>
              <div className="flex gap-1.5">
                {['1', '2', '3', '4'].map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-md text-[10px] font-mono-custom text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>

            {/* Command Palette */}
            <div className="pt-1 mt-1 border-t border-[var(--glass-border)]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-secondary)]">{t('shortcuts.palette')}</span>
                <kbd className="inline-flex items-center justify-center h-6 px-1.5 rounded-md text-[10px] font-mono-custom text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5">
                  <span className="opacity-60">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}