'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Download, MapPin, Eye } from 'lucide-react'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { NeonButton } from '@/components/ui/NeonButton'
import { useLanguageStore } from '@/store/language-store'
import { useCvStore } from '@/store/cv-store'
import { useTheme } from 'next-themes'

export function Hero() {
  const { t, lang } = useLanguageStore()
  const { setOpen: setCvOpen } = useCvStore()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const [glitchDone, setGlitchDone] = useState(false)
  const [displayedTagline, setDisplayedTagline] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [imgSrc, setImgSrc] = useState('/zayidan-photo.png')
  const isDark = theme === 'dark'
  const parallaxRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-15, 15])

  // Multi-line typing effect refs
  const lineIndexRef = useRef(0)
  const charIndexRef = useRef(0)
  const isDeletingRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const taglinesRef = useRef<string[]>([])
  const startedRef = useRef(false)

  const clearTypingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  // Glitch timer
  useEffect(() => {
    const glitchTimer = setTimeout(() => setGlitchDone(true), 1000)
    return () => clearTimeout(glitchTimer)
  }, [])

  // Main typing loop
  useEffect(() => {
    // Update taglines when lang changes
    taglinesRef.current = [
      t('hero.tagline'),
      t('hero.tagline2'),
      t('hero.tagline3'),
    ]
  }, [lang, t])

  useEffect(() => {
    const startDelay = setTimeout(() => {
      startedRef.current = true
      lineIndexRef.current = 0
      charIndexRef.current = 0
      isDeletingRef.current = false
      setDisplayedTagline('')
      setTypingDone(false)

      const tick = () => {
        const taglines = taglinesRef.current
        if (!taglines.length) { timeoutRef.current = setTimeout(tick, 100); return }

        const currentLine = taglines[lineIndexRef.current % taglines.length]

        if (!isDeletingRef.current) {
          // Typing forward
          charIndexRef.current++
          setDisplayedTagline(currentLine.slice(0, charIndexRef.current))

          if (charIndexRef.current >= currentLine.length) {
            setTypingDone(true)
            // Pause 2s at full text
            timeoutRef.current = setTimeout(() => {
              isDeletingRef.current = true
              tick()
            }, 2000)
            return
          }
          // Continue typing at 60ms
          timeoutRef.current = setTimeout(tick, 60)
        } else {
          // Deleting
          charIndexRef.current--
          setDisplayedTagline(currentLine.slice(0, charIndexRef.current))
          setTypingDone(false)

          if (charIndexRef.current <= 0) {
            isDeletingRef.current = false
            lineIndexRef.current = (lineIndexRef.current + 1) % taglines.length
            // Pause 500ms before next line
            timeoutRef.current = setTimeout(tick, 500)
            return
          }
          // Continue deleting at 30ms
          timeoutRef.current = setTimeout(tick, 30)
        }
      }

      tick()
    }, 1200)

    return () => {
      clearTimeout(startDelay)
      clearTypingTimeout()
    }
  }, [lang, clearTypingTimeout])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      ref={parallaxRef}
    >
      {/* Particle Background */}
      <ParticleBackground />

      {/* ===== HERO-SPECIFIC LIGHT MODE ANIMATED ELEMENTS ===== */}
      {mounted && !isDark && (
        <>
          <div
            className="absolute hidden sm:block"
            style={{
              top: '12%', left: '5%', width: '140px', height: '140px',
              border: '2px solid rgba(0, 128, 255, 0.08)',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              animation: 'float-geometric 14s ease-in-out infinite',
            }}
          />
          <div
            className="absolute hidden sm:block"
            style={{
              top: '55%', right: '8%', width: '100px', height: '100px',
              border: '2px solid rgba(204, 0, 136, 0.07)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              animation: 'float-geometric 11s ease-in-out infinite reverse',
            }}
          />
          <div
            className="absolute hidden md:block"
            style={{
              bottom: '15%', left: '18%', width: '70px', height: '70px',
              border: '2px solid rgba(109, 40, 217, 0.06)',
              transform: 'rotate(45deg)',
              animation: 'float-geometric 16s ease-in-out infinite',
              animationDelay: '-4s',
            }}
          />
          <div
            className="absolute hidden lg:block"
            style={{
              top: '25%', right: '20%', width: '100px', height: '100px',
              border: '1.5px solid rgba(0, 200, 150, 0.06)',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              animation: 'float-geometric 18s ease-in-out infinite',
              animationDelay: '-7s',
            }}
          />

          {/* Hero orbit rings */}
          <div className="absolute hidden lg:block" style={{ top: '50%', left: '50%', width: '500px', height: '500px', marginTop: '-250px', marginLeft: '-250px', border: '1px solid rgba(0, 128, 255, 0.06)', borderRadius: '50%', animation: 'orbit-spin 45s linear infinite' }} />
          <div className="absolute hidden lg:block" style={{ top: '50%', left: '50%', width: '700px', height: '700px', marginTop: '-350px', marginLeft: '-350px', border: '1px solid rgba(204, 0, 136, 0.04)', borderRadius: '50%', animation: 'orbit-spin 60s linear infinite reverse' }} />
          <div className="absolute hidden xl:block" style={{ top: '50%', left: '50%', width: '900px', height: '900px', marginTop: '-450px', marginLeft: '-450px', border: '1px solid rgba(109, 40, 217, 0.03)', borderRadius: '50%', animation: 'orbit-spin 80s linear infinite' }} />

          {/* Orbit dots */}
          <div className="absolute hidden lg:block" style={{ top: '50%', left: '50%', width: '500px', height: '500px', marginTop: '-250px', marginLeft: '-250px', animation: 'orbit-spin 45s linear infinite' }}>
            <div style={{ position: 'absolute', top: '-4px', left: '50%', width: '8px', height: '8px', background: 'rgba(0, 128, 255, 0.5)', borderRadius: '50%', boxShadow: '0 0 12px rgba(0, 128, 255, 0.7)', transform: 'translateX(-50%)' }} />
          </div>
          <div className="absolute hidden lg:block" style={{ top: '50%', left: '50%', width: '700px', height: '700px', marginTop: '-350px', marginLeft: '-350px', animation: 'orbit-spin 60s linear infinite reverse' }}>
            <div style={{ position: 'absolute', top: '-3px', left: '50%', width: '6px', height: '6px', background: 'rgba(204, 0, 136, 0.4)', borderRadius: '50%', boxShadow: '0 0 10px rgba(204, 0, 136, 0.6)', transform: 'translateX(-50%)' }} />
          </div>
          <div className="absolute hidden xl:block" style={{ top: '50%', left: '50%', width: '900px', height: '900px', marginTop: '-450px', marginLeft: '-450px', animation: 'orbit-spin 80s linear infinite' }}>
            <div style={{ position: 'absolute', bottom: '-3px', left: '50%', width: '6px', height: '6px', background: 'rgba(109, 40, 217, 0.4)', borderRadius: '50%', boxShadow: '0 0 10px rgba(109, 40, 217, 0.6)', transform: 'translateX(-50%)' }} />
          </div>

          {/* Data stream lines */}
          <div className="absolute hidden md:block" style={{ left: '15%', height: '200px', width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(0, 128, 255, 0.12), transparent)', animation: 'data-stream 7s linear infinite' }} />
          <div className="absolute hidden md:block" style={{ left: '45%', height: '150px', width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(204, 0, 136, 0.1), transparent)', animation: 'data-stream 9s linear infinite', animationDelay: '-2.5s' }} />
          <div className="absolute hidden md:block" style={{ right: '15%', height: '180px', width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(109, 40, 217, 0.1), transparent)', animation: 'data-stream 6s linear infinite', animationDelay: '-4s' }} />
        </>
      )}

      {/* Grid Overlay (dark mode) */}
      {mounted && isDark && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(var(--neon-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--neon-cyan) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      )}

      {/* HUD Corner Brackets */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[var(--neon-cyan)] opacity-30 hidden sm:block" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[var(--neon-cyan)] opacity-30 hidden sm:block" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[var(--neon-magenta)] opacity-30 hidden sm:block" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[var(--neon-magenta)] opacity-30 hidden sm:block" />

      {/* Content */}
      <motion.div 
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-transform duration-300 ease-out" 
        style={{ transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)`, y }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base font-mono-custom text-[var(--text-secondary)] tracking-[0.25em] uppercase mb-4"
            >
              {t('hero.greeting')}
            </motion.p>

            {/* Name with glitch effect */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 ${!glitchDone ? 'glitch-text' : ''}`}
              data-text={t('hero.name')}
            >
              <span className="hero-name-shimmer">{t('hero.name')}</span>
            </motion.h1>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono-custom tracking-wider border border-[var(--neon-magenta)]/30 shadow-[var(--glow-magenta)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-magenta)] animate-pulse" />
                <span className="text-[var(--neon-magenta)]">{t('hero.role')}</span>
              </span>

              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono-custom tracking-wider border border-green-500/30 shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-green-400">{t('hero.available')}</span>
              </span>
            </motion.div>

            {/* Tagline with multi-line typing effect */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mb-6 leading-relaxed min-h-[1.75rem] sm:min-h-[2rem]"
            >
              {displayedTagline}
              <motion.span
                animate={{ opacity: typingDone ? [1, 0] : 1 }}
                transition={{ duration: 0.6, repeat: typingDone ? Infinity : 0, repeatType: 'reverse' }}
                className="inline-block w-[2px] h-[1em] bg-[var(--neon-cyan)] ml-0.5 align-middle typing-cursor-glow"
              />
            </motion.p>

            {/* Location Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono-custom text-[var(--text-secondary)] glass border border-[var(--glass-border)] tracking-wider">
                <MapPin className="h-3 w-3 text-[var(--neon-cyan)]" />
                {t('hero.location')}
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full"
            >
              <NeonButton variant="primary" onClick={() => scrollTo('contact')}>
                {t('hero.ctaContact')}
              </NeonButton>
              <NeonButton variant="secondary" onClick={() => setCvOpen(true)}>
                <Eye className="h-4 w-4" />
                {t('hero.readCV')}
              </NeonButton>
              <NeonButton variant="secondary" href={lang === 'en' ? "/CV_ZAYIDAN_MUTTAQIN_EN.pdf" : "/CV_ZAYIDAN_MUTTAQIN.pdf"} download>
                <Download className="h-4 w-4" />
                {t('hero.downloadCV')}
              </NeonButton>
            </motion.div>
          </div>

          {/* Right Column: Cyber Avatar Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-5 flex justify-center items-center w-full"
          >
            <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[320px] lg:h-[320px] xl:w-[360px] xl:h-[360px] shrink-0">
              {/* HUD Brackets */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[var(--neon-cyan)] z-10" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[var(--neon-cyan)] z-10" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[var(--neon-magenta)] z-10" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[var(--neon-magenta)] z-10" />

              {/* Glowing decorative circles */}
              <div className="absolute -inset-4 rounded-full border border-[var(--neon-cyan)]/10 animate-[spin_25s_linear_infinite]" />
              <div className="absolute -inset-8 rounded-full border border-[var(--neon-magenta)]/5 animate-[spin_35s_linear_infinite_reverse]" />

              {/* Gradient Border and Avatar */}
              <div className="avatar-gradient-border w-full h-full rounded-2xl overflow-hidden p-[3px]">
                <div className="avatar-inner w-full h-full rounded-2xl overflow-hidden bg-zinc-950/80 relative">
                  <Image
                    src={imgSrc}
                    alt="Zayidan Muttaqin"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-all duration-700 hover:scale-105"
                    onError={() => {
                      // Fallback to high-quality business portrait if local photo is corrupted/empty
                      setImgSrc('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500&h=500')
                    }}
                    referrerPolicy="no-referrer"
                    priority
                  />
                  {/* Digital scanner line effect via Framer Motion */}
                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 h-[2px] bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)] z-10"
                  />
                </div>
              </div>

              {/* Outer pulsing border overlay */}
              <div className="absolute inset-0 rounded-2xl border-2 border-[var(--neon-cyan)]/20 pointer-events-none animate-pulse z-10" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollTo('about')}
        aria-label={t('hero.scrollDown')}
      >
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[10px] font-mono-custom text-[var(--neon-cyan)] tracking-[0.3em] uppercase"
        >
          {t('hero.scroll')}
        </motion.span>
        <div className="flex flex-col gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.1, 0.8, 0.1], scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
              className="w-4 h-[2px] bg-[var(--neon-cyan)] rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}