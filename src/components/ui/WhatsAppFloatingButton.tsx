'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageStore } from '@/store/language-store'

const WA_NUMBER = '6281252643578'

export function WhatsAppFloatingButton() {
  const { t } = useLanguageStore()
  const [chatOpen, setChatOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    const msg = t('contact.chatGreeting')
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
    setChatOpen(false)
  }

  // Close panel when clicking outside
  useEffect(() => {
    if (!chatOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('.wa-fab-btn')
      ) {
        setChatOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [chatOpen])

  return (
    <div className="fixed bottom-6 right-6 z-[40] flex items-end gap-3">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[72px] right-0 w-[280px] sm:w-[300px] rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-sm font-medium text-white">{t('contact.chatTitle')}</span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <div className="p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {t('contact.chatGreeting')}
                </p>
              </div>
              <button
                onClick={handleSend}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                }}
              >
                {t('contact.chatSend')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setChatOpen(prev => !prev)}
        className="wa-fab-btn relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4), 0 0 40px rgba(37, 211, 102, 0.15)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={chatOpen ? { rotate: 0 } : {
          y: [0, -4, 0],
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        aria-label="Chat WhatsApp"
      >
        {!chatOpen && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#25D366' }} />
        )}
        {chatOpen ? (
          <svg className="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white relative z-10" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </motion.button>
    </div>
  )
}