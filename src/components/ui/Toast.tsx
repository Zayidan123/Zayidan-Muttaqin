'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useToastStore } from '@/store/toast-store'

const typeConfig = {
  success: {
    icon: CheckCircle,
    borderColor: 'border-green-500/40',
    iconColor: 'text-green-400',
    glowColor: 'shadow-[0_0_15px_rgba(0,255,136,0.15)]',
  },
  error: {
    icon: AlertCircle,
    borderColor: 'border-red-500/40',
    iconColor: 'text-red-400',
    glowColor: 'shadow-[0_0_15px_rgba(255,68,102,0.15)]',
  },
  info: {
    icon: Info,
    borderColor: 'border-[var(--neon-cyan)]/40',
    iconColor: 'text-[var(--neon-cyan)]',
    glowColor: 'shadow-[var(--glow-cyan)]',
  },
} as const

export function Toast() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = typeConfig[toast.type]
          const Icon = config.icon
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl glass border ${config.borderColor} ${config.glowColor} min-w-[280px] max-w-[400px]`}
            >
              <Icon className={`h-4 w-4 ${config.iconColor} shrink-0`} />
              <span className="text-sm text-[var(--text-primary)] flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-colors"
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}