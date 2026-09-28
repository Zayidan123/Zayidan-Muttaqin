'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Stats } from '@/components/sections/Stats'
import { TechStack } from '@/components/sections/TechStack'
import { Achievements } from '@/components/sections/Achievements'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { FAQ } from '@/components/sections/FAQ'
import { Contact } from '@/components/sections/Contact'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { FloatingBackToTop } from '@/components/ui/FloatingBackToTop'
import { WhatsAppFloatingButton } from '@/components/ui/WhatsAppFloatingButton'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { Toast } from '@/components/ui/Toast'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { CvReader } from '@/components/ui/CvReader'
import { KeyboardShortcutsHint } from '@/components/ui/KeyboardShortcutsHint'
import { KonamiEasterEgg } from '@/components/ui/KonamiEasterEgg'
import { CursorGlow } from '@/components/ui/CursorGlow'
import { AmbientSound } from '@/components/ui/AmbientSound'
import { WebGL3DBackground } from '@/components/ui/WebGL3DBackground'
import { ScrollSpy } from '@/components/ui/ScrollSpy'
import { AdminPanel } from '@/components/ui/AdminPanel'
import { AnalyticsTracker } from '@/components/ui/AnalyticsTracker'
import { CopyrightProtection } from '@/components/ui/CopyrightProtection'
import { PWARegister } from '@/components/ui/PWARegister'
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt'
import { useLanguageStore } from '@/store/language-store'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export function PortfolioPage() {
  const { setLang } = useLanguageStore()
  useKeyboardShortcuts()

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'id' | 'en' | null
    if (saved) setLang(saved)
  }, [setLang])

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <LoadingScreen />
      <ScrollProgress />
      {/* Unified modern 3D WebGL scene — the signature layer of the whole site.
          Runs in BOTH themes (Gelap & Terang): lazy-loads three.js on the
          client and re-tints lighting/particles in place when the theme flips. */}
      <WebGL3DBackground />
      {/* Depth-of-field vignette: makes content pop above the 3D scene */}
      <div className="depth-vignette fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
      <Navbar />
      <main className="flex-1 relative z-[1]">
        <Hero />
        <div className="section-divider my-4 sm:my-8" />
        <About />
        <Stats />
        <div className="section-divider my-4 sm:my-8" />
        <TechStack />
        <div className="section-divider my-4 sm:my-8" />
        <Achievements />
        <div className="section-divider my-4 sm:my-8" />
        <Experience />
        <div className="section-divider my-4 sm:my-8" />
        <Projects />
        <div className="section-divider my-4 sm:my-8" />
        <FAQ />
        <div className="section-divider my-4 sm:my-8" />
        <Contact />
      </main>
      <Footer />
      <FloatingBackToTop />
      <WhatsAppFloatingButton />
      <ScrollSpy />
      <AmbientSound />
      <Toast />
      <CommandPalette />
      <CvReader />
      <KeyboardShortcutsHint />
      <KonamiEasterEgg />
      <CursorGlow />
      <AnalyticsTracker />
      <CopyrightProtection enabled={true} />
      <AdminPanel />
      <PWARegister />
      <PWAInstallPrompt />
    </div>
  )
}

export default PortfolioPage