'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Palette, X, RotateCcw, Star, Download, Upload, Share2, Clock } from 'lucide-react'
import { useTheme, getRecentThemes, getShareableThemeUrl, type Theme } from '@/lib/theme'
import { useToastStore } from '@/store/toast-store'

interface Preset {
  name: string
  cyan: string
  magenta: string
  purple: string
  bg?: string
  surface?: string
  themeMode?: 'dark' | 'light' | 'liquid-glass' | 'theme-3d' | 'skeuomorphic'
  // Mini preview gradient swatch shown on the preset card (CSS background value)
  previewBg: string
}

const PRESETS: Preset[] = [
  { name: 'Cyberpunk', cyan: '#00F5FF', magenta: '#FF00AA', purple: '#8B5CF6', previewBg: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #0A0A0F 100%)' },
  { name: 'Bloomberg', cyan: '#00C853', magenta: '#FFB300', purple: '#FF6D00', bg: '#0a0f0a', surface: '#111a11', previewBg: 'linear-gradient(135deg, #0a0f0a 0%, #111a11 50%, #0a0f0a 100%)' },
  { name: 'Midnight', cyan: '#00BCD4', magenta: '#2979FF', purple: '#3D5AFE', previewBg: 'linear-gradient(135deg, #050510 0%, #0F0F3A 50%, #050510 100%)' },
  { name: 'Sunset', cyan: '#FF6B6B', magenta: '#FFA07A', purple: '#FFD700', previewBg: 'linear-gradient(135deg, #2a0f0a 0%, #3a1a0a 50%, #2a0f0a 100%)' },
  { name: 'Aurora', cyan: '#00E676', magenta: '#E040FB', purple: '#7C4DFF', previewBg: 'linear-gradient(135deg, #0a1a0f 0%, #1a0a2a 50%, #0a1a0f 100%)' },
  { name: 'Matrix', cyan: '#00FF41', magenta: '#39FF14', purple: '#008F11', bg: '#000a00', surface: '#001100', previewBg: 'linear-gradient(135deg, #000a00 0%, #001100 50%, #000a00 100%)' },
  { name: 'Liquid Glass', cyan: '#C8A0FF', magenta: '#F8BBD9', purple: '#A5E6CF', themeMode: 'liquid-glass', previewBg: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #e0f2f1 100%)' },
  { name: '3D World', cyan: '#00F5FF', magenta: '#FF2DAA', purple: '#A78BFA', themeMode: 'theme-3d', previewBg: 'linear-gradient(135deg, #050510 0%, #1a0a3a 50%, #050510 100%)' },
  { name: 'Cahaya', cyan: '#D4A24C', magenta: '#B8763E', purple: '#6B9B9E', themeMode: 'skeuomorphic', previewBg: 'linear-gradient(135deg, #F6F1E7 0%, #EFE8DA 50%, #E8DFCD 100%)' },
  { name: 'Rose Gold', cyan: '#E8A0BF', magenta: '#F4C2C2', purple: '#DDA0DD', previewBg: 'linear-gradient(135deg, #2a1a1f 0%, #3a2025 50%, #2a1a1f 100%)' },
  { name: 'Ocean', cyan: '#00ACC1', magenta: '#0097A7', purple: '#26C6DA', previewBg: 'linear-gradient(135deg, #0a1a2a 0%, #0a2a3a 50%, #0a1a2a 100%)' },
]

const DEFAULT_COLORS = { cyan: '#00F5FF', magenta: '#FF00AA', purple: '#8B5CF6' }

function applyColor(key: string, value: string) {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty(key, value)
}

function applyPresetColors(preset: Preset) {
  applyColor('--neon-cyan', preset.cyan)
  applyColor('--neon-magenta', preset.magenta)
  applyColor('--neon-purple', preset.purple)
  if (preset.bg) applyColor('--dark-base', preset.bg)
  if (preset.surface) applyColor('--dark-surface', preset.surface)
}

export function ThemeCustomizer() {
  const { setTheme } = useTheme()
  const { addToast } = useToastStore()
  const [open, setOpen] = useState(false)

  // Initialize from localStorage (runs once during mount)
  const [activeColors, setActiveColors] = useState<Record<string, string>>({})
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentThemes, setRecentThemes] = useState<Theme[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hasAppliedInitialTheme = useRef(false)

  // Load favorites & recent from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme-favorites')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setFavorites(parsed)
        }
      }
      // Load recently used themes
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecentThemes(getRecentThemes())
    } catch { /* ignore */ }
  }, [])

  const toggleFavorite = useCallback((presetName: string) => {
    setFavorites(prev => {
      const next = prev.includes(presetName)
        ? prev.filter(n => n !== presetName)
        : [...prev, presetName]
      try { localStorage.setItem('theme-favorites', JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  // Share current theme via URL (?theme=xxx) — copy to clipboard
  const shareCurrentTheme = useCallback(() => {
    try {
      const currentTheme = (localStorage.getItem('theme') as Theme) || 'dark'
      const shareUrl = getShareableThemeUrl(currentTheme)
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          addToast('🔗 Tautan tema disalin ke clipboard', 'success')
        }).catch(() => {
          // Fallback: select-then-prompt
          window.prompt('Salin tautan tema ini:', shareUrl)
        })
      } else {
        window.prompt('Salin tautan tema ini:', shareUrl)
      }
    } catch {
      addToast('Gagal membuat tautan tema', 'error')
    }
  }, [addToast])

  // Quick switch to a recently used theme
  const switchToRecent = useCallback((theme: Theme) => {
    setTheme(theme)
    const html = document.documentElement
    html.classList.remove('dark', 'light', 'theme-3d', 'liquid-glass', 'skeuomorphic')
    if (theme === 'dark') html.classList.add('dark')
    else if (theme === 'theme-3d') html.classList.add('theme-3d')
    else if (theme === 'liquid-glass') html.classList.add('liquid-glass')
    else if (theme === 'skeuomorphic') html.classList.add('skeuomorphic')
    try { localStorage.removeItem('theme-preset') } catch { /* ignore */ }
    // Refresh recent list
    setRecentThemes(getRecentThemes())
  }, [setTheme])

  // Export all theme settings (theme, favorites, custom colors, preset) as downloadable JSON
  const exportSettings = useCallback(() => {
    try {
      const settings = {
        version: 1,
        exportedAt: new Date().toISOString(),
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
    } catch (e) {
      addToast('Gagal export pengaturan', 'error')
    }
  }, [addToast])

  // Import theme settings from uploaded JSON file
  const importSettings = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string)
        if (settings.theme && ['dark', 'light', 'theme-3d', 'liquid-glass', 'skeuomorphic'].includes(settings.theme)) {
          localStorage.setItem('theme', settings.theme)
        }
        if (settings.themePreset) localStorage.setItem('theme-preset', settings.themePreset)
        if (Array.isArray(settings.themeFavorites)) localStorage.setItem('theme-favorites', JSON.stringify(settings.themeFavorites))
        if (settings.themeCustomColors && typeof settings.themeCustomColors === 'object') localStorage.setItem('theme-custom-colors', JSON.stringify(settings.themeCustomColors))
        if (settings.lang) localStorage.setItem('lang', settings.lang)
        addToast('✓ Pengaturan tema berhasil diimport. Memuat ulang...', 'success')
        setTimeout(() => window.location.reload(), 800)
      } catch (err) {
        addToast('File JSON tidak valid', 'error')
      }
    }
    reader.readAsText(file)
    // Reset input so same file can be re-uploaded
    event.target.value = ''
  }, [addToast])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const applyPreset = useCallback((preset: Preset) => {
    // Theme transition overlay
    const overlay = document.createElement('div')
    overlay.id = 'theme-transition-overlay'
    const overlayBg = (preset.themeMode === 'liquid-glass' || preset.themeMode === 'light') ? '#ffffff' : '#050510'
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', zIndex: '9999',
      background: overlayBg, pointerEvents: 'none', opacity: '0',
    })
    document.body.appendChild(overlay)
    const anim = overlay.animate(
      [{ opacity: 0 }, { opacity: 0.3 }, { opacity: 0 }],
      { duration: 400, easing: 'ease-in-out' },
    )
    anim.onfinish = () => overlay.remove()

    applyPresetColors(preset)
    const colors = { cyan: preset.cyan, magenta: preset.magenta, purple: preset.purple }
    setActiveColors(colors)
    setActivePreset(preset.name)

    // Handle theme mode switching
    if (preset.themeMode === 'liquid-glass') {
      setTheme('liquid-glass')
      document.documentElement.classList.remove('dark', 'theme-3d', 'skeuomorphic')
      document.documentElement.classList.add('liquid-glass')
    } else if (preset.themeMode === 'theme-3d') {
      setTheme('theme-3d')
      document.documentElement.classList.remove('dark', 'liquid-glass', 'skeuomorphic')
      document.documentElement.classList.add('theme-3d')
    } else if (preset.themeMode === 'skeuomorphic') {
      setTheme('skeuomorphic')
      document.documentElement.classList.remove('dark', 'liquid-glass', 'theme-3d')
      document.documentElement.classList.add('skeuomorphic')
    } else {
      // Restore to dark mode for non-liquid/3d/skeuomorphic presets
      setTheme('dark')
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('liquid-glass', 'theme-3d', 'skeuomorphic')
    }

    try { localStorage.setItem('theme-custom-colors', JSON.stringify(colors)) } catch { /* ignore */ }
    try { localStorage.setItem('theme-preset', preset.name) } catch { /* ignore */ }
  }, [setTheme])

  const resetTheme = useCallback(() => {
    applyPresetColors(DEFAULT_COLORS as Preset)
    setActiveColors(DEFAULT_COLORS)
    setActivePreset('Cyberpunk')
    setTheme('dark')
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('liquid-glass', 'theme-3d', 'skeuomorphic')
    try { localStorage.removeItem('theme-custom-colors') } catch { /* ignore */ }
    try { localStorage.removeItem('theme-preset') } catch { /* ignore */ }
  }, [setTheme])

  const handleColorChange = useCallback((key: string, cssVar: string, value: string) => {
    applyColor(cssVar, value)
    setActiveColors((prev) => {
      const next = { ...prev, [key]: value }
      setActivePreset(null)
      try { localStorage.setItem('theme-custom-colors', JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  useEffect(() => {
    // Restore saved theme preset on mount — only once
    if (typeof window === 'undefined') return
    if (hasAppliedInitialTheme.current) return
    hasAppliedInitialTheme.current = true

    const savedPreset = localStorage.getItem('theme-preset')
    const savedColors = localStorage.getItem('theme-custom-colors')

    // Restore custom colors
    if (savedColors) {
      try {
        const colors = JSON.parse(savedColors)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveColors(colors)
        Object.entries(colors).forEach(([key, value]) => {
          const cssVarMap: Record<string, string> = { cyan: '--neon-cyan', magenta: '--neon-magenta', purple: '--neon-purple' }
          if (cssVarMap[key]) applyColor(cssVarMap[key], value as string)
        })
      } catch { /* ignore */ }
    }

    if (savedPreset) {
      setActivePreset(savedPreset)
    }

    // Restore theme class only if current theme doesn't already match
    const currentTheme = document.documentElement.classList.contains('theme-3d') ? 'theme-3d'
      : document.documentElement.classList.contains('liquid-glass') ? 'liquid-glass'
      : document.documentElement.classList.contains('skeuomorphic') ? 'skeuomorphic'
      : document.documentElement.classList.contains('dark') ? 'dark' : null

    if (savedPreset && currentTheme === null) {
      const preset = PRESETS.find(p => p.name === savedPreset)
      if (preset?.themeMode === 'liquid-glass') {
        setTheme('liquid-glass')
        document.documentElement.classList.remove('dark', 'theme-3d', 'skeuomorphic')
        document.documentElement.classList.add('liquid-glass')
      } else if (preset?.themeMode === 'theme-3d') {
        setTheme('theme-3d')
        document.documentElement.classList.remove('dark', 'liquid-glass', 'skeuomorphic')
        document.documentElement.classList.add('theme-3d')
      } else if (preset?.themeMode === 'skeuomorphic') {
        setTheme('skeuomorphic')
        document.documentElement.classList.remove('dark', 'liquid-glass', 'theme-3d')
        document.documentElement.classList.add('skeuomorphic')
      }
    }
  }, [setTheme])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="fixed bottom-6 right-20 z-40 w-9 h-9 rounded-lg glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--neon-magenta)]/40 hover:text-[var(--neon-magenta)] hover:shadow-[var(--glow-magenta)] cursor-pointer"
        aria-label="Theme Customizer"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-16 right-20 z-40 w-72 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] max-h-[70vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-display font-bold text-[var(--text-primary)] tracking-wider">THEME</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={shareCurrentTheme}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors cursor-pointer"
                title="Share current theme via URL"
                aria-label="Share theme"
              >
                <Share2 className="h-3 w-3" />
              </button>
              <button
                onClick={exportSettings}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors cursor-pointer"
                title="Export settings as JSON"
                aria-label="Export theme settings"
              >
                <Download className="h-3 w-3" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors cursor-pointer"
                title="Import settings from JSON"
                aria-label="Import theme settings"
              >
                <Upload className="h-3 w-3" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={importSettings}
                className="hidden"
                aria-hidden="true"
              />
              <button
                onClick={resetTheme}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors cursor-pointer"
                title="Reset to default"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X className="h-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] tracking-wider uppercase">Presets</p>
                {favorites.length > 0 && (
                  <span className="text-[9px] font-mono-custom text-[var(--neon-cyan)]/70">{favorites.length} ★</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[...PRESETS].sort((a, b) => {
                  // Favorites pinned to top
                  const aFav = favorites.includes(a.name) ? 0 : 1
                  const bFav = favorites.includes(b.name) ? 0 : 1
                  return aFav - bFav
                }).map((preset) => {
                  const isActive = activePreset === preset.name
                  const isLiquid = preset.themeMode === 'liquid-glass'
                  const is3D = preset.themeMode === 'theme-3d'
                  const isSkeuo = preset.themeMode === 'skeuomorphic'
                  const isFav = favorites.includes(preset.name)
                  return (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className={`group relative rounded-lg border p-2 text-center transition-all duration-200 cursor-pointer overflow-hidden hover:scale-[1.04] hover:z-10 ${
                        isActive ? 'border-[var(--neon-cyan)]/60 shadow-[0_0_12px_var(--neon-cyan)]' : 'border-[var(--glass-border)] hover:border-[var(--neon-cyan)]/40 hover:shadow-[0_0_8px_var(--neon-cyan)]/40'
                      } ${isFav ? 'ring-1 ring-[var(--neon-cyan)]/30' : ''}`}
                    >
                      {/* Mini preview thumbnail — shows theme background character */}
                      <div
                        className="absolute inset-0 opacity-50 group-hover:opacity-80 transition-opacity"
                        style={{ background: preset.previewBg }}
                        aria-hidden="true"
                      />
                      {/* Favorite star button (top-left, click to toggle) */}
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(preset.name) }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toggleFavorite(preset.name) } }}
                        className={`absolute top-0.5 left-0.5 z-20 w-4 h-4 flex items-center justify-center rounded transition-all cursor-pointer ${isFav ? 'text-[var(--neon-cyan)] opacity-100' : 'text-[var(--text-secondary)] opacity-0 group-hover:opacity-60 hover:!opacity-100'}`}
                        aria-label={isFav ? `Unstar ${preset.name}` : `Star ${preset.name}`}
                      >
                        <Star className={`h-2.5 w-2.5 ${isFav ? 'fill-current' : ''}`} />
                      </span>
                      {/* Color dots overlay (kept for accent reference) */}
                      <div className="relative flex gap-0.5 mb-1 justify-center">
                        <span className="w-3 h-3 rounded-full ring-1 ring-black/20" style={{ backgroundColor: preset.cyan }} />
                        <span className="w-3 h-3 rounded-full ring-1 ring-black/20" style={{ backgroundColor: preset.magenta }} />
                        <span className="w-3 h-3 rounded-full ring-1 ring-black/20" style={{ backgroundColor: preset.purple }} />
                      </div>
                      <span className="relative text-[9px] font-mono-custom text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-tight block">
                        {preset.name}
                      </span>
                      {isLiquid && (
                        <span className="relative text-[7px] text-[var(--neon-purple)] font-mono-custom">✦ NEW</span>
                      )}
                      {is3D && (
                        <span className="relative text-[7px] text-[var(--neon-cyan)] font-mono-custom">◈ 3D</span>
                      )}
                      {isSkeuo && (
                        <span className="relative text-[7px] text-[var(--neon-magenta)] font-mono-custom">☀ CAHAYA</span>
                      )}
                      {isActive && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] z-20" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Recently Used Themes — quick access to last 4 themes used */}
            {recentThemes.length > 1 && (
              <div className="border-t border-[var(--glass-border)] pt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="h-2.5 w-2.5 text-[var(--text-secondary)]" />
                  <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] tracking-wider uppercase">Baru Digunakan</p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {recentThemes.map((t) => {
                    const labels: Record<Theme, { id: string; emoji: string; bg: string }> = {
                      dark: { id: 'Gelap', emoji: '🌙', bg: 'linear-gradient(135deg, #0A0A0F, #1A1A2E)' },
                      light: { id: 'Terang', emoji: '☀️', bg: 'linear-gradient(135deg, #F0F4FF, #FFFFFF)' },
                      skeuomorphic: { id: 'Cahaya', emoji: '✨', bg: 'linear-gradient(135deg, #F6F1E7, #E8DFCD)' },
                      'liquid-glass': { id: 'Liquid', emoji: '💧', bg: 'linear-gradient(135deg, #f3e8ff, #e0f2f1)' },
                      'theme-3d': { id: '3D', emoji: '🧊', bg: 'linear-gradient(135deg, #050510, #1a0a3a)' },
                    }
                    const label = labels[t]
                    return (
                      <button
                        key={t}
                        onClick={() => switchToRecent(t)}
                        className="group flex items-center gap-1 px-2 py-1 rounded-md border border-[var(--glass-border)] hover:border-[var(--neon-cyan)]/40 transition-all cursor-pointer overflow-hidden relative"
                        title={`Switch to ${label.id}`}
                      >
                        <span
                          className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity"
                          style={{ background: label.bg }}
                          aria-hidden="true"
                        />
                        <span className="relative text-[10px]">{label.emoji}</span>
                        <span className="relative text-[9px] font-mono-custom text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{label.id}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-[var(--glass-border)] pt-3">
              <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] mb-2 tracking-wider uppercase">Custom Colors</p>
              <div className="space-y-2">
                {[
                  { key: 'cyan', cssVar: '--neon-cyan', label: 'Cyan', default: '#00F5FF' },
                  { key: 'magenta', cssVar: '--neon-magenta', label: 'Magenta', default: '#FF00AA' },
                  { key: 'purple', cssVar: '--neon-purple', label: 'Purple', default: '#8B5CF6' },
                ].map(({ key, cssVar, label, default: def }) => (
                  <div key={key} className="flex items-center gap-2">
                    <label className="text-[10px] font-mono-custom text-[var(--text-secondary)] w-14">{label}</label>
                    <div
                      className="flex-1 h-5 rounded border border-[var(--glass-border)] overflow-hidden relative"
                      style={{ background: `linear-gradient(to right, ${activeColors[key] || def}33, ${activeColors[key] || def}11)` }}
                    >
                      <input
                        type="color"
                        value={activeColors[key] || def}
                        onChange={(e) => handleColorChange(key, cssVar, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <span className="text-[9px] font-mono-custom text-[var(--text-secondary)] w-14 text-right">{(activeColors[key] || def).toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}