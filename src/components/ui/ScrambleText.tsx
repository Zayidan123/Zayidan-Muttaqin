'use client'
import { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'

export function ScrambleText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [displayed, setDisplayed] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })
  const hasScrambled = useRef(false)

  useEffect(() => {
    if (!inView) return

    // After initial scramble, just update text directly (e.g. language switch)
    if (hasScrambled.current) {
      setDisplayed(text)
      return
    }

    hasScrambled.current = true
    setIsScrambling(true)

    let frame = 0
    const totalFrames = text.length * 2 + 10
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++
        if (frame >= totalFrames) {
          setDisplayed(text)
          setIsScrambling(false)
          clearInterval(interval)
          return
        }
        setDisplayed(
          text
            .split('')
            .map((char, i) => {
              if (frame > i * 2 + 5) return char
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        )
      }, 30)
      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [inView, text, delay])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {displayed}
    </span>
  )
}