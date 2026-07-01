import { create } from 'zustand'

export interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastState {
  toasts: ToastItem[]
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: number) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Date.now()
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 4000)
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))