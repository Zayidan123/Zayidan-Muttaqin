'use client'

import { useEffect, useRef } from 'react'
import { useToastStore } from '@/store/toast-store'
import { useLanguageStore } from '@/store/language-store'

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
]

export function KonamiEasterEgg() {
  const addToast = useToastStore((s) => s.addToast)
  const t = useLanguageStore((s) => s.t)
  const activated = useRef(false)
  const sequence = useRef<string[]>([])

  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.textContent = `
      body.konami-glow {
        animation: konami-neon-glow 1.5s ease-in-out infinite alternate;
      }
      body.konami-glow * {
        text-shadow: 0 0 8px var(--neon-cyan), 0 0 16px var(--neon-magenta) !important;
      }
      @keyframes konami-neon-glow {
        0% { box-shadow: inset 0 0 60px rgba(0, 245, 255, 0.15), inset 0 0 120px rgba(255, 0, 170, 0.1); }
        100% { box-shadow: inset 0 0 60px rgba(255, 0, 170, 0.15), inset 0 0 120px rgba(139, 92, 246, 0.1); }
      }
    `
    document.head.appendChild(styleEl)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activated.current) return

      sequence.current.push(e.code)
      if (sequence.current.length > KONAMI_CODE.length) {
        sequence.current.shift()
      }

      const match = sequence.current.length === KONAMI_CODE.length &&
        sequence.current.every((key, i) => key === KONAMI_CODE[i])

      if (match) {
        activated.current = true

        addToast(t('konami.activated'), 'success')

        document.body.classList.add('konami-glow')

        setTimeout(() => {
          document.body.classList.remove('konami-glow')
          activated.current = false
        }, 5000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.head.removeChild(styleEl)
    }
  }, [addToast, t])

  return null
}