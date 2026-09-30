'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Download, MapPin, Eye, Briefcase, Sparkles, TrendingUp, Coins, LineChart, Code2, MessageSquare, Zap, Palette } from 'lucide-react'
import { NeonButton } from '@/components/ui/NeonButton'
import { useLanguageStore } from '@/store/language-store'
import { useCvStore } from '@/store/cv-store'
import { useTilt } from '@/hooks/useTilt'

export function Hero() {
  const { t, lang } = useLanguageStore()
  const { setOpen: setCvOpen } = useCvStore()

  // Full-3D orbit satellites — dua bidang orbit miring (gyroscope)
  const satellitesA = [
    { icon: Coins, color: 'var(--neon-cyan)', glow: 'var(--glow-cyan)' },
    { icon: LineChart, color: 'var(--neon-magenta)', glow: 'var(--glow-magenta)' },
    { icon: Code2, color: 'var(--neon-purple)', glow: '0 0 20px rgba(139,92,246,0.3)' },
  ]
  const satellitesB = [
    { icon: MessageSquare, color: 'var(--neon-magenta)', glow: 'var(--glow-magenta)' },
    { icon: Zap, color: 'var(--neon-cyan)', glow: 'var(--glow-cyan)' },
    { icon: Palette, color: 'var(--neon-purple)', glow: '0 0 20px rgba(139,92,246,0.3)' },
  ]
  const satAngle = (i: number, total: number) => `${Math.round((i / total) * 360)}deg`

  const [glitchDone, setGlitchDone] = useState(false)
  const [displayedTagline, setDisplayedTagline] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
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
      {/* The unified WebGL 3D scene (fixed, behind everything) provides the
          3D ambience for BOTH themes — no per-theme decorations needed here. */}

      {/* Web3 perspective grid floor — holographic depth cue (both themes) */}
      <div className="web3-grid-floor" aria-hidden="true" />

      {/* Floating Web3 3D shapes — rotating holographic geometry */}
      <div aria-hidden="true">
        <span className="web3-shape-wrap web3-shape-1"><span className="web3-shape web3-diamond" /></span>
        <span className="web3-shape-wrap web3-shape-2"><span className="web3-shape web3-ring-shape" /></span>
        <span className="web3-shape-wrap web3-shape-3"><span className="web3-shape web3-plus" /></span>
        <span className="web3-shape-wrap web3-shape-4"><span className="web3-shape web3-diamond" /></span>
      </div>

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
            {/* Greeting — 3D entrance */}
            <motion.p
              initial={{ opacity: 0, y: 20, rotateX: 35, transformPerspective: 800 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, transformPerspective: 800 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-sm sm:text-base font-mono-custom text-[var(--text-secondary)] tracking-[0.25em] uppercase mb-4"
            >
              {t('hero.greeting')}
            </motion.p>

            {/* Name with glitch intro, then modern gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 26, rotateX: 28, transformPerspective: 900 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, transformPerspective: 900 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 ${!glitchDone ? 'glitch-text' : ''}`}
              data-text={t('hero.name')}
            >
              <span className={`hero-name-shimmer ${glitchDone ? 'holo-text' : ''}`}>{t('hero.name')}</span>
            </motion.h1>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20, rotateX: 25, transformPerspective: 800 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, transformPerspective: 800 }}
              transition={{ duration: 0.7, delay: 0.6 }}
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
              initial={{ opacity: 0, y: 20, rotateX: 25, transformPerspective: 800 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, transformPerspective: 800 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono-custom text-[var(--text-secondary)] glass glass-depth-sm border border-[var(--glass-border)] tracking-wider">
                <MapPin className="h-3 w-3 text-[var(--neon-cyan)]" />
                {t('hero.location')}
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24, rotateX: 25, transformPerspective: 800 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, transformPerspective: 800 }}
              transition={{ duration: 0.7, delay: 1.0 }}
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
            initial={{ opacity: 0, scale: 0.86, rotateY: -18, transformPerspective: 1100 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, transformPerspective: 1100 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

              {/* FULL 3D ORBIT SATELLITES — gyroscope ganda mengelilingi foto.
                  Chip counter-rotate agar ikon selalu menghadap pembaca. */}
              <div className="hero-orbit-stage" aria-hidden="true">
                <div className="hero-orbit-wrap hero-orbit-wrap-a">
                  <div className="hero-orbit-spin hero-orbit-spin-a">
                    {satellitesA.map((sat, i) => {
                      const Icon = sat.icon
                      return (
                        <span
                          key={`sat-a-${i}`}
                          className="hero-sat"
                          style={{ '--a': satAngle(i, satellitesA.length), '--r': '195px' } as React.CSSProperties}
                        >
                          <span className="hero-sat-pre">
                            <span className="hero-sat-cc-a">
                              <span className="hero-sat-chip" style={{ borderColor: 'color-mix(in srgb, ' + sat.color + ' 35%, transparent)', boxShadow: sat.glow }}>
                                <Icon className="h-4 w-4" style={{ color: sat.color }} />
                              </span>
                            </span>
                          </span>
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className="hero-orbit-wrap hero-orbit-wrap-b">
                  <div className="hero-orbit-spin hero-orbit-spin-b">
                    {satellitesB.map((sat, i) => {
                      const Icon = sat.icon
                      return (
                        <span
                          key={`sat-b-${i}`}
                          className="hero-sat"
                          style={{ '--a': satAngle(i, satellitesB.length), '--r': '225px' } as React.CSSProperties}
                        >
                          <span className="hero-sat-pre">
                            <span className="hero-sat-cc-b">
                              <span className="hero-sat-chip" style={{ borderColor: 'color-mix(in srgb, ' + sat.color + ' 35%, transparent)', boxShadow: sat.glow }}>
                                <Icon className="h-4 w-4" style={{ color: sat.color }} />
                              </span>
                            </span>
                          </span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
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
