'use client'

import { useCallback } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import BuildIcon from './BuildIcon'
import RunIcon from './RunIcon'
import WriteIcon from './WriteIcon'
import RandomIcon from './RandomIcon'
import GameIcon from './GameIcon'
import ReadmeIcon from './ReadmeIcon'
import MusicIcon from './MusicIcon'
import ContactIcon from './ContactIcon'
import BizIcon from './BizIcon'
import { getRandomDestination } from '@/lib/random'

export type RecentWrite = {
  title: string
  slug: string
  date?: string
}

interface BottomNavigationProps {
  onGameClick: () => void
  onReadmeClick: () => void
  onMusicClick: () => void
  recentWrites: RecentWrite[]
}

type NavItem = {
  label: string
  href?: string
  onClick?: () => void
  icon: ReactNode
  className: string
  target?: string
  rel?: string
  disabled?: boolean
}

export default function BottomNavigation({
  onGameClick,
  onReadmeClick,
  onMusicClick,
  recentWrites
}: BottomNavigationProps) {
  const router = useRouter()
  const fadeInEase = [0.25, 0.46, 0.45, 0.94] as const

  const handleRandomClick = useCallback(() => {
    const destination = getRandomDestination()
    router.push(destination)
  }, [router])

  const firstColumn: NavItem[] = [
    {
      label: 'writes',
      href: '/writes',
      icon: <WriteIcon />,
      className: 'write-link'
    },
    {
      label: 'builds',
      href: '/builds',
      icon: <BuildIcon />,
      className: 'build-link'
    },
    {
      label: 'runs',
      href: '/runs',
      icon: <RunIcon />,
      className: 'run-link'
    }
  ]

  const secondColumn: NavItem[] = [
    {
      label: 'music',
      onClick: onMusicClick,
      icon: <MusicIcon />,
      className: 'music-link'
    },
    {
      label: 'game',
      onClick: onGameClick,
      icon: <GameIcon />,
      className: 'game-link'
    },
    {
      label: 'random',
      onClick: handleRandomClick,
      icon: <RandomIcon />,
      className: 'random-link'
    }
  ]

  const fourthColumn: NavItem[] = [
    {
      label: 'contact',
      href: 'mailto:declan@dkbuilds.co?subject=Hello%20from%20the%20internet!',
      icon: <ContactIcon />,
      className: 'contact-link'
    },
    {
      label: 'readme.md',
      onClick: onReadmeClick,
      icon: <ReadmeIcon />,
      className: 'readme-link'
    },
    {
      label: 'biz',
      href: 'https://www.dkbuilds.co',
      icon: <BizIcon />,
      className: 'biz-link',
      target: '_blank',
      rel: 'noreferrer'
    }
  ]

  const renderItem = (item: NavItem) => {
    const content = (
      <div className="flex items-center gap-2 text-[13px] md:text-sm">
        <span className="text-[#444] scale-[0.9]">{item.icon}</span>
        <span className="text-[#666666] group-hover:text-[#0A0A0B] transition-colors tracking-wide">
          {item.label}
        </span>
      </div>
    )

    const baseClasses = `${item.className} group transition-opacity hover:opacity-80`

    if (item.href) {
      return (
        <Link
          key={item.label}
          href={item.href}
          className={baseClasses}
          target={item.target}
          rel={item.rel}
        >
          {content}
        </Link>
      )
    }

    const isDisabled = Boolean(item.disabled)

    return (
      <button
        key={item.label}
        onClick={isDisabled ? undefined : item.onClick}
        className={`${baseClasses} bg-transparent border-none text-left ${
          isDisabled ? 'cursor-default opacity-60' : ''
        }`}
        aria-disabled={isDisabled ? 'true' : undefined}
        disabled={isDisabled}
        type="button"
      >
        {content}
      </button>
    )
  }

  return (
    <motion.nav
      className="grid w-full max-w-3xl grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 lg:gap-6 justify-items-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.1, duration: 0.6, ease: fadeInEase }}
    >
      <div className="flex flex-col gap-3">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#777]">
          Core
        </div>
        {firstColumn.map(renderItem)}
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#777]">
          Fun
        </div>
        {secondColumn.map(renderItem)}
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#777]">
          ABOUT
        </div>
        {fourthColumn.map(renderItem)}
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#777]">
          Recent Writes
        </div>
        {recentWrites.length > 0 ? (
          recentWrites.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/writes/${post.slug}`}
              className="write-link group transition-opacity hover:opacity-80"
            >
              <div className="flex items-center gap-2 text-[13px] md:text-sm">
                <span className="text-[#444] scale-[0.9]">
                  <WriteIcon />
                </span>
                <span className="text-[#666666] group-hover:text-[#0A0A0B] transition-colors tracking-wide">
                  {post.title}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-sm text-[#999] tracking-wide">No posts yet</div>
        )}
      </div>
    </motion.nav>
  )
}
