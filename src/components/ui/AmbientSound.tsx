'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Volume2, X } from 'lucide-react'
import { useLanguageStore } from '@/store/language-store'

export function AmbientSound() {
  const [playing, setPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<OscillatorNode[]>([])
  const gainRef = useRef<GainNode | null>(null)
  const { t } = useLanguageStore()

  const startSound = useCallback(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    audioCtxRef.current = ctx

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.06
    masterGain.connect(ctx.destination)
    gainRef.current = masterGain

    const frequencies = [80, 120, 160, 200]
    const oscillators: OscillatorNode[] = []

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      oscGain.gain.value = 0.3 - i * 0.06
      osc.connect(oscGain)
      oscGain.connect(masterGain)
      osc.start()
      oscillators.push(osc)
    })

    nodesRef.current = oscillators
  }, [])

  const stopSound = useCallback(() => {
    nodesRef.current.forEach((osc) => {
      try { osc.stop() } catch { /* already stopped */ }
    })
    nodesRef.current = []
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
    gainRef.current = null
  }, [])

  const toggle = useCallback(() => {
    if (playing) {
      stopSound()
      setPlaying(false)
    } else {
      startSound()
      setPlaying(true)
    }
  }, [playing, startSound, stopSound])

  useEffect(() => {
    return () => {
      nodesRef.current.forEach((osc) => {
        try { osc.stop() } catch { /* already stopped */ }
      })
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 left-6 z-40 w-9 h-9 rounded-lg glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)] hover:shadow-[var(--glow-cyan)] cursor-pointer"
      aria-label={t('ambientSound.tooltip')}
    >
      {playing ? <X className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  )
}