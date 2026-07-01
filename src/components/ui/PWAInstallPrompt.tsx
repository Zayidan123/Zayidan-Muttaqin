'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, WifiOff, Smartphone, Check } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'
import { useLanguageStore } from '@/store/language-store'

export function PWAInstallPrompt() {
  const { canInstall, isInstalled, isOnline, promptInstall } = usePWA()
  const { lang } = useLanguageStore()
  const [showPrompt, setShowPrompt] = useState(false)
  const showOfflineBanner = useMemo(() => !isOnline, [isOnline])
  const [dismissed, setDismissed] = useState(false)
  const [installing, setInstalling] = useState(false)

  // Show install prompt after 8 seconds if not dismissed and can install
  useEffect(() => {
    if (canInstall && !dismissed && !isInstalled) {
      const timer = setTimeout(() => setShowPrompt(true), 8000)
      return () => clearTimeout(timer)
    }
  }, [canInstall, dismissed, isInstalled])

  const handleInstall = async () => {
    setInstalling(true)
    const accepted = await promptInstall()
    setInstalling(false)
    if (accepted || isInstalled) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
  }

  const label = lang === 'id' ? {
    title: 'Instal Aplikasi',
    desc: 'Akses portfolio ini langsung dari home screen Anda — tanpa browser!',
    install: 'Instal Sekarang',
    notNow: 'Nanti Saja',
    offline: 'Anda sedang offline. Beberapa fitur mungkin tidak tersedia.',
    installed: 'Terinstal',
  } : {
    title: 'Install App',
    desc: 'Access this portfolio directly from your home screen — no browser needed!',
    install: 'Install Now',
    notNow: 'Not Now',
    offline: 'You are offline. Some features may be unavailable.',
    installed: 'Installed',
  }

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {showOfflineBanner && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/90 backdrop-blur-md text-black text-xs sm:text-sm font-medium shadow-lg"
          >
            <WifiOff className="h-4 w-4 shrink-0" />
            <span>{label.offline}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Prompt Toast */}
      <AnimatePresence>
        {showPrompt && canInstall && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ duration: 0.4, type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-[360px] z-[190] p-5 rounded-2xl glass border border-[var(--neon-cyan)]/30 shadow-[0_0_30px_rgba(0,245,255,0.1)] backdrop-blur-xl"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex gap-4">
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-[var(--neon-cyan)]" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-sm font-bold text-[var(--text-primary)] mb-1">
                  {label.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  {label.desc}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    disabled={installing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-black bg-[var(--neon-cyan)] hover:shadow-[var(--glow-cyan)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {installing ? (
                      <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : isInstalled ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    {installing ? (lang === 'id' ? 'Menginstal...' : 'Installing...') : label.install}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                  >
                    {label.notNow}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}