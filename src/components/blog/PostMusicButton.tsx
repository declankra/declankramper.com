'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { Play } from 'lucide-react'

import { useShellFeatures } from '@/components/shell/ShellFeaturesContext'

// A post opts in with `<div data-post-music></div>` on its own line in the
// markdown. The button plays the same shell-wide track as the rail's music
// icon, so it keeps playing when the reader leaves the post. While it plays,
// the play icon becomes moving equalizer bars.

export default function PostMusicButton() {
  const pathname = usePathname()
  const { toggleMusic, musicPlaying } = useShellFeatures()
  const [slots, setSlots] = useState<HTMLElement[]>([])

  useEffect(() => {
    const root = document.getElementById('writes-post-root')
    setSlots(Array.from(root?.querySelectorAll<HTMLElement>('[data-post-music]') ?? []))
  }, [pathname])

  const label = musicPlaying ? 'Pause music' : 'Play music'

  return (
    <>
      {slots.map((slot, i) =>
        createPortal(
          <button
            key={i}
            type="button"
            onClick={toggleMusic}
            aria-pressed={musicPlaying}
            aria-label={label}
            title={label}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#555] shadow-sm transition-[color,border-color,transform] hover:border-[#CCC] hover:text-[#0A0A0B] active:scale-95"
          >
            {musicPlaying ? (
              <span className="post-music-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            ) : (
              <Play size={13} className="ml-px fill-current" />
            )}
          </button>,
          slot
        )
      )}
      <style jsx global>{`
        .post-music-bars {
          display: inline-flex;
          align-items: flex-end;
          gap: 2px;
          height: 11px;
        }
        .post-music-bars > span {
          width: 2px;
          height: 100%;
          border-radius: 1px;
          background: currentColor;
          transform-origin: bottom;
          animation: post-music-bar 0.9s ease-in-out infinite;
        }
        .post-music-bars > span:nth-child(2) {
          animation-delay: -0.3s;
        }
        .post-music-bars > span:nth-child(3) {
          animation-delay: -0.6s;
        }
        @keyframes post-music-bar {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .post-music-bars > span {
            animation: none;
            transform: scaleY(0.7);
          }
        }
      `}</style>
    </>
  )
}
