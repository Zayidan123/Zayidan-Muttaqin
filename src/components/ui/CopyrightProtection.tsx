'use client'

import { useEffect, useCallback } from 'react'
import { useToastStore } from '@/store/toast-store'

export function CopyrightProtection({ enabled }: { enabled: boolean }) {
  const { addToast } = useToastStore()

  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG' || target.closest('img') || target.tagName === 'VIDEO') {
      e.preventDefault()
      addToast('© Konten dilindungi hak cipta Zayidan Muttaqin', 'info')
    }
  }, [addToast])

  const handleDragStart = useCallback((e: DragEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
      e.preventDefault()
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)

    const style = document.createElement('style')
    style.id = 'copyright-protection'
    style.textContent = 'img { -webkit-user-select: none; user-select: none; pointer-events: auto; }'
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      document.getElementById('copyright-protection')?.remove()
    }
  }, [enabled, handleContextMenu, handleDragStart])

  return null
}