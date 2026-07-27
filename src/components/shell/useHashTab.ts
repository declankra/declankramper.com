'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export type TabId = 'now' | 'builds' | 'writes'

export const TAB_IDS: TabId[] = ['now', 'builds', 'writes']

export function tabFromHash(hash: string): TabId {
  const clean = hash.replace(/^#/, '')
  return (TAB_IDS as string[]).includes(clean) ? (clean as TabId) : 'now'
}

// Tab state lives in the URL hash (spec: "/#builds"; URL stays "/" for the
// three sections). pushState avoids the browser's scroll-to-anchor behavior;
// hashchange/popstate listeners keep back/forward working.
export function useHashTab(): [TabId, (tab: TabId) => void, boolean] {
  const pathname = usePathname()
  const [tab, setTabState] = useState<TabId>('now')
  const [syncedPathname, setSyncedPathname] = useState<string | null>(null)

  // Re-sync on pathname changes too: Next's router.push (e.g. exiting an
  // article back to "/#builds") fires neither hashchange nor popstate.
  useEffect(() => {
    const sync = () => {
      setTabState(tabFromHash(window.location.hash))
      setSyncedPathname(pathname)
    }
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [pathname])

  const setTab = useCallback((next: TabId) => {
    const url = next === 'now' ? window.location.pathname : `#${next}`
    window.history.pushState(null, '', url)
    setTabState(next)
  }, [])

  return [tab, setTab, syncedPathname === pathname]
}
