'use client'

/**
 * Theme Switch Sound Effect
 * Generates a short, pleasant "click" sound using the Web Audio API
 * when the user switches themes. Respects a localStorage toggle ('theme-sound')
 * so users can disable it if they prefer silent switching.
 */

const STORAGE_KEY = 'theme-sound-enabled'
const DEFAULT_ENABLED = true

let audioCtxSingleton: AudioContext | null = null

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtxSingleton) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return null
    audioCtxSingleton = new AudioCtx()
  }
  // Resume if suspended (autoplay policy)
  if (audioCtxSingleton.state === 'suspended') {
    audioCtxSingleton.resume().catch(() => { /* ignore */ })
  }
  return audioCtxSingleton
}

export function isThemeSoundEnabled(): boolean {
  if (typeof window === 'undefined') return DEFAULT_ENABLED
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === null ? DEFAULT_ENABLED : v === '1'
  } catch {
    return DEFAULT_ENABLED
  }
}

export function setThemeSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
  } catch { /* ignore */ }
}

/**
 * Play a short click/chime sound for theme switching.
 * The pitch varies by theme so each theme has its own "signature" tone.
 */
export function playThemeSwitchSound(theme: string) {
  if (!isThemeSoundEnabled()) return
  const ctx = getAudioCtx()
  if (!ctx) return

  // Pitch map per theme (Hz) — gives each theme a distinct signature
  const pitchMap: Record<string, number> = {
    dark: 220,          // A3 — low, calm
    light: 440,         // A4 — bright
    skeuomorphic: 330,  // E4 — warm
    'liquid-glass': 392, // G4 — soft
    'theme-3d': 277,    // C#4 — deep
  }
  const baseFreq = pitchMap[theme] || 330

  try {
    const now = ctx.currentTime
    // Short sine "click" with quick decay
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(baseFreq, now)
    // Subtle pitch sweep up for a "rising chime" feel
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 0.01)  // quick attack
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18) // fast decay

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.2)

    // Add a soft harmonic for warmth
    const osc2 = ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(baseFreq * 2, now)
    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(0.03, now + 0.01)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now)
    osc2.stop(now + 0.18)
  } catch {
    // ignore audio errors (e.g., user gesture requirement not met)
  }
}
