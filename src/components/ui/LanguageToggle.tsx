'use client'

import { useLanguageStore } from '@/store/language-store'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguageStore()

  return (
    <button
      onClick={toggleLang}
      className={cn(
        'relative flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)]/80 px-2.5 py-1.5 text-[10px] font-mono-custom tracking-[0.2em] text-[var(--text-secondary)] shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)] hover:shadow-[var(--glow-cyan)] sm:px-3 sm:py-1.5 sm:text-xs',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dark-base)]'
      )}
      aria-label={`Switch to ${lang === 'id' ? 'English' : 'Indonesian'}`}
      title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
    >
      <span className="hidden sm:inline">BAHASA</span>
      <span className="sm:hidden">{lang === 'id' ? 'ID' : 'EN'}</span>
      <span className="text-[var(--text-secondary)]">/</span>
      <span className={cn(
        'font-semibold uppercase transition-colors duration-300',
        lang === 'id' ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-secondary)]'
      )}>
        ID
      </span>
      <span className={cn(
        'font-semibold uppercase transition-colors duration-300',
        lang === 'en' ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-secondary)]'
      )}>
        EN
      </span>
    </button>
  )
}