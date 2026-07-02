import { useState, useEffect, useCallback } from 'react'
import { useToastStore } from '@/store/toast-store'

interface CMSData {
  [key: string]: string
}

interface UseCMSOptions {
  category?: string
  enabled?: boolean
  staleTime?: number
}

const DEFAULT_STALE_TIME = 5 * 60 * 1000 // 5 menit

export function useCMS(options: UseCMSOptions = {}) {
  const { category, enabled = true, staleTime = DEFAULT_STALE_TIME } = options
  const [data, setData] = useState<CMSData>({})
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<number>(0)
  const addToast = useToastStore((s) => s.addToast)

  const fetchCMS = useCallback(async () => {
    const now = Date.now()
    
    // Return cached data if still fresh
    if (lastFetched > 0 && now - lastFetched < staleTime) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const url = category ? `/api/cms?category=${encodeURIComponent(category)}` : '/api/cms'
      
      const res = await fetch(url)

      if (!res.ok) {
        if (res.status === 401) {
          // Unauthorized - clear cached data and use defaults
          setData({})
          setLastFetched(now)
          return
        }
        throw new Error(`Failed to fetch CMS data: ${res.status}`)
      }

      const json = await res.json()
      const items: { key: string; value: string }[] = json.data || json || []
      
      const kvMap: CMSData = {}
      for (const item of items) {
        kvMap[item.key] = item.value
      }
      
      setData(kvMap)
      setLastFetched(now)
    } catch (err) {
      console.error('CMS fetch error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Only show toast on actual errors, not on empty database
      if (err instanceof Error && !err.message.includes('401')) {
        addToast({
          title: 'CMS Info',
          description: 'Menggunakan data default. Panel Admin tersedia untuk mengupdate konten.',
          variant: 'default',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [category, staleTime, lastFetched, addToast])

  useEffect(() => {
    if (!enabled) return

    const loadCMS = async () => {
      await fetchCMS()
    }

    void loadCMS()
  }, [enabled, fetchCMS])

  // Helper to get nested value from flat key
  const get = useCallback((key: string, defaultValue: string = ''): string => {
    return data[key] !== undefined ? data[key] : defaultValue
  }, [data])

  // Refresh function for manual re-fetch
  const refresh = useCallback(() => {
    setLastFetched(0) // Force refresh by resetting timestamp
    return fetchCMS()
  }, [fetchCMS])

  return {
    data,
    isLoading,
    error,
    get,
    refresh,
    hasData: Object.keys(data).length > 0,
  }
}
