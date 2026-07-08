'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart, Search } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { useLanguageStore } from '@/store/language-store'
import { cn } from '@/lib/utils'

const navItems = [
  { key: 'about', href: '#about' },
  { key: 'experience', href: '#experience' },
  { key: 'projects', href: '#projects' },
  { key: 'faq', href: '#faq' },
  { key: 'contact', href: '#contact' },
] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { t } = useLanguageStore()

  useEffect(() => { if (!mobileOpen) return; const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }; document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h) }, [mobileOpen])

  useEffect(() => {
    const handle = () => {
      setScrolled(window.scrollY > 50)
      for (let i = navItems.length - 1; i >= 0; i--) { const el = document.getElementById(navItems[i]!.href.slice(1)); if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(navItems[i]!.href.slice(1)); break } }
    }
    window.addEventListener('scroll', handle, { passive: true }); return () => window.removeEventListener('scroll', handle)
  }, [])

  const handleClick = (href: string) => { setMobileOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }) }

  return (
    <>
      <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'glass-strong shadow-lg' : 'bg-transparent')}>
        {scrolled && <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-cyan)]/40 to-transparent" />}
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          <a href="#hero" onClick={(e) => { e.preventDefault(); handleClick('#hero') }} className="shrink-0 font-display text-base font-bold tracking-wider text-[var(--neon-cyan)] text-glow-cyan transition-opacity hover:opacity-80 sm:text-lg">ZAYIDAN</a>
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map(item => (
              <a key={item.key} href={item.href} onClick={(e) => { e.preventDefault(); handleClick(item.href) }} className={cn('relative text-sm font-medium tracking-wide transition-colors duration-300 py-1', activeSection === item.key ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-secondary)] hover:text-[var(--neon-cyan)]')}>
                {t(`nav.${item.key}`)}
                {activeSection === item.key && <motion.div layoutId="activeNav" className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[var(--neon-cyan)] shadow-[var(--glow-cyan)] rounded-full" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              </a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <ThemeToggle />
            <LanguageToggle />
            <button onClick={() => window.dispatchEvent(new Event('command-palette:toggle'))} className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-[var(--glass-border)] text-xs font-mono-custom text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-all" aria-label={t('commandPalette.title')}>
              <Search className="h-3.5 w-3.5" /><span className="hidden xl:inline">...</span><kbd className="hidden xl:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono-custom bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)]/60">Ctrl K</kbd>
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-10 h-10 rounded-lg glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-primary)] transition-all hover:text-[var(--neon-cyan)]" aria-label={t('shortcuts.sections')} aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>
      <AnimatePresence>{mobileOpen && (<>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[55] md:hidden" onClick={() => setMobileOpen(false)} />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 z-[60] flex w-[min(85vw,18rem)] flex-col md:hidden" style={{ borderLeft: '2px solid transparent' }}>
          <div className="h-1 bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-magenta)] to-[var(--neon-purple)] shrink-0" />
          <div className="absolute top-1 left-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--neon-magenta)] to-transparent animate-pulse" />
          <div className="flex flex-1 flex-col overflow-hidden glass-strong">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <span className="font-display text-lg font-bold tracking-wider text-[var(--neon-cyan)] text-glow-cyan">ZAYIDAN</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-primary)] transition-all hover:text-[var(--neon-cyan)] cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-1 px-3 flex-1">
              {navItems.map(item => (
                <a key={item.key} href={item.href} onClick={(e) => { e.preventDefault(); handleClick(item.href) }} className={cn('relative flex items-center pl-4 pr-4 py-3 text-base font-display tracking-wider rounded-lg transition-all', activeSection === item.key ? 'text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/8' : 'text-[var(--text-secondary)] hover:text-[var(--neon-cyan)]')}>
                  {activeSection === item.key && <motion.div layoutId="mobileActiveNav" className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                  {t(`nav.${item.key}`)}
                </a>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-[var(--glass-border)]"><LanguageToggle /></div>
            <div className="px-6 py-3 border-t border-[var(--glass-border)] text-center"><p className="text-[10px] text-[var(--text-secondary)] flex items-center justify-center gap-1"><span className="inline-flex items-center gap-0.5 text-[var(--neon-magenta)]">{t('footer.builtWith')} <Heart className="h-2.5 w-2.5 fill-current" /></span></p></div>
          </div>
        </motion.div>
      </>)}</AnimatePresence>
    </>
  )
}