'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Download, MapPin, Eye, Briefcase, Sparkles, TrendingUp } from 'lucide-react'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { NeonButton } from '@/components/ui/NeonButton'
import { useLanguageStore } from '@/store/language-store'
import { useCvStore } from '@/store/cv-store'
import { useTheme } from '@/lib/theme'
import { useTilt } from '@/hooks/useTilt'

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
  const isDark = theme === 'dark'
  const parallaxRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-15, 15])

  // 3D tilt for the photo card
  const tilt = useTilt(10)

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
      {/* Particle background — on dark theme the WebGL 3D scene takes over */}
      {mounted && !isDark && <ParticleBackground />}

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

      {/* Content */}
      {/* SEO: visually-hidden description for search engines (keyword-rich) */}
      <p className="sr-only" aria-hidden="false">
        Zayidan Muttaqin — portfolio profesional Sales, Leadership, dan Communication Expert di Banyuwangi, Indonesia.
        Berpengalaman sebagai Sales Promotion Boy, Store Associate, Sales Clerk, Store Manager, dan Pramuniaga.
        Keahlian: Customer Service, Visual Merchandising, Stock Logistics, Retail Management, Negotiation, Communication,
        Video Editing (CapCut), Graphic Design (Canva), AI Prompting, Financial Markets, Python Programming.
        Tersedia untuk peluang kerja freelance, remote, maupun full-time di Banyuwangi dan sekitarnya.
      </p>
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

            {/* Name with glitch intro, then modern gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 ${!glitchDone ? 'glitch-text' : ''}`}
              data-text={t('hero.name')}
            >
              <span className={`hero-name-shimmer ${glitchDone ? 'title-gradient-3d' : ''}`}>{t('hero.name')}</span>
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

              <motion.span
                animate={{ opacity: typingDone ? [1, 0] : 1 }}
                transition={{ duration: 0.6, repeat: typingDone ? Infinity : 0, repeatType: 'reverse' }}
                className="inline-block w-[2px] h-[1em] bg-[var(--neon-cyan)] ml-0.5 align-middle typing-cursor-glow"
              />
            </motion.div>

            {/* Location Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono-custom text-[var(--text-secondary)] glass glass-depth-sm border border-[var(--glass-border)] tracking-wider">
                <MapPin className="h-3 w-3 text-[var(--neon-cyan)]" />
                {t('hero.location')}
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex w-full flex-col flex-wrap items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-start sm:gap-4 lg:justify-start"
            >
              <NeonButton variant="primary" onClick={() => scrollTo('contact')} className="w-full sm:w-auto btn-depth">
                {t('hero.ctaContact')}
              </NeonButton>
              <NeonButton variant="secondary" onClick={() => setCvOpen(true)} className="w-full sm:w-auto btn-depth">
                <Eye className="h-4 w-4" />
                {t('hero.readCV')}
              </NeonButton>
              <NeonButton variant="secondary" href={lang === 'en' ? "/CV_ZAYIDAN_MUTTAQIN_EN.pdf" : "/CV_ZAYIDAN_MUTTAQIN.pdf"} download className="w-full sm:w-auto btn-depth">
                <Download className="h-4 w-4" />
                {t('hero.downloadCV')}
              </NeonButton>
            </motion.div>
          </div>

          {/* Right Column: Modern 3D Photo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="order-first lg:order-none lg:col-span-5 mb-8 lg:mb-0 flex justify-center items-center w-full"
          >
            <div className="hero-3d-stage relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[320px] lg:h-[320px] xl:w-[360px] xl:h-[360px] shrink-0">
              {/* Ambient aura glow behind the card */}
              <div className="hero-3d-aura" aria-hidden="true" />

              {/* The tilt card itself */}
              <div
                ref={tilt.ref}
                onMouseMove={tilt.handleMouseMove}
                onMouseLeave={tilt.handleMouseLeave}
                className="hero-3d-card relative w-full h-full rounded-3xl"
              >
                {/* Gradient Border and Photo */}
                <div className="avatar-gradient-border w-full h-full rounded-3xl overflow-hidden p-[3px] glass-depth">
                  <div className="avatar-inner w-full h-full rounded-3xl overflow-hidden bg-zinc-950/80 relative">
                    <Image
                      src="/zayidan-photo.png"
                      alt="Zayidan Muttaqin — Sales & Leadership Professional di Banyuwangi"
                      fill
                      priority
                      sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 360px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    {/* Soft depth gradient at the bottom of the photo */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none z-[5]"
                      style={{ background: 'linear-gradient(to top, rgba(5,5,16,0.55), transparent)' }}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Glare overlay — light reflection follows the cursor */}
                <div className="tilt-glare rounded-3xl" aria-hidden="true" />

                {/* Floating glass chips — layered in real Z-space */}
                <div className="chip-3d chip-3d-a" aria-hidden="true">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">{t('footer.online')}</span>
                </div>

                <div className="chip-3d chip-3d-b" aria-hidden="true">
                  <TrendingUp className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
                  <span className="text-[var(--text-primary)] font-medium">
                    {t('stats.experience.value')} {t('stats.experience.label')}
                  </span>
                </div>

                <div className="chip-3d chip-3d-c" aria-hidden="true">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--neon-magenta)]" />
                  <span className="text-[var(--text-primary)] font-medium">{t('footer.tagline')}</span>
                </div>
              </div>

              {/* Orbiting accent rings (outside the tilt card, subtle) */}
              <div className="absolute -inset-6 rounded-full border border-[var(--neon-cyan)]/8 pointer-events-none animate-[spin_40s_linear_infinite]" aria-hidden="true" />
              <div className="absolute -inset-10 rounded-full border border-[var(--neon-magenta)]/5 pointer-events-none animate-[spin_55s_linear_infinite_reverse]" aria-hidden="true" />
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
