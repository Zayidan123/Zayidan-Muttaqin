'use client'

import { useLanguageStore } from '@/store/language-store'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguageStore()

  return (
    <button
      onClick={toggleLang}
      className={cn(
        'relative px-3 py-1.5 rounded-lg glass font-mono-custom text-xs tracking-wider',
        'transition-all duration-300 hover:shadow-[var(--glow-cyan)]',
        'flex items-center gap-1'
      )}
      aria-label={`Switch to ${lang === 'id' ? 'English' : 'Indonesian'}`}
    >
      <span className={cn(
        'transition-colors duration-300',
        lang === 'id' ? 'text-[var(--neon-cyan)] font-bold' : 'text-[var(--text-secondary)]'
      )}>
        ID
      </span>
      <span className="text-[var(--text-secondary)] mx-0.5">|</span>
      <span className={cn(
        'transition-colors duration-300',
        lang === 'en' ? 'text-[var(--neon-cyan)] font-bold' : 'text-[var(--text-secondary)]'
      )}>
        EN
      </span>
    </button>
  )
}