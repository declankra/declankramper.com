'use client'

import { createContext, useCallback, useContext, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { MotionConfig } from 'framer-motion'
import { play } from 'cuelume'

import { usePostHog } from 'posthog-js/react'

import ShellRail from '@/components/shell/ShellRail'
import FooterIconRow from '@/components/shell/FooterIconRow'
import { GameProvider } from '@/components/game/GameContext'
import { setTabEntry } from '@/components/shell/tabEntry'
import { pushHomeTab, TAB_IDS, useHashTab, type TabId } from '@/components/shell/useHashTab'
import { cn } from '@/lib/utils'

interface ShellTabContextValue {
  /** null on in-shell pages that aren't a tab (e.g. /resume) — no underline */
  activeTab: TabId | null
  /** True once the home tab has been synchronized with the current URL hash. */
  tabReady: boolean
  selectTab: (tab: TabId) => void
  /** selectTab without the tab_switch analytics event (e.g. "random"). */
  goToTab: (tab: TabId) => void
  /** Reading mode: on an article, scrolled past the title — the rail quiets
   * down (tabs collapse, name becomes a back affordance). */
  articleFocus: boolean
}

const ShellTabContext = createContext<ShellTabContextValue | null>(null)

export function useShellTab(): ShellTabContextValue {
  const ctx = useContext(ShellTabContext)
  if (!ctx) throw new Error('useShellTab must be used inside ShellChrome')
  return ctx
}

export default function ShellChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const posthog = usePostHog()
  const [hashTab, setHashTab, hashTabReady] = useHashTab()

  const isHome = pathname === '/'
  const isWrites = pathname === '/writes'
  const isArticle = pathname.startsWith('/writes/')
  // On /writes/[slug] the "writes" tab reads as active (spec: article opens
  // inside the shell; nav stays put and visible). Other in-shell pages
  // (e.g. /resume) belong to no tab.
  const activeTab: TabId | null = isHome ? hashTab : isArticle || isWrites ? 'writes' : null
  const isNow = activeTab === 'now'

  // Reading mode: on an article the shell quiets down immediately — tabs
  // collapse and the name becomes the back affordance, so the only action
  // from an article is back to the list.
  const articleFocus = isArticle

  const goToTab = useCallback(
    (tab: TabId) => {
      // Exiting an article back to the home shell: the incoming pane slides
      // in from the left (reverse of the article's slide-in).
      setTabEntry(isArticle ? 'return' : 'enter')
      if (isHome && tab !== 'writes') {
        setHashTab(tab)
      } else if (tab === 'writes') {
        router.push('/writes')
      } else {
        pushHomeTab(router, tab)
      }
    },
    [isHome, isArticle, router, setHashTab]
  )

  const selectTab = useCallback(
    (tab: TabId) => {
      // Re-clicking the open tab does nothing (no sound, no replayed entry).
      if (tab === activeTab && !isArticle) return
      // Tab-switch sound, on for everyone. The click itself is the user
      // gesture browsers need before audio can play.
      const from = activeTab ? TAB_IDS.indexOf(activeTab) : -1
      play('select', { direction: TAB_IDS.indexOf(tab) < from ? 'back' : 'forward' })
      posthog?.capture('tab_switch', { tab })
      goToTab(tab)
    },
    [activeTab, isArticle, goToTab, posthog]
  )

  return (
    <MotionConfig reducedMotion="user">
      <ShellTabContext.Provider
        value={{ activeTab, tabReady: isHome && hashTabReady, selectTab, goToTab, articleFocus }}
      >
        <GameProvider>
          <FooterIconRow>
            <div
              className={cn(
                'flex flex-col bg-white md:flex-row',
                isNow ? 'h-svh overflow-hidden' : 'min-h-svh'
              )}
            >
              <aside className={cn(
                'relative z-20 shrink-0 px-5 pt-6 md:z-10 md:w-[200px] md:pb-14 md:pl-[clamp(20px,3.5vw,44px)] md:pr-0 md:pt-[30px]',
                isArticle && 'md:sticky md:top-0 md:max-h-svh md:w-[240px] md:self-start md:overflow-y-auto lg:w-[280px]'
              )}>
                <ShellRail />
              </aside>
              <div
                id="shell-content"
                className={cn(
                  'min-h-0 flex-1 px-5 pb-24 pt-4 md:pl-[clamp(24px,3vw,40px)] md:pr-[clamp(20px,5vw,64px)] md:pt-[30px]',
                  isNow && 'overflow-hidden'
                )}
              >
                {children}
              </div>
            </div>
          </FooterIconRow>
        </GameProvider>
      </ShellTabContext.Provider>
    </MotionConfig>
  )
}
