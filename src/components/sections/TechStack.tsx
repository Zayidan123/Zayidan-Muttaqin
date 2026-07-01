'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguageStore } from '@/store/language-store'
import { useTheme } from 'next-themes'
import { ScrambleText } from '@/components/ui/ScrambleText'

const innerSkills = ['sales', 'leadership', 'communication', 'negotiation'] as const
const outerSkills = ['capcut', 'canva', 'ai', 'finance', 'computer', 'python', 'softwareDev'] as const

const innerColors = ['var(--neon-cyan)', 'var(--neon-magenta)', 'var(--neon-purple)', 'var(--neon-cyan)'] as const

export function TechStack() {
  const { t } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return <TechStack3D t={t} inView={inView} ref={ref} />
}

/* ===== 3D Tech Stack: Orbital with Counter-Rotation (text always readable) ===== */
function TechStack3D({ t, inView, ref }: { t: (k: string) => string; inView: boolean; ref: React.RefObject<HTMLDivElement | null> }) {
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
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            <ScrambleText text={t('techstack.title')} />
          </h2>
          <div className="section-title-line mx-auto" />
          <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            {t('techstack.subtitle')}
          </p>
        </motion.div>

        {/* 3D Orbital Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex items-center justify-center tech-3d-orbit-scaler"
          style={{ minHeight: '540px', perspective: '900px', transition: 'transform 0.3s ease' }}
        >
          {/* Outer orbit ring visual */}
          <div
            className="absolute tech-3d-ring-line tech-3d-orbit-scaler-ring"
            style={{
              width: 640,
              height: 240,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotateX(25deg)',
            }}
          />

          {/* Inner orbit ring visual */}
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
                  <div className="px-3.5 py-2 rounded-lg glass border border-[var(--glass-border)] whitespace-nowrap">
                    <span className="text-[11px] font-mono-custom text-[var(--text-secondary)]">
                      {t(`techstack.${skill}`)}
                    </span>
                  </div>
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
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full border border-[var(--neon-cyan)]/20" style={{ animation: 'pulse-3d 3s ease-in-out infinite' }} />
              <div className="absolute inset-2 rounded-full border border-[var(--neon-magenta)]/15" style={{ animation: 'pulse-3d 3s ease-in-out infinite 0.5s' }} />
              <div className="absolute inset-4 rounded-full border border-[var(--neon-purple)]/10" style={{ animation: 'pulse-3d 3s ease-in-out infinite 1s' }} />
              {/* Core glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--neon-cyan)]/10 via-transparent to-[var(--neon-magenta)]/10 blur-md" />
              {/* Core text */}
              <div className="relative text-center">
                <span className="block text-[10px] font-mono-custom text-[var(--neon-cyan)] tracking-[0.2em] uppercase">{t('techstack.innerRing')}</span>
                <span className="block text-lg sm:text-xl font-display font-bold text-[var(--text-primary)] mt-0.5" style={{ textShadow: '0 0 20px rgba(0, 245, 255, 0.5)' }}>ZM</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}