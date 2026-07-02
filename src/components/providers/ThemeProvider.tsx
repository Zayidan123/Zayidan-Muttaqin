'use client'

import { ThemeProvider as ThemeProviderInternal } from '@/lib/theme'
import type { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeProviderInternal>{children}</ThemeProviderInternal>
}
