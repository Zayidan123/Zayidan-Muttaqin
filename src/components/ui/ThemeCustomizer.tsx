'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Palette, X, RotateCcw, Star, Download, Upload, Share2, Clock, QrCode, BarChart3, Volume2, VolumeX, Trash2, CalendarClock, Pencil, Save, ImageDown, BookmarkPlus, FileJson } from 'lucide-react'
import QRCode from 'qrcode'
import { useTheme, getRecentThemes, getShareableThemeUrl, getThemeUsage, getMostUsedTheme, resetThemeUsage, isThemeScheduleEnabled, setThemeScheduleEnabled, getScheduledTheme, getScheduleInfo, getCustomSchedule, saveCustomSchedule, resetCustomSchedule, getCustomPresets, saveCustomPreset, deleteCustomPreset, importScheduleFromJson, exportScheduleToJson, type ScheduleSlot, type CustomPreset, type Theme } from '@/lib/theme'
import { useToastStore } from '@/store/toast-store'
import { isThemeSoundEnabled, setThemeSoundEnabled } from '@/lib/theme-sound'

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
  const [themeUsage, setThemeUsage] = useState<Record<Theme, number>>({} as Record<Theme, number>)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduledLabel, setScheduledLabel] = useState<{ labelId: string; labelEn: string } | null>(null)
  const [editingSchedule, setEditingSchedule] = useState(false)
  const [editableSlots, setEditableSlots] = useState<ScheduleSlot[]>([])
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([])
  const [showSavePresetDialog, setShowSavePresetDialog] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hasAppliedInitialTheme = useRef(false)

  // Load favorites, recent & usage from localStorage on mount
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeUsage(getThemeUsage())
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSoundEnabled(isThemeSoundEnabled())
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScheduleEnabled(isThemeScheduleEnabled())
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomPresets(getCustomPresets())
      const scheduled = getScheduledTheme()
      if (scheduled) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setScheduledLabel({ labelId: scheduled.labelId, labelEn: scheduled.labelEn })
      }
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
    // Refresh recent + usage list
    setRecentThemes(getRecentThemes())
    setThemeUsage(getThemeUsage())
  }, [setTheme])

  // Toggle theme switch sound effect
  const toggleSound = useCallback(() => {
    const next = !soundEnabled
    setSoundEnabled(next)
    setThemeSoundEnabled(next)
    addToast(next ? '🔊 Suara tema dinyakkan' : '🔇 Suara tema dimatikan', 'info')
  }, [soundEnabled, addToast])

  // Reset all theme usage stats (count + recent)
  const handleResetStats = useCallback(() => {
    resetThemeUsage()
    setThemeUsage({} as Record<Theme, number>)
    setRecentThemes([])
    addToast('📊 Statistik tema direset', 'success')
  }, [addToast])

  // Toggle theme scheduler — auto-switch theme based on time of day
  const toggleScheduler = useCallback(() => {
    const next = !scheduleEnabled
    setScheduleEnabled(next)
    setThemeScheduleEnabled(next)
    if (next) {
      // Apply scheduled theme immediately when enabling
      const scheduled = getScheduledTheme()
      if (scheduled) {
        setTheme(scheduled.theme)
        const html = document.documentElement
        html.classList.remove('dark', 'light', 'theme-3d', 'liquid-glass', 'skeuomorphic')
        if (scheduled.theme === 'dark') html.classList.add('dark')
        else if (scheduled.theme === 'theme-3d') html.classList.add('theme-3d')
        else if (scheduled.theme === 'liquid-glass') html.classList.add('liquid-glass')
        else if (scheduled.theme === 'skeuomorphic') html.classList.add('skeuomorphic')
        try { localStorage.removeItem('theme-preset') } catch { /* ignore */ }
        addToast(`🕐 Scheduler aktif: ${scheduled.labelId} → ${scheduled.theme}`, 'success')
      }
    } else {
      addToast('🕐 Scheduler dimatikan', 'info')
    }
  }, [scheduleEnabled, setTheme, addToast])

  // Start editing custom schedule — load current schedule into editableSlots
  const startEditSchedule = useCallback(() => {
    setEditableSlots(getCustomSchedule().map(s => ({ ...s })))
    setEditingSchedule(true)
  }, [])

  // Save custom schedule to localStorage
  const saveEditSchedule = useCallback(() => {
    // Sort by startHour ascending
    const sorted = [...editableSlots].sort((a, b) => a.startHour - b.startHour)
    saveCustomSchedule(sorted)
    setEditingSchedule(false)
    // Refresh scheduled label
    const scheduled = getScheduledTheme()
    if (scheduled) setScheduledLabel({ labelId: scheduled.labelId, labelEn: scheduled.labelEn })
    addToast('✓ Jadwal tema tersimpan', 'success')
  }, [editableSlots, addToast])

  // Cancel editing
  const cancelEditSchedule = useCallback(() => {
    setEditingSchedule(false)
    setEditableSlots([])
  }, [])

  // Reset schedule to default
  const resetEditSchedule = useCallback(() => {
    resetCustomSchedule()
    setEditingSchedule(false)
    setEditableSlots([])
    const scheduled = getScheduledTheme()
    if (scheduled) setScheduledLabel({ labelId: scheduled.labelId, labelEn: scheduled.labelEn })
    addToast('🕐 Jadwal direset ke default', 'info')
  }, [addToast])

  // Update a slot field
  const updateSlot = useCallback((idx: number, field: keyof ScheduleSlot, value: string | number) => {
    setEditableSlots(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }, [])

  // Add a new slot
  const addSlot = useCallback(() => {
    setEditableSlots(prev => [...prev, { startHour: 0, theme: 'dark', labelId: 'Baru', labelEn: 'New' }])
  }, [])

  // Remove a slot
  const removeSlot = useCallback((idx: number) => {
    setEditableSlots(prev => prev.filter((_, i) => i !== idx))
  }, [])

  // Export usage chart as PNG (render to canvas then download)
  const exportChartPng = useCallback(() => {
    try {
      const usage = getThemeUsage()
      const entries = (Object.keys(usage) as Theme[]).map(t => ({ theme: t, count: usage[t] || 0 })).filter(e => e.count > 0)
      if (entries.length === 0) {
        addToast('Belum ada data untuk diexport', 'error')
        return
      }
      const max = Math.max(...entries.map(e => e.count), 1)
      const W = 480, H = 240, pad = 40, barH = 24, gap = 8
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = pad * 2 + entries.length * (barH + gap)
      const ctx = canvas.getContext('2d')
      if (!ctx) { addToast('Gagal membuat canvas', 'error'); return }
      // Background
      ctx.fillStyle = '#0A0A0F'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // Title
      ctx.fillStyle = '#00F5FF'
      ctx.font = 'bold 14px monospace'
      ctx.fillText('THEME USAGE STATS', pad, 24)
      // Bars
      const themeColors: Record<Theme, string> = {
        dark: '#00F5FF', light: '#0080FF', skeuomorphic: '#D4A24C', 'liquid-glass': '#C8A0FF', 'theme-3d': '#A78BFA',
      }
      const themeEmojis: Record<Theme, string> = {
        dark: 'Dark', light: 'Light', skeuomorphic: 'Cahaya', 'liquid-glass': 'Liquid', 'theme-3d': '3D',
      }
      entries.forEach((e, i) => {
        const y = pad + i * (barH + gap)
        const barW = (e.count / max) * (W - pad * 3)
        // Track
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        ctx.fillRect(pad, y, W - pad * 2, barH)
        // Bar
        ctx.fillStyle = themeColors[e.theme]
        ctx.fillRect(pad, y, barW, barH)
        // Label
        ctx.fillStyle = '#F0F0FF'
        ctx.font = '11px monospace'
        ctx.fillText(themeEmojis[e.theme], pad + 4, y + 15)
        // Count
        ctx.fillStyle = '#8888AA'
        ctx.font = '10px monospace'
        ctx.fillText(`${e.count}x`, W - pad + 4, y + 15)
      })
      // Download
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `zayidan-theme-usage-${Date.now()}.png`
      a.click()
      addToast('📊 Chart usage berhasil diexport', 'success')
    } catch {
      addToast('Gagal export chart', 'error')
    }
  }, [addToast])

  // Save current custom colors as a named preset
  const handleSavePreset = useCallback(() => {
    const name = newPresetName.trim()
    if (!name) {
      addToast('Nama preset tidak boleh kosong', 'error')
      return
    }
    if (name.length > 30) {
      addToast('Nama preset maksimal 30 karakter', 'error')
      return
    }
    const cyan = (activeColors.cyan || '#00F5FF')
    const magenta = (activeColors.magenta || '#FF00AA')
    const purple = (activeColors.purple || '#8B5CF6')
    saveCustomPreset({ name, cyan, magenta, purple })
    setCustomPresets(getCustomPresets())
    setNewPresetName('')
    setShowSavePresetDialog(false)
    addToast(`✓ Preset "${name}" tersimpan`, 'success')
  }, [newPresetName, activeColors, addToast])

  // Apply a custom preset
  const applyCustomPreset = useCallback((preset: CustomPreset) => {
    applyColor('--neon-cyan', preset.cyan)
    applyColor('--neon-magenta', preset.magenta)
    applyColor('--neon-purple', preset.purple)
    setActiveColors({ cyan: preset.cyan, magenta: preset.magenta, purple: preset.purple })
    setActivePreset(preset.name)
    try { localStorage.setItem('theme-custom-colors', JSON.stringify({ cyan: preset.cyan, magenta: preset.magenta, purple: preset.purple })) } catch { /* ignore */ }
    try { localStorage.setItem('theme-preset', preset.name) } catch { /* ignore */ }
    addToast(`✓ Preset "${preset.name}" diterapkan`, 'success')
  }, [addToast])

  // Delete a custom preset
  const handleDeletePreset = useCallback((id: string, name: string) => {
    deleteCustomPreset(id)
    setCustomPresets(getCustomPresets())
    addToast(`Preset "${name}" dihapus`, 'info')
  }, [addToast])

  // Import schedule from JSON file
  const scheduleFileRef = useRef<HTMLInputElement>(null)
  const handleImportSchedule = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = importScheduleFromJson(e.target?.result as string)
      if (result.success) {
        // Refresh scheduler view
        const scheduled = getScheduledTheme()
        if (scheduled) setScheduledLabel({ labelId: scheduled.labelId, labelEn: scheduled.labelEn })
        addToast(`✓ ${result.message}`, 'success')
      } else {
        addToast(`Gagal import: ${result.message}`, 'error')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }, [addToast])

  // Export current schedule as JSON file
  const handleExportSchedule = useCallback(() => {
    try {
      const json = exportScheduleToJson()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `zayidan-theme-schedule-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      addToast('✓ Jadwal tema berhasil diexport', 'success')
    } catch {
      addToast('Gagal export jadwal', 'error')
    }
  }, [addToast])

  // Generate QR code for current theme (mobile-friendly sharing)
  const openQrModal = useCallback(() => {
    try {
      const currentTheme = (localStorage.getItem('theme') as Theme) || 'dark'
      const shareUrl = getShareableThemeUrl(currentTheme)
      QRCode.toDataURL(shareUrl, { width: 200, margin: 1, color: { dark: '#0A0A0F', light: '#FFFFFF' } })
        .then((url: string) => {
          setQrDataUrl(url)
          setQrModalOpen(true)
        })
        .catch(() => addToast('Gagal membuat QR code', 'error'))
    } catch {
      addToast('Gagal membuat QR code', 'error')
    }
  }, [addToast])

  // Download QR code as PNG
  const downloadQr = useCallback(() => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `zayidan-theme-qr-${Date.now()}.png`
    a.click()
    addToast('✓ QR code berhasil diunduh', 'success')
  }, [qrDataUrl, addToast])

  // Listen for 'theme:open-qr' event (from CommandPalette) to open QR modal
  useEffect(() => {
    const handler = () => {
      if (!open) setOpen(true)
      setTimeout(() => openQrModal(), 100)
    }
    window.addEventListener('theme:open-qr', handler)
    return () => window.removeEventListener('theme:open-qr', handler)
  }, [open, openQrModal])

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
                onClick={toggleSound}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${soundEnabled ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-secondary)]'}`}
                title={soundEnabled ? 'Matikan suara tema' : 'Nyalakan suara tema'}
                aria-label="Toggle theme sound"
              >
                {soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
              </button>
              <button
                onClick={openQrModal}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors cursor-pointer"
                title="QR code untuk share via mobile"
                aria-label="QR code share"
              >
                <QrCode className="h-3 w-3" />
              </button>
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

            {/* Most Used Theme stat — shows user's theme preference pattern */}
            {(() => {
              const mostUsed = getMostUsedTheme()
              const totalSwitches = Object.values(themeUsage).reduce((a, b) => a + b, 0)
              if (!mostUsed || totalSwitches < 3) return null
              const labels: Record<Theme, { id: string; emoji: string }> = {
                dark: { id: 'Gelap', emoji: '🌙' },
                light: { id: 'Terang', emoji: '☀️' },
                skeuomorphic: { id: 'Cahaya', emoji: '✨' },
                'liquid-glass': { id: 'Liquid', emoji: '💧' },
                'theme-3d': { id: '3D', emoji: '🧊' },
              }
              const label = labels[mostUsed.theme]
              return (
                <div className="border-t border-[var(--glass-border)] pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="h-2.5 w-2.5 text-[var(--text-secondary)]" />
                      <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] tracking-wider uppercase">Tema Favorit</p>
                    </div>
                    <button
                      onClick={handleResetStats}
                      className="w-5 h-5 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-magenta)] transition-colors cursor-pointer"
                      title="Reset statistik tema"
                      aria-label="Reset theme stats"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)]/30">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{label.emoji}</span>
                      <span className="text-[10px] font-mono-custom text-[var(--text-primary)]">{label.id}</span>
                    </div>
                    <span className="text-[9px] font-mono-custom text-[var(--neon-cyan)]">{mostUsed.count}x dipakai</span>
                  </div>
                  <p className="text-[8px] font-mono-custom text-[var(--text-secondary)]/60 mt-1">{totalSwitches}x total pergantian tema</p>

                  {/* Theme usage bar chart — horizontal bars per theme */}
                  {(() => {
                    const themeLabels: Record<Theme, { id: string; emoji: string; color: string }> = {
                      dark: { id: 'Gelap', emoji: '🌙', color: '#00F5FF' },
                      light: { id: 'Terang', emoji: '☀️', color: '#0080FF' },
                      skeuomorphic: { id: 'Cahaya', emoji: '✨', color: '#D4A24C' },
                      'liquid-glass': { id: 'Liquid', emoji: '💧', color: '#C8A0FF' },
                      'theme-3d': { id: '3D', emoji: '🧊', color: '#A78BFA' },
                    }
                    const entries = (Object.keys(themeLabels) as Theme[]).map(t => ({
                      theme: t,
                      count: themeUsage[t] || 0,
                    })).filter(e => e.count > 0).sort((a, b) => b.count - a.count)
                    const maxCount = Math.max(...entries.map(e => e.count), 1)
                    if (entries.length === 0) return null
                    return (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-[8px] font-mono-custom text-[var(--text-secondary)]/60 uppercase tracking-wider">Distribusi</p>
                        {entries.map(e => {
                          const label = themeLabels[e.theme]
                          const pct = (e.count / maxCount) * 100
                          return (
                            <div key={e.theme} className="flex items-center gap-1.5">
                              <span className="text-[10px] w-3 text-center">{label.emoji}</span>
                              <div className="flex-1 h-2 rounded-full bg-[var(--glass-bg)]/40 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${pct}%`,
                                    background: `linear-gradient(90deg, ${label.color}, ${label.color}88)`,
                                    boxShadow: `0 0 4px ${label.color}66`,
                                  }}
                                />
                              </div>
                              <span className="text-[8px] font-mono-custom text-[var(--text-secondary)] w-5 text-right">{e.count}</span>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              )
            })()}

            {/* Theme Scheduler — auto-switch theme based on time of day */}
            <div className="border-t border-[var(--glass-border)] pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CalendarClock className="h-2.5 w-2.5 text-[var(--text-secondary)]" />
                  <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] tracking-wider uppercase">Jadwal Otomatis</p>
                </div>
                <div className="flex items-center gap-1">
                  {!editingSchedule && (
                    <button
                      onClick={startEditSchedule}
                      className="w-5 h-5 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors cursor-pointer"
                      title="Edit jadwal kustom"
                      aria-label="Edit custom schedule"
                    >
                      <Pencil className="h-2.5 w-2.5" />
                    </button>
                  )}
                  <button
                    onClick={toggleScheduler}
                    className={`relative w-7 h-3.5 rounded-full transition-colors cursor-pointer ${scheduleEnabled ? 'bg-[var(--neon-cyan)]/60' : 'bg-[var(--glass-border)]'}`}
                    role="switch"
                    aria-checked={scheduleEnabled}
                    aria-label="Toggle theme scheduler"
                  >
                    <span
                      className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform ${scheduleEnabled ? 'translate-x-3.5' : 'translate-x-0.5'}`}
                    />
                  </button>
                </div>
              </div>

              {/* Edit mode — custom time slots editor */}
              {editingSchedule ? (
                <div className="mt-2 p-2 rounded-md border border-[var(--neon-magenta)]/20 bg-[var(--glass-bg)]/40 space-y-2">
                  <p className="text-[9px] font-mono-custom text-[var(--text-secondary)] uppercase">Edit Slot:</p>
                  {editableSlots.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-[9px] font-mono-custom">
                      <input
                        type="number"
                        min={0}
                        max={23}
                        value={slot.startHour}
                        onChange={(e) => updateSlot(idx, 'startHour', Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                        className="w-7 px-1 py-0.5 rounded border border-[var(--glass-border)] bg-[var(--background)] text-[var(--text-primary)] text-center"
                        aria-label={`Start hour slot ${idx + 1}`}
                      />
                      <span className="text-[var(--text-secondary)]">:00</span>
                      <select
                        value={slot.theme}
                        onChange={(e) => updateSlot(idx, 'theme', e.target.value)}
                        className="flex-1 px-1 py-0.5 rounded border border-[var(--glass-border)] bg-[var(--background)] text-[var(--text-primary)] text-[9px]"
                        aria-label={`Theme slot ${idx + 1}`}
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="skeuomorphic">Cahaya</option>
                        <option value="liquid-glass">Liquid</option>
                        <option value="theme-3d">3D</option>
                      </select>
                      <input
                        type="text"
                        value={slot.labelId}
                        onChange={(e) => updateSlot(idx, 'labelId', e.target.value)}
                        className="w-12 px-1 py-0.5 rounded border border-[var(--glass-border)] bg-[var(--background)] text-[var(--text-primary)] text-[8px]"
                        aria-label={`Label slot ${idx + 1}`}
                        placeholder="Label"
                      />
                      <button
                        onClick={() => removeSlot(idx)}
                        className="w-4 h-4 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-magenta)] transition-colors cursor-pointer"
                        aria-label={`Remove slot ${idx + 1}`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 pt-1">
                    <button
                      onClick={addSlot}
                      className="flex-1 px-1.5 py-0.5 rounded text-[8px] font-mono-custom border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-colors cursor-pointer"
                    >
                      + Tambah Slot
                    </button>
                    <button
                      onClick={saveEditSchedule}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono-custom bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors cursor-pointer"
                      title="Simpan jadwal"
                    >
                      <Save className="h-2.5 w-2.5" /> Simpan
                    </button>
                    <button
                      onClick={cancelEditSchedule}
                      className="px-1.5 py-0.5 rounded text-[8px] font-mono-custom border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={resetEditSchedule}
                      className="w-4 h-4 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-magenta)] transition-colors cursor-pointer"
                      title="Reset ke default"
                      aria-label="Reset schedule to default"
                    >
                      <RotateCcw className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode — show current schedule */
                scheduleEnabled && scheduledLabel && (
                  <div className="mt-2 p-2 rounded-md border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5">
                    <p className="text-[9px] font-mono-custom text-[var(--text-secondary)] mb-1">Periode saat ini:</p>
                    <p className="text-[10px] font-mono-custom text-[var(--neon-cyan)]">{scheduledLabel.labelId}</p>
                    <div className="mt-2 space-y-0.5">
                      {getScheduleInfo().map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-[8px] font-mono-custom">
                          <span className="text-[var(--text-secondary)]/70">{s.labelId}</span>
                          <span className="text-[var(--text-secondary)]">{s.theme}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Export usage chart as PNG */}
            {(() => {
              const total = Object.values(themeUsage).reduce((a, b) => a + b, 0)
              if (total < 1) return null
              return (
                <div className="border-t border-[var(--glass-border)] pt-3">
                  <button
                    onClick={exportChartPng}
                    className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-mono-custom bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors cursor-pointer"
                    title="Export usage chart sebagai PNG"
                  >
                    <ImageDown className="h-3 w-3" />
                    Export Chart PNG
                  </button>
                </div>
              )
            })()}

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

              {/* Save current colors as preset button */}
              <button
                onClick={() => setShowSavePresetDialog(true)}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 mt-2 rounded-md text-[10px] font-mono-custom bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors cursor-pointer"
                title="Simpan warna saat ini sebagai preset"
              >
                <BookmarkPlus className="h-3 w-3" />
                Simpan sebagai Preset
              </button>

              {/* Save preset dialog */}
              {showSavePresetDialog && (
                <div className="mt-2 p-2 rounded-md border border-[var(--neon-magenta)]/20 bg-[var(--glass-bg)]/40 space-y-1.5">
                  <p className="text-[9px] font-mono-custom text-[var(--text-secondary)] uppercase">Nama Preset:</p>
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    maxLength={30}
                    placeholder="cth: Mood Senja"
                    className="w-full px-2 py-1 rounded border border-[var(--glass-border)] bg-[var(--background)] text-[var(--text-primary)] text-[10px] font-mono-custom"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSavePreset(); if (e.key === 'Escape') setShowSavePresetDialog(false) }}
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={handleSavePreset}
                      className="flex-1 flex items-center justify-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono-custom bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors cursor-pointer"
                    >
                      <Save className="h-2.5 w-2.5" /> Simpan
                    </button>
                    <button
                      onClick={() => { setShowSavePresetDialog(false); setNewPresetName('') }}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono-custom border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Presets — user-saved color combinations */}
            {customPresets.length > 0 && (
              <div className="border-t border-[var(--glass-border)] pt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookmarkPlus className="h-2.5 w-2.5 text-[var(--text-secondary)]" />
                  <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] tracking-wider uppercase">Preset Saya ({customPresets.length})</p>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {customPresets.map((preset) => {
                    const isActive = activePreset === preset.name
                    return (
                      <div
                        key={preset.id}
                        className={`group relative rounded-lg border p-1.5 text-center transition-all cursor-pointer overflow-hidden ${isActive ? 'border-[var(--neon-cyan)]/60 shadow-[0_0_10px_var(--neon-cyan)]' : 'border-[var(--glass-border)] hover:border-[var(--neon-cyan)]/40'}`}
                        onClick={() => applyCustomPreset(preset)}
                      >
                        <div className="relative flex gap-0.5 mb-1 justify-center">
                          <span className="w-3 h-3 rounded-full ring-1 ring-black/20" style={{ backgroundColor: preset.cyan }} />
                          <span className="w-3 h-3 rounded-full ring-1 ring-black/20" style={{ backgroundColor: preset.magenta }} />
                          <span className="w-3 h-3 rounded-full ring-1 ring-black/20" style={{ backgroundColor: preset.purple }} />
                        </div>
                        <span className="relative text-[9px] font-mono-custom text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-tight block truncate">
                          {preset.name}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeletePreset(preset.id, preset.name) }}
                          className="absolute top-0.5 right-0.5 w-3 h-3 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-magenta)] transition-colors cursor-pointer"
                          aria-label={`Hapus preset ${preset.name}`}
                        >
                          <X className="h-2 w-2" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Import/Export Schedule JSON */}
            <div className="border-t border-[var(--glass-border)] pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <FileJson className="h-2.5 w-2.5 text-[var(--text-secondary)]" />
                <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] tracking-wider uppercase">Jadwal JSON</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => scheduleFileRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[9px] font-mono-custom bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-colors cursor-pointer"
                  title="Import jadwal dari JSON"
                >
                  <Upload className="h-2.5 w-2.5" /> Import
                </button>
                <input
                  ref={scheduleFileRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImportSchedule}
                  className="hidden"
                  aria-hidden="true"
                />
                <button
                  onClick={handleExportSchedule}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[9px] font-mono-custom bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-colors cursor-pointer"
                  title="Export jadwal ke JSON"
                >
                  <Download className="h-2.5 w-2.5" /> Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal — for mobile theme sharing */}
      {qrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setQrModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="QR Code untuk share tema"
        >
          <div
            className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 max-w-xs w-[90%] text-center shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'var(--card)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-display font-bold text-[var(--text-primary)] tracking-wider">QR TEMA</span>
              <button
                onClick={() => setQrModalOpen(false)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                aria-label="Tutup QR modal"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {qrDataUrl && (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={qrDataUrl}
                  alt="QR code untuk share tema"
                  className="w-44 h-44 rounded-lg border border-[var(--glass-border)] bg-white p-2"
                />
                <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] leading-relaxed">
                  Pindai dengan kamera ponsel untuk membuka portfolio dengan tema yang sama
                </p>
                <button
                  onClick={downloadQr}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono-custom bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors cursor-pointer"
                >
                  <Download className="h-3 w-3" />
                  Unduh QR
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}