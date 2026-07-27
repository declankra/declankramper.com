'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

import { useShellTab } from '@/components/shell/ShellChrome'
import { TAB_IDS, type TabId } from '@/components/shell/useHashTab'

const EASE = [0.22, 1, 0.36, 1] as const

interface HomeTabsProps {
  now: ReactNode
  builds: ReactNode
  writes: ReactNode
}

export default function HomeTabs({ now, builds, writes }: HomeTabsProps) {
  const { activeTab } = useShellTab()
  const panes: Record<TabId, ReactNode> = { now, builds, writes }

  // Returning from an article: the pane slides in from the left — the mirror
  // of the article's slide-in from the right. Flag is set by ShellChrome's
  // selectTab on article exit. (Read-only in the initializer: StrictMode
  // double-invokes it, so removal happens in the mount effect below.)
  const [slideFromArticle, setSlideFromArticle] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.sessionStorage.getItem('dk-exit-article') === '1'
  })

  useEffect(() => {
    window.sessionStorage.removeItem('dk-exit-article')
  }, [])

  useEffect(() => {
    document.getElementById('shell-content')?.scrollTo({ top: 0 })
  }, [activeTab])

  return (
    <>
      {TAB_IDS.map((id) => {
        const active = id === activeTab
        const entering = active && slideFromArticle
        return (
          <motion.div
            key={id}
            hidden={!active}
            className={id === 'now' ? 'h-full' : undefined}
            initial={false}
            animate={
              active
                ? entering
                  ? { opacity: [0, 1], x: [-26, 0], y: 0 }
                  : { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, y: 8 }
            }
            onAnimationComplete={() => {
              if (entering) setSlideFromArticle(false)
            }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {panes[id]}
          </motion.div>
        )
      })}
    </>
  )
}
