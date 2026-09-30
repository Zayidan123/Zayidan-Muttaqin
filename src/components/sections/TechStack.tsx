'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguageStore } from '@/store/language-store'
import { useTheme } from '@/lib/theme'
import { ScrambleText } from '@/components/ui/ScrambleText'

const innerSkills = ['sales', 'leadership', 'communication', 'negotiation'] as const
const outerSkills = ['capcut', 'canva', 'ai', 'finance', 'computer', 'python', 'softwareDev'] as const

const innerColors = ['var(--neon-cyan)', 'var(--neon-magenta)', 'var(--neon-purple)', 'var(--neon-cyan)'] as const

export function TechStack() {
  const { t } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const tiltRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  // Scroll-linked orbital tilt: the whole galaxy leans as you scroll past
  const { scrollYProgress } = useScroll({ target: tiltRef, offset: ['start end', 'end start'] })
  const orbitTilt = useTransform(scrollYProgress, [0, 0.5, 1], [10, 2, -8])
  const orbitScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.95])

  return <TechStack3D t={t} inView={inView} ref={ref} tiltRef={tiltRef} orbitTilt={prefersReduced ? undefined : orbitTilt} orbitScale={prefersReduced ? undefined : orbitScale} />
}

/* ===== 3D Tech Stack: Orbital with Counter-Rotation (text always readable) ===== */
function TechStack3D({ t, inView, ref, tiltRef, orbitTilt, orbitScale }: { t: (k: string) => string; inView: boolean; ref: React.RefObject<HTMLDivElement | null>; tiltRef: React.RefObject<HTMLDivElement | null>; orbitTilt?: MotionValue<number>; orbitScale?: MotionValue<number> }) {
  // Position outer skills in an ellipse (7 items)
  const outerPositions = outerSkills.map((_, i) => {
    const angle = (i / outerSkills.length) * Math.PI * 2 - Math.PI / 2
    const rx = 300
    const ry = 105
    return {
      x: Math.cos(angle) * rx,
      y: Math.sin(angle) * ry,
      z: Math.sin(angle) * 60,
      delay: i * (40 / outerSkills.length),
    }
  })

  // Position inner skills in a smaller ellipse (4 items)
  const innerPositions = innerSkills.map((_, i) => {
    const angle = (i / innerSkills.length) * Math.PI * 2 - Math.PI / 2
    const rx = 200
    const ry = 75
    return {
      x: Math.cos(angle) * rx,
      y: Math.sin(angle) * ry,
      z: Math.sin(angle) * 45,
      delay: i * (35 / innerSkills.length),
    }
  })

  return (
    <section id="techstack" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 18, transformPerspective: 900 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0, transformPerspective: 900 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 holo-text">
            <ScrambleText text={t('techstack.title')} />
          </h2>
          <div className="section-title-line mx-auto" />
          <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            {t('techstack.subtitle')}
          </p>
        </motion.div>

        {/* 3D Orbital Container — leans with scroll like a holographic gyroscope */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateX: 16, transformPerspective: 900 }}
          animate={inView ? { opacity: 1, scale: 1, rotateX: 0, transformPerspective: 900 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex items-center justify-center tech-3d-orbit-scaler"
          style={{ minHeight: '540px', perspective: '900px' }}
        >
          {/* Scroll-driven gyroscopic tilt layer */}
          <motion.div
            ref={tiltRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ rotateX: orbitTilt, scale: orbitScale, transformPerspective: 1100 }}
          >
          {/* Ambient twinkling particles scattered around the orbit */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {[
              { top: '12%', left: '20%', delay: '0s' },
              { top: '22%', left: '82%', delay: '1.4s' },
              { top: '68%', left: '12%', delay: '2.3s' },
              { top: '80%', left: '76%', delay: '0.9s' },
              { top: '40%', left: '6%',  delay: '3.2s' },
              { top: '55%', left: '92%', delay: '1.8s' },
            ].map((p, i) => (
              <span key={i} className="twinkle-dot" style={{ top: p.top, left: p.left, animationDelay: p.delay, background: i % 2 ? 'var(--neon-magenta)' : 'var(--neon-cyan)' }} />
            ))}
          </div>

          {/* Outer orbit ring visual — dashed + slowly precessing */}
          <div
            className="absolute tech-3d-ring-line tech-3d-orbit-scaler-ring spin-slowest"
            style={{
              width: 640,
              height: 240,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotateX(25deg)',
              borderStyle: 'dashed',
            }}
          />

          {/* Inner orbit ring visual — counter-precessing */}
          <div
            className="absolute tech-3d-ring-line tech-3d-orbit-scaler-ring"
            style={{
              width: 420,
              height: 160,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotateX(25deg)',
              borderColor: 'rgba(255, 45, 170, 0.08)',
              boxShadow: '0 0 15px rgba(255, 45, 170, 0.04)',
            }}
          />

          {/* Outer Ring — container orbits, each item counter-rotates to stay upright */}
          <div
            className="absolute tech-3d-orbit-outer"
            style={{
              width: 640,
              height: 240,
              top: '50%',
              left: '50%',
              marginTop: -120,
              marginLeft: -320,
              transformStyle: 'preserve-3d',
            }}
          >
            {outerSkills.map((skill, idx) => {
              const pos = outerPositions[idx]!
              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + idx * 0.08 }}
                  className="absolute tech-3d-counter-outer"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: pos.x,
                    marginTop: pos.y,
                    transform: `translateZ(${pos.z}px)`,
                    animationDelay: `${-pos.delay}s`,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                    className="px-3.5 py-2 rounded-lg glass border border-[var(--glass-border)] whitespace-nowrap"
                  >
                    <span className="text-[11px] font-mono-custom text-[var(--text-secondary)]">
                      {t(`techstack.${skill}`)}
                    </span>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          {/* Inner Ring — counter-rotates opposite direction */}
          <div
            className="absolute tech-3d-orbit-inner"
            style={{
              width: 420,
              height: 160,
              top: '50%',
              left: '50%',
              marginTop: -80,
              marginLeft: -210,
              transformStyle: 'preserve-3d',
            }}
          >
            {innerSkills.map((skill, idx) => {
              const pos = innerPositions[idx]!
              const color = innerColors[idx]!
              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                  className="absolute tech-3d-counter-inner"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: pos.x,
                    marginTop: pos.y,
                    transform: `translateZ(${pos.z}px)`,
                    animationDelay: `${-pos.delay}s`,
                  }}
                >
                  <div
                    className="px-5 py-2.5 rounded-xl glass border whitespace-nowrap transition-all duration-300 group cursor-default"
                    style={{ borderColor: `${color}33`, boxShadow: `0 0 15px ${color}11` }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = `${color}66`
                      el.style.boxShadow = `0 0 25px ${color}33`
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = `${color}33`
                      el.style.boxShadow = `0 0 15px ${color}11`
                    }}
                  >
                    <span className="text-xs font-display tracking-wider font-medium" style={{ color }}>
                      {t(`techstack.${skill}`)}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Center Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 200 }}
            className="absolute tech-3d-center-core"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) translateZ(30px)',
              zIndex: 10,
            }}
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center holo-ring holo-ring-always ambient-float-sm">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full border border-[var(--neon-cyan)]/20" style={{ animation: 'pulse-3d 3s ease-in-out infinite' }} />
              <div className="absolute inset-2 rounded-full border border-[var(--neon-magenta)]/15" style={{ animation: 'pulse-3d 3s ease-in-out infinite 0.5s' }} />
              <div className="absolute inset-4 rounded-full border border-[var(--neon-purple)]/10" style={{ animation: 'pulse-3d 3s ease-in-out infinite 1s' }} />
              {/* Rotating dashed gyro ring */}
              <div className="absolute -inset-3 rounded-full border border-dashed border-[var(--neon-cyan)]/15 spin-slower" />
              {/* Core glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--neon-cyan)]/10 via-transparent to-[var(--neon-magenta)]/10 blur-md glow-breathe" />
              {/* Core text */}
              <div className="relative text-center">
                <span className="block text-[10px] font-mono-custom text-[var(--neon-cyan)] tracking-[0.2em] uppercase">{t('techstack.innerRing')}</span>
                <span className="block text-lg sm:text-xl font-display font-bold text-[var(--text-primary)] mt-0.5" style={{ textShadow: '0 0 20px rgba(0, 245, 255, 0.5)' }}>ZM</span>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}