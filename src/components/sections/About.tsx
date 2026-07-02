'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguageStore } from '@/store/language-store'
import { Target, Users, MessageSquare, Monitor, Video, Palette, Sparkles, GraduationCap, TrendingUp, Award, ShieldCheck, Code2, Terminal, Coins } from 'lucide-react'
import { TiltCard } from '@/components/ui/TiltCard'
import { ScrambleText } from '@/components/ui/ScrambleText'
import { SkillRadar } from '@/components/ui/SkillRadar'


const skillCards = [
  {
    icon: Target,
    titleKey: 'about.sales.title',
    descKey: 'about.sales.desc',
    color: 'cyan' as const,
  },
  {
    icon: Users,
    titleKey: 'about.leadership.title',
    descKey: 'about.leadership.desc',
    color: 'magenta' as const,
  },
  {
    icon: MessageSquare,
    titleKey: 'about.communication.title',
    descKey: 'about.communication.desc',
    color: 'purple' as const,
  },
]

const iconColorMap = {
  cyan: 'text-[var(--neon-cyan)]',
  magenta: 'text-[var(--neon-magenta)]',
  purple: 'text-[var(--neon-purple)]',
}

const glowMap = {
  cyan: 'shadow-[var(--glow-cyan)]',
  magenta: 'shadow-[var(--glow-magenta)]',
  purple: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
}

const borderMap = {
  cyan: 'border-[var(--neon-cyan)]/30',
  magenta: 'border-[var(--neon-magenta)]/30',
  purple: 'border-[var(--neon-purple)]/30',
}

const hardSkills = [
  { icon: Monitor, key: 'about.skills.computer', proficiency: 85 },
  { icon: Video, key: 'about.skills.video', proficiency: 75 },
  { icon: Palette, key: 'about.skills.design', proficiency: 80 },
  { icon: Sparkles, key: 'about.skills.ai', proficiency: 70 },
  { icon: TrendingUp, key: 'about.skills.financial', proficiency: 65 },
  { icon: Coins, key: 'about.skills.web3', proficiency: 75 },
  { icon: Code2, key: 'about.skills.softwareDev', proficiency: 60 },
  { icon: Terminal, key: 'about.skills.python', proficiency: 55 },
]

const softSkills = [
  'about.skills.team',
  'about.skills.leadership',
  'about.skills.communication',
  'about.skills.problem',
  'about.skills.timeManagement',
  'about.skills.adaptif',
  'about.skills.disiplin',
  'about.skills.teliti',
  'about.skills.customerFocus',
  'about.skills.negotiation',
  'about.skills.motivasi',
]

export function About() {
  const { t } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [skillsRef, skillsInView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const parallaxRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-15, 15])

  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8" ref={parallaxRef}>
      <motion.div className="max-w-6xl mx-auto" style={{ y }} ref={ref}>
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            <ScrambleText text={t('about.title')} />
          </h2>
          <div className="section-title-line" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Avatar + Education */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center lg:items-start gap-6"
          >
            {/* Avatar with HUD Brackets */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 shrink-0">
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[var(--neon-cyan)] z-10" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[var(--neon-cyan)] z-10" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[var(--neon-magenta)] z-10" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[var(--neon-magenta)] z-10" />

              <div className="avatar-gradient-border w-full h-full rounded-2xl overflow-hidden p-[3px]">
                <div className="avatar-inner w-full h-full rounded-2xl overflow-hidden bg-zinc-950/80 relative">
                  <Image
                    src="/zayidan-photo.png"
                    alt="Zayidan Muttaqin - Sales, Leadership, Communication"
                    fill
                    priority
                    className="object-cover transition-all duration-700 hover:scale-105"
                  />
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl border-2 border-[var(--neon-cyan)]/20 pointer-events-none animate-pulse z-10" />
            </div>

            {/* Education Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full max-w-sm"
            >
              <div className="p-5 rounded-xl glass border border-[var(--glass-border)] transition-all duration-300 hover:shadow-[var(--glow-cyan)] glass-noise">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10">
                    <GraduationCap className="h-5 w-5 text-[var(--neon-purple)]" />
                  </div>
                  <div>
                    <h3 className="font-display text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                      {t('about.education.school')}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[var(--neon-magenta)] font-mono-custom">
                      {t('about.education.period')}
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-2">
                  {t('about.education.major')}
                </p>
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono-custom text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/20">
                  {t('about.education.score')}
                </div>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-full max-w-sm"
            >
              <div className="p-5 rounded-xl glass border border-[var(--glass-border)] glass-noise">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10">
                    <Award className="h-5 w-5 text-[var(--neon-cyan)]" />
                  </div>
                  <div>
                    <h3 className="font-display text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                      {t('about.certifications.title')}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[var(--neon-cyan)] font-mono-custom">
                      {t('about.certifications.subtitle')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['about.certifications.sales', 'about.certifications.retail', 'about.certifications.leadership', 'about.certifications.communication'].map((key) => (
                    <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono-custom text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5">
                      <ShieldCheck className="h-3 w-3" />
                      {t(key)}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {t('about.bio')}
            </p>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {t('about.bio2')}
            </p>

            {/* Skill Identity Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {skillCards.map((skill, idx) => {
                const Icon = skill.icon
                return (
                  <motion.div
                    key={skill.titleKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + idx * 0.15 }}
                  >
                    <TiltCard className="transition-[box-shadow_0.3s]">
                    <div className={`p-4 rounded-xl glass border ${borderMap[skill.color]} transition-[box-shadow_0.3s]`}>
                      <Icon className={`h-6 w-6 ${iconColorMap[skill.color]} mb-2`} />
                      <h3 className="font-display text-xs sm:text-sm font-semibold text-[var(--text-primary)] mb-1">
                        {t(skill.titleKey)}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">
                        {t(skill.descKey)}
                      </p>
                    </div>
                    </TiltCard>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <div ref={skillsRef} className="mt-16 sm:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hard Skills - single column to prevent text overlap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={skillsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 rounded-xl glass border border-[var(--glass-border)]"
            >
              <h3 className="font-display text-sm sm:text-base font-bold text-[var(--neon-cyan)] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] shadow-[var(--glow-cyan)]" />
                {t('about.skills.hardTitle')}
              </h3>
              <div className="flex flex-col gap-3">
                {hardSkills.map((skill, idx) => {
                  const Icon = skill.icon
                  return (
                    <motion.div
                      key={skill.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={skillsInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]/50 hover:border-[var(--neon-cyan)]/30 transition-all duration-300 min-h-[44px]"
                    >
                      <Icon className="h-4 w-4 text-[var(--neon-cyan)] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-sm text-[var(--text-primary)] leading-snug block">{t(skill.key)}</span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 w-full h-1.5 rounded-full overflow-hidden skill-bar-track" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={skillsInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                              transition={{ duration: 1, delay: 0.4 + idx * 0.1, ease: 'easeOut' }}
                              className="h-full rounded-full relative"
                              style={{
                                background: 'linear-gradient(90deg, var(--neon-cyan), rgba(0,245,255,0.4))',
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-mono-custom text-[var(--neon-cyan)]/60 tabular-nums w-8 text-right">{skill.proficiency}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Soft Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={skillsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-xl glass border border-[var(--glass-border)]"
            >
              <h3 className="font-display text-sm sm:text-base font-bold text-[var(--neon-magenta)] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--neon-magenta)] shadow-[var(--glow-magenta)]" />
                {t('about.skills.softTitle')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((key, idx) => (
                  <motion.span
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={skillsInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + idx * 0.06 }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm text-[var(--text-primary)] border border-[var(--glass-border)] bg-[var(--glass-bg)]/50 hover:border-[var(--neon-magenta)]/30 hover:text-[var(--neon-magenta)] transition-all duration-300 cursor-default soft-skill-tag"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-magenta)]/60" />
                    {t(key)}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Skills Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={skillsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex justify-center"
          >
            <div className="p-6 rounded-xl glass border border-[var(--glass-border)]">
              <SkillRadar
                skills={hardSkills.map(s => ({
                  name: t(s.key).split('(')[0].trim().substring(0, 12),
                  value: s.proficiency,
                  color: s.proficiency >= 80 ? 'var(--neon-cyan)' : s.proficiency >= 65 ? 'var(--neon-purple)' : 'var(--neon-magenta)',
                }))}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}