'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguageStore } from '@/store/language-store'
import { ArrowUp, Github, Linkedin, MessageCircle, Instagram, Gamepad2, Mail } from 'lucide-react'

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/in/zayidan-muttaqin/', label: 'LinkedIn', hoverColor: 'var(--neon-cyan)', hoverBorder: 'var(--neon-cyan)', hoverGlow: 'var(--glow-cyan)' },
  { icon: Github, href: 'https://github.com/Zayidan123', label: 'GitHub', hoverColor: 'var(--neon-magenta)', hoverBorder: 'var(--neon-magenta)', hoverGlow: 'var(--glow-magenta)' },
  { icon: MessageCircle, href: 'https://t.me/ZayM1122', label: 'Telegram', hoverColor: 'var(--neon-cyan)', hoverBorder: 'var(--neon-cyan)', hoverGlow: 'var(--glow-cyan)' },
  { icon: Instagram, href: 'https://www.instagram.com/zayidan1122?igsh=NW43eHZ0bXFtMzhz', label: 'Instagram', hoverColor: 'var(--neon-magenta)', hoverBorder: 'var(--neon-magenta)', hoverGlow: 'var(--glow-magenta)' },
  { icon: Gamepad2, href: 'https://discord.gg/4hv4vKAccC', label: 'Discord', hoverColor: 'var(--neon-purple)', hoverBorder: 'var(--neon-purple)', hoverGlow: 'var(--glow-purple)' },
  { icon: Mail, href: 'mailto:zayidan34@gmail.com', label: 'Email', hoverColor: 'var(--neon-cyan)', hoverBorder: 'var(--neon-cyan)', hoverGlow: 'var(--glow-cyan)' },
]

export function Footer() {
  const { t } = useLanguageStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const year = new Date().getFullYear()

  return (
    <footer ref={ref} className="relative mt-auto border-t border-[var(--glass-border)]" style={{ background: 'linear-gradient(to bottom, var(--dark-base), var(--dark-surface))' }}>
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-cyan)]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Left: Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <span className="font-display text-sm font-bold tracking-wider text-[var(--neon-cyan)] text-glow-cyan">
              ZAYIDAN
            </span>
            <p className="text-xs text-[var(--text-secondary)] flex flex-wrap items-center justify-center md:justify-start gap-1">
              <span>{t('footer.tagline')}</span>
              <span className="relative flex items-center gap-1 ml-1 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-green-400 text-[10px]">{t('footer.online')}</span>
              </span>
            </p>
          </div>

          {/* Center: Social Links */}
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group w-9 h-9 sm:w-10 sm:h-10 rounded-lg glass flex items-center justify-center text-[var(--text-secondary)] hover:text-[${social.hoverColor}] hover:border-[${social.hoverBorder}]/30 hover:shadow-[${social.hoverGlow}] transition-all duration-300 hover:scale-110`}
                style={{ '--hover-color': social.hoverColor } as React.CSSProperties}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = social.hoverColor; el.style.borderColor = social.hoverColor + '4D'; el.style.boxShadow = `0 0 15px ${social.hoverColor}33` }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = ''; el.style.borderColor = ''; el.style.boxShadow = 'none' }}
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Right: Back to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-[var(--glass-border)] text-xs font-mono-custom text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:shadow-[var(--glow-cyan)] transition-all duration-300"
            aria-label={t('footer.backToTop')}
          >
            <span>{t('footer.backToTop')}</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </motion.button>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 pt-4 border-t border-[var(--glass-border)] text-center"
        >
          <p className="text-xs text-[var(--text-secondary)] flex flex-col sm:flex-row items-center justify-center gap-1 text-center">
            <span>&copy; {year} Zayidan Muttaqin.</span>
            <span className="hidden sm:inline mx-1">&middot;</span>
            <span>{t('footer.rights')}</span>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}