'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export type TabId = 'now' | 'builds' | 'writes'

export const TAB_IDS: TabId[] = ['now', 'builds', 'writes']

export function tabFromHash(hash: string): TabId {
  const clean = hash.replace(/^#/, '')
  return (TAB_IDS as string[]).includes(clean) ? (clean as TabId) : 'now'
}

// Never hand Next's router a "/#tab" URL: Next 16 caches the initial route's
// canonical URL with its hash, so after a full load on "/#builds",
// router.push('/#builds') lands on "/#builds#builds" (read as "now") and
// router.push('/') lands on "/#builds". Instead navigate to a bare "/" and
// apply the tab hash once the route lands (see sync below).
let pendingTab: TabId | null = null

export function pushHomeTab(router: { push: (href: string) => void }, tab: TabId) {
  pendingTab = tab
  router.push('/')
}

// Tab state lives in the URL hash (spec: "/#builds"; URL stays "/" for the
// three sections). pushState avoids the browser's scroll-to-anchor behavior;
// hashchange/popstate listeners keep back/forward working.
export function useHashTab(): [TabId, (tab: TabId) => void, boolean] {
  const pathname = usePathname()
  const [tab, setTabState] = useState<TabId>('now')
  const [syncedPathname, setSyncedPathname] = useState<string | null>(null)

  // Re-sync on pathname changes too: Next's router.push (e.g. exiting an
  // article back to the home shell) fires neither hashchange nor popstate.
  useEffect(() => {
    const sync = () => {
      if (pendingTab !== null && window.location.pathname === '/') {
        // Replace whatever URL Next committed (possibly a stale hash).
        window.history.replaceState(null, '', pendingTab === 'now' ? '/' : `/#${pendingTab}`)
        pendingTab = null
      }
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
