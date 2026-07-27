'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

import MusicIcon from '@/components/home/MusicIcon'
import GameIcon from '@/components/home/GameIcon'
import RandomIcon from '@/components/home/RandomIcon'
import RunIcon from '@/components/home/RunIcon'
import ReadmeIcon from '@/components/home/ReadmeIcon'
import ResumeIcon from '@/components/home/ResumeIcon'
import SoundcloudIcon from '@/components/home/SoundcloudIcon'
import CoffeeIcon from '@/components/home/CoffeeIcon'
import { useShellFeatures } from '@/components/shell/ShellFeaturesContext'
import { cn } from '@/lib/utils'

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 20 }

// Muted icon item: #999 base, ink on hover; after: pseudo widens the hit area.
// triggerClass drives each icon's built-in hover keyframes.
const ITEM_CLASS =
  "relative p-1 text-[#999] transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-0.5 hover:text-[#0A0A0B] after:absolute after:-inset-2 after:content-[''] [&_svg]:h-3.5 [&_svg]:w-3.5"

function MoreItem({
  index,
  title,
  triggerClass,
  href,
  onClick,
  children,
}: {
  index: number
  title: string
  triggerClass: string
  href?: string
  onClick?: (e: React.MouseEvent) => void
  children: React.ReactNode
}) {
  const className = cn(ITEM_CLASS, triggerClass)
  const inner = href ? (
    href.startsWith('/') ? (
      <Link href={href} title={title} aria-label={title} className={className}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer" title={title} aria-label={title} className={className}>
        {children}
      </a>
    )
  ) : (
    <button type="button" title={title} aria-label={title} onClick={onClick} className={className}>
      {children}
    </button>
  )

  return (
    <motion.span
      initial={{ opacity: 0, x: -6, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1, transition: { ...SPRING, delay: index * 0.04 } }}
      exit={{ opacity: 0, x: -6, scale: 0.95, transition: { duration: 0.12, delay: 0 } }}
      className="inline-flex"
    >
      {inner}
    </motion.span>
  )
}

// Three dots anchored to the bottom-left; hovering (or tapping) springs the
// fun-stuff icons out horizontally along the bottom edge of the viewport.
export default function RailMoreIcons() {
  const { toggleMusic, openGame, openReadme, goRandom } = useShellFeatures()
  const [expanded, setExpanded] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Tap-outside dismiss (mobile)
  useEffect(() => {
    if (!expanded) return
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setExpanded(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [expanded])

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-4 left-5 z-20 hidden h-[22px] w-fit items-center md:left-[clamp(20px,3.5vw,44px)] md:flex"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* While expanded the dots do the typing-indicator bounce — the site is
          "thinking about what else to show you". */}
      <button
        type="button"
        aria-expanded={expanded}
        aria-label="more from declan"
        onClick={() => setExpanded((e) => !e)}
        className={cn(
          "rail-more-trigger relative flex h-[22px] items-center transition-colors duration-200 after:absolute after:-inset-2.5 after:content-['']",
          expanded ? 'typing text-[#0A0A0B]' : 'text-[#999] hover:text-[#666]'
        )}
      >
        <svg width="14" height="8" viewBox="0 0 14 8" fill="currentColor" aria-hidden="true">
          <circle className="rail-more-dot rail-more-dot-1" cx="1.5" cy="4" r="1.4" />
          <circle className="rail-more-dot rail-more-dot-2" cx="7" cy="4" r="1.4" />
          <circle className="rail-more-dot rail-more-dot-3" cx="12.5" cy="4" r="1.4" />
        </svg>
        <style jsx global>{`
          .rail-more-dot {
            transform-box: fill-box;
            transform-origin: center;
          }

          .rail-more-trigger.typing .rail-more-dot-1 {
            animation: rail-dot-bounce 1s ease-in-out infinite;
          }

          .rail-more-trigger.typing .rail-more-dot-2 {
            animation: rail-dot-bounce 1s ease-in-out 0.12s infinite;
          }

          .rail-more-trigger.typing .rail-more-dot-3 {
            animation: rail-dot-bounce 1s ease-in-out 0.24s infinite;
          }

          @keyframes rail-dot-bounce {
            0%, 55%, 100% { transform: translateY(0); }
            25% { transform: translateY(-3px); }
          }

          @media (prefers-reduced-motion: reduce) {
            .rail-more-trigger.typing .rail-more-dot {
              animation: none;
            }
          }
        `}</style>
      </button>

      <div className="ml-2 flex h-[22px] items-center gap-1.5 rounded-md bg-white/85 backdrop-blur-[2px]">
        <AnimatePresence>
          {expanded && (
            <>
              <MoreItem index={0} title="music" triggerClass="music-link" onClick={toggleMusic}>
                <MusicIcon />
              </MoreItem>
              <MoreItem index={1} title="game" triggerClass="game-link" onClick={openGame}>
                <GameIcon />
              </MoreItem>
              <MoreItem index={2} title="random" triggerClass="random-link" onClick={goRandom}>
                <RandomIcon />
              </MoreItem>
              <MoreItem index={3} title="runs" triggerClass="run-link" href="/runs">
                <RunIcon />
              </MoreItem>
              <MoreItem index={4} title="readme" triggerClass="readme-link" onClick={openReadme}>
                <ReadmeIcon />
              </MoreItem>
              <MoreItem index={5} title="resume" triggerClass="resume-link" href="/resume">
                <ResumeIcon />
              </MoreItem>
              <MoreItem index={6} title="soundcloud" triggerClass="soundcloud-link" href="https://soundcloud.com/declank10">
                <SoundcloudIcon />
              </MoreItem>
              <MoreItem index={7} title="coffee" triggerClass="coffee-link" href="/coffee">
                <CoffeeIcon />
              </MoreItem>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
