'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Palette, X, RotateCcw } from 'lucide-react'
import { useTheme } from '@/lib/theme'

interface Preset {
  name: string
  cyan: string
  magenta: string
  purple: string
  bg?: string
  surface?: string
  themeMode?: 'dark' | 'light' | 'liquid-glass' | 'theme-3d' | 'skeuomorphic'
}

const PRESETS: Preset[] = [
  { name: 'Cyberpunk', cyan: '#00F5FF', magenta: '#FF00AA', purple: '#8B5CF6' },
  { name: 'Bloomberg', cyan: '#00C853', magenta: '#FFB300', purple: '#FF6D00', bg: '#0a0f0a', surface: '#111a11' },
  { name: 'Midnight', cyan: '#00BCD4', magenta: '#2979FF', purple: '#3D5AFE' },
  { name: 'Sunset', cyan: '#FF6B6B', magenta: '#FFA07A', purple: '#FFD700' },
  { name: 'Aurora', cyan: '#00E676', magenta: '#E040FB', purple: '#7C4DFF' },
  { name: 'Matrix', cyan: '#00FF41', magenta: '#39FF14', purple: '#008F11', bg: '#000a00', surface: '#001100' },
  { name: 'Liquid Glass', cyan: '#C8A0FF', magenta: '#F8BBD9', purple: '#A5E6CF', themeMode: 'liquid-glass' },
  { name: '3D World', cyan: '#00F5FF', magenta: '#FF2DAA', purple: '#A78BFA', themeMode: 'theme-3d' },
  { name: 'Cahaya', cyan: '#D4A24C', magenta: '#B8763E', purple: '#6B9B9E', themeMode: 'skeuomorphic' },
  { name: 'Rose Gold', cyan: '#E8A0BF', magenta: '#F4C2C2', purple: '#DDA0DD' },
  { name: 'Ocean', cyan: '#00ACC1', magenta: '#0097A7', purple: '#26C6DA' },
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
  const [open, setOpen] = useState(false)

  // Initialize from localStorage (runs once during mount)
  const [activeColors, setActiveColors] = useState<Record<string, string>>({})
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hasAppliedInitialTheme = useRef(false)

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
              <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] mb-2 tracking-wider uppercase">Presets</p>
              <div className="grid grid-cols-3 gap-1.5">
                {PRESETS.map((preset) => {
                  const isActive = activePreset === preset.name
                  const isLiquid = preset.themeMode === 'liquid-glass'
                  const is3D = preset.themeMode === 'theme-3d'
                  const isSkeuo = preset.themeMode === 'skeuomorphic'
                  return (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className={`group relative rounded-lg border p-1.5 text-center transition-all duration-200 cursor-pointer ${
                        isActive ? 'border-[var(--neon-cyan)]/60 shadow-[0_0_10px_var(--neon-cyan)]' : 'border-[var(--glass-border)] hover:border-[var(--glass-border)]/80'
                      }`}
                    >
                      <div className="flex gap-0.5 mb-1 justify-center">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.cyan }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.magenta }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.purple }} />
                      </div>
                      <span className="text-[9px] font-mono-custom text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-tight block">
                        {preset.name}
                      </span>
                      {isLiquid && (
                        <span className="text-[7px] text-[var(--neon-purple)] font-mono-custom">✦ NEW</span>
                      )}
                      {is3D && (
                        <span className="text-[7px] text-[var(--neon-cyan)] font-mono-custom">◈ 3D</span>
                      )}
                      {isSkeuo && (
                        <span className="text-[7px] text-[var(--neon-magenta)] font-mono-custom">☀ CAHAYA</span>
                      )}
                      {isActive && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />}
                    </button>
                  )
                })}
              </div>
            </div>

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