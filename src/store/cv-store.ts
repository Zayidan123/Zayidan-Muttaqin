import { create } from 'zustand'

interface CvStore {
  isOpen: boolean
  setOpen: (open: boolean) => void
}

export const useCvStore = create<CvStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}))
