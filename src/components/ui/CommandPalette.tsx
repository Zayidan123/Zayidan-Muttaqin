'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, Briefcase, Mail, Sun, Moon, Globe, Download, ArrowUp, Search, HelpCircle, Trophy, Cpu, Eye, Github, Palette, Sparkles, Layers, Box, Upload, FileJson } from 'lucide-react'
import { useLanguageStore } from '@/store/language-store'
import { useTheme } from '@/lib/theme'
import { useToastStore } from '@/store/toast-store'
import { useCvStore } from '@/store/cv-store'

interface Cmd { id: string; labelKey: string; group: string; icon: React.ElementType; shortcut?: string; action: () => void }

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const { t, lang, toggleLang } = useLanguageStore()
  const { theme, setTheme } = useTheme()
  const { addToast } = useToastStore()
  const { setOpen: setCvOpen } = useCvStore()

  const scrollTo = useCallback((id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }, [])

  const applyTheme = useCallback((nextTheme: 'dark' | 'light' | 'skeuomorphic' | 'liquid-glass' | 'theme-3d') => {
    const html = document.documentElement
    html.classList.remove('dark', 'light', 'theme-3d', 'liquid-glass', 'skeuomorphic')
    if (nextTheme === 'dark') html.classList.add('dark')
    else if (nextTheme === 'theme-3d') html.classList.add('theme-3d')
    else if (nextTheme === 'liquid-glass') html.classList.add('liquid-glass')
    else if (nextTheme === 'skeuomorphic') html.classList.add('skeuomorphic')
    setTheme(nextTheme)
    try { localStorage.removeItem('theme-preset') } catch { /* ignore */ }
  }, [setTheme])

  const commands: Cmd[] = [
    { id: 'hero', labelKey: 'commandPalette.goHero', group: 'commandPalette.navGroup', icon: Home, shortcut: '1', action: () => scrollTo('hero') },
    { id: 'about', labelKey: 'commandPalette.goAbout', group: 'commandPalette.navGroup', icon: User, shortcut: '2', action: () => scrollTo('about') },
    { id: 'experience', labelKey: 'commandPalette.goExperience', group: 'commandPalette.navGroup', icon: Briefcase, shortcut: '3', action: () => scrollTo('experience') },
    { id: 'projects', labelKey: 'commandPalette.goProjects', group: 'commandPalette.navGroup', icon: Github, action: () => scrollTo('projects') },
    { id: 'faq', labelKey: 'commandPalette.goFaq', group: 'commandPalette.navGroup', icon: HelpCircle, shortcut: '4', action: () => scrollTo('faq') },
    { id: 'contact', labelKey: 'commandPalette.goContact', group: 'commandPalette.navGroup', icon: Mail, shortcut: '5', action: () => scrollTo('contact') },
    { id: 'techstack', labelKey: 'commandPalette.goTechstack', group: 'commandPalette.navGroup', icon: Cpu, action: () => scrollTo('techstack') },
    { id: 'achievements', labelKey: 'commandPalette.goAchievements', group: 'commandPalette.navGroup', icon: Trophy, action: () => scrollTo('achievements') },
    { id: 'theme', labelKey: 'commandPalette.toggleTheme', group: 'commandPalette.actionsGroup', icon: Palette, shortcut: 'T', action: () => {
      const cycle = ['dark', 'light', 'skeuomorphic', 'liquid-glass', 'theme-3d'] as const
      const idx = cycle.indexOf(theme as typeof cycle[number])
      const next = cycle[(idx + 1) % cycle.length]
      applyTheme(next)
    } },
    { id: 'theme-dark', labelKey: 'commandPalette.themeDark', group: 'commandPalette.themesGroup', icon: Moon, action: () => applyTheme('dark') },
    { id: 'theme-light', labelKey: 'commandPalette.themeLight', group: 'commandPalette.themesGroup', icon: Sun, action: () => applyTheme('light') },
    { id: 'theme-skeuomorphic', labelKey: 'commandPalette.themeSkeuomorphic', group: 'commandPalette.themesGroup', icon: Sparkles, action: () => applyTheme('skeuomorphic') },
    { id: 'theme-liquid-glass', labelKey: 'commandPalette.themeLiquidGlass', group: 'commandPalette.themesGroup', icon: Layers, action: () => applyTheme('liquid-glass') },
    { id: 'theme-3d', labelKey: 'commandPalette.theme3D', group: 'commandPalette.themesGroup', icon: Box, action: () => applyTheme('theme-3d') },
    { id: 'lang', labelKey: 'commandPalette.switchLang', group: 'commandPalette.actionsGroup', icon: Globe, shortcut: 'L', action: () => { toggleLang(); addToast(lang === 'id' ? 'Switched to English' : 'Beralih ke Bahasa Indonesia', 'info') } },
    { id: 'read-cv', labelKey: 'commandPalette.readCV', group: 'commandPalette.actionsGroup', icon: Eye, shortcut: 'V', action: () => setCvOpen(true) },
    { id: 'cv', labelKey: 'commandPalette.downloadCV', group: 'commandPalette.actionsGroup', icon: Download, action: () => { const a = document.createElement('a'); a.href = lang === 'en' ? '/CV_ZAYIDAN_MUTTAQIN_EN.pdf' : '/CV_ZAYIDAN_MUTTAQIN.pdf'; a.download = lang === 'en' ? 'CV_ZAYIDAN_MUTTAQIN_EN.pdf' : 'CV_ZAYIDAN_MUTTAQIN.pdf'; a.click() } },
    { id: 'top', labelKey: 'commandPalette.scrollTop', group: 'commandPalette.actionsGroup', icon: ArrowUp, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'export-settings', labelKey: 'commandPalette.exportSettings', group: 'commandPalette.actionsGroup', icon: Download, action: () => {
      try {
        const settings = {
          version: 1, exportedAt: new Date().toISOString(),
          theme: localStorage.getItem('theme') || 'dark',
          themePreset: localStorage.getItem('theme-preset'),
          themeFavorites: JSON.parse(localStorage.getItem('theme-favorites') || '[]'),
          themeCustomColors: JSON.parse(localStorage.getItem('theme-custom-colors') || '{}'),
          lang: localStorage.getItem('lang') || 'id',
        }
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `zayidan-theme-settings-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
        addToast('⚙️ Pengaturan tema berhasil diexport', 'success')
      } catch { addToast('Gagal export pengaturan', 'error') }
    } },
    { id: 'import-settings', labelKey: 'commandPalette.importSettings', group: 'commandPalette.actionsGroup', icon: Upload, action: () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json,.json'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
          try {
            const settings = JSON.parse(ev.target?.result as string)
            if (settings.theme && ['dark', 'light', 'theme-3d', 'liquid-glass', 'skeuomorphic'].includes(settings.theme)) {
              localStorage.setItem('theme', settings.theme)
            }
            if (settings.themePreset) localStorage.setItem('theme-preset', settings.themePreset)
            if (Array.isArray(settings.themeFavorites)) localStorage.setItem('theme-favorites', JSON.stringify(settings.themeFavorites))
            if (settings.themeCustomColors && typeof settings.themeCustomColors === 'object') localStorage.setItem('theme-custom-colors', JSON.stringify(settings.themeCustomColors))
            if (settings.lang) localStorage.setItem('lang', settings.lang)
            addToast('✓ Pengaturan tema berhasil diimport. Memuat ulang...', 'success')
            setTimeout(() => window.location.reload(), 800)
          } catch { addToast('File JSON tidak valid', 'error') }
        }
        reader.readAsText(file)
      }
      input.click()
    } },
  ]

  useEffect(() => {
    const kd = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(p => !p) } }
    const ce = () => setOpen(p => !p)
    document.addEventListener('keydown', kd); window.addEventListener('command-palette:toggle', ce)
    return () => { document.removeEventListener('keydown', kd); window.removeEventListener('command-palette:toggle', ce) }
  }, [])

  useEffect(() => { if (open) { setSearch(''); setActiveIndex(0); setTimeout(() => inputRef.current?.focus(), 50) } }, [open])

  const filtered = commands.filter(cmd => { if (!search) return true; return t(cmd.labelKey).toLowerCase().includes(search.toLowerCase()) })
  useEffect(() => { setActiveIndex(0) }, [search])

  const handleKD = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(p => Math.min(p + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(p => Math.max(p - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) { filtered[activeIndex].action(); setOpen(false) } }
    else if (e.key === 'Escape') setOpen(false)
  }, [filtered, activeIndex])

  useEffect(() => { if (listRef.current) { const items = listRef.current.querySelectorAll('[data-cmd]'); (items[activeIndex] as HTMLElement)?.scrollIntoView({ block: 'nearest' }) } }, [activeIndex])

  const grouped = [
    { label: t('commandPalette.navGroup'), items: filtered.filter(c => c.group === 'commandPalette.navGroup') },
    { label: t('commandPalette.themesGroup'), items: filtered.filter(c => c.group === 'commandPalette.themesGroup') },
    { label: t('commandPalette.actionsGroup'), items: filtered.filter(c => c.group === 'commandPalette.actionsGroup') },
  ].filter(g => g.items.length > 0)

  let gi = -1

  return (
    <AnimatePresence>{open && (<>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="command-palette-backdrop" onClick={() => setOpen(false)} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.2 }} className="command-palette-dialog glass-strong border border-[var(--glass-border)] flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--glass-border)]">
          <Search className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
          <input ref={inputRef} type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleKD} placeholder={t('commandPalette.search')} className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/40 outline-none font-mono-custom" />
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono-custom text-[var(--text-secondary)] bg-[var(--glass-bg)] border border-[var(--glass-border)]">ESC</kbd>
        </div>
        <div ref={listRef} className="flex-1 overflow-y-auto py-2 max-h-[320px] custom-scrollbar">
          {grouped.map(group => (
            <div key={group.label}>
              <div className="px-4 py-1.5 text-[10px] font-mono-custom text-[var(--text-secondary)] uppercase tracking-wider">{group.label}</div>
              {group.items.map(item => { gi++; const idx = gi; const Icon = item.icon; const isThemeCmd = item.group === 'commandPalette.themesGroup' && item.id !== 'theme'; return (
                <div key={item.id} data-cmd className={`command-palette-item ${idx === activeIndex ? 'command-palette-item-active' : ''}`} onClick={() => { item.action(); setOpen(false) }} onMouseEnter={() => setActiveIndex(idx)}>
                  <Icon className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
                  <span className="flex-1 text-sm text-[var(--text-primary)]">{t(item.labelKey)}</span>
                  {/* Theme preview swatch on hover for theme commands */}
                  {isThemeCmd && (
                    <span
                      className="hidden md:inline-block w-4 h-4 rounded-full ring-1 ring-[var(--glass-border)] opacity-50 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: item.id === 'theme-dark' ? 'linear-gradient(135deg, #0A0A0F, #1A1A2E)'
                          : item.id === 'theme-light' ? 'linear-gradient(135deg, #F0F4FF, #FFFFFF)'
                          : item.id === 'theme-skeuomorphic' ? 'linear-gradient(135deg, #F6F1E7, #E8DFCD)'
                          : item.id === 'theme-liquid-glass' ? 'linear-gradient(135deg, #f3e8ff, #e0f2f1)'
                          : item.id === 'theme-3d' ? 'linear-gradient(135deg, #050510, #1a0a3a)'
                          : 'transparent'
                      }}
                      aria-hidden="true"
                    />
                  )}
                  {item.shortcut && <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono-custom text-[var(--text-secondary)] bg-[var(--glass-bg)] border border-[var(--glass-border)]">{item.shortcut}</kbd>}
                </div>
              )})}
            </div>
          ))}
          {filtered.length === 0 && <div className="px-4 py-8 text-center text-sm text-[var(--text-secondary)]">No commands found</div>}
        </div>
        <div className="px-4 py-2.5 border-t border-[var(--glass-border)]"><p className="text-[10px] font-mono-custom text-[var(--text-secondary)] text-center">{t('commandPalette.hint')}</p></div>
      </motion.div>
    </>)}</AnimatePresence>
  )
}