'use client'

import { useEffect, type ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { useShellTab } from '@/components/shell/ShellChrome'
import { tabEntryClass } from '@/components/shell/tabEntry'
import { TAB_IDS, type TabId } from '@/components/shell/useHashTab'

interface HomeTabsProps {
  now: ReactNode
  builds: ReactNode
  writes: ReactNode
}

export default function HomeTabs({ now, builds, writes }: HomeTabsProps) {
  const { activeTab } = useShellTab()
  const panes: Record<TabId, ReactNode> = { now, builds, writes }

  useEffect(() => {
    document.getElementById('shell-content')?.scrollTo({ top: 0 })
  }, [activeTab])

  // Enter animation is CSS (globals.css .tab-enter / .tab-return), not
  // Framer: switching to "now" blocks the main thread while its media
  // starts, and a JS-driven tween finished unseen behind that stall.
  const entryClass = tabEntryClass()

  return (
    <>
      {TAB_IDS.map((id) => (
        <div
          key={id}
          hidden={id !== activeTab}
          className={cn(id === 'now' && 'h-full', entryClass)}
        >
          {panes[id]}
        </div>
      ))}
    </>
  )
}
