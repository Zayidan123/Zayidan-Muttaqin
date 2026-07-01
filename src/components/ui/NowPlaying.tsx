'use client'

import { useState } from 'react'
import { Music, X } from 'lucide-react'

export function NowPlaying() {
  const [visible, setVisible] = useState(true)

  return (
    <>
      {visible && (
        <div className="fixed bottom-16 left-16 z-30 flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl">
          <div className="flex items-end gap-[2px] h-3.5">
            <span
              className="w-[3px] rounded-full bg-[var(--neon-cyan)]"
              style={{ animation: 'equalizer-bar 0.8s ease-in-out infinite alternate', height: '60%' }}
            />
            <span
              className="w-[3px] rounded-full bg-[var(--neon-magenta)]"
              style={{ animation: 'equalizer-bar 0.6s ease-in-out infinite alternate 0.15s', height: '100%' }}
            />
            <span
              className="w-[3px] rounded-full bg-[var(--neon-purple)]"
              style={{ animation: 'equalizer-bar 0.7s ease-in-out infinite alternate 0.3s', height: '40%' }}
            />
          </div>
          <span className="text-[10px] font-medium text-[var(--text-secondary)] whitespace-nowrap">
            Now Playing: Lo-fi Cyberpunk Beats
          </span>
          <button
            onClick={() => setVisible(false)}
            className="ml-1 w-4 h-4 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Hide now playing"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
      )}

      {!visible && (
        <button
          onClick={() => setVisible(true)}
          className="fixed bottom-16 left-16 z-30 w-7 h-7 rounded-lg glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors cursor-pointer"
          aria-label="Show now playing"
        >
          <Music className="h-3.5 w-3.5" />
        </button>
      )}

      <style jsx>{`
        @keyframes equalizer-bar {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </>
  )
}