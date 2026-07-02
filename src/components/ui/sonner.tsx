"use client"

import { useTheme } from '@/lib/theme'
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()
  const toasterTheme: ToasterProps["theme"] = theme === 'light' ? 'light' : 'dark'

  return (
    <Sonner
      theme={toasterTheme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
