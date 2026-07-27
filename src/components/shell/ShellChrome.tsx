'use client'

import { createContext, useCallback, useContext, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { MotionConfig } from 'framer-motion'

import { usePostHog } from 'posthog-js/react'

import ShellRail from '@/components/shell/ShellRail'
import FooterIconRow from '@/components/shell/FooterIconRow'
import { GameProvider } from '@/components/game/GameContext'
import { useHashTab, type TabId } from '@/components/shell/useHashTab'
import { cn } from '@/lib/utils'

interface ShellTabContextValue {
  /** null on in-shell pages that aren't a tab (e.g. /resume) — no underline */
  activeTab: TabId | null
  /** True once the home tab has been synchronized with the current URL hash. */
  tabReady: boolean
  selectTab: (tab: TabId) => void
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
  const isArticle = pathname.startsWith('/writes/')
  // On /writes/[slug] the "writes" tab reads as active (spec: article opens
  // inside the shell; nav stays put and visible). Other in-shell pages
  // (e.g. /resume) belong to no tab.
  const activeTab: TabId | null = isHome ? hashTab : isArticle ? 'writes' : null
  const isNow = activeTab === 'now'

  // Reading mode: on an article the shell quiets down immediately — tabs
  // collapse and the name becomes the back affordance, so the only action
  // from an article is back to the list.
  const articleFocus = isArticle

  const selectTab = useCallback(
    (tab: TabId) => {
      posthog?.capture('tab_switch', { tab })
      if (isHome) {
        setHashTab(tab)
      } else {
        // Exiting an article back to the home shell: flag it so the incoming
        // pane slides in from the left (reverse of the article's slide-in).
        if (isArticle) {
          window.sessionStorage.setItem('dk-exit-article', '1')
        }
        router.push(tab === 'now' ? '/' : `/#${tab}`, { scroll: false })
      }
    },
    [isHome, isArticle, posthog, router, setHashTab]
  )

  return (
    <MotionConfig reducedMotion="user">
      <ShellTabContext.Provider
        value={{ activeTab, tabReady: isHome && hashTabReady, selectTab, articleFocus }}
      >
        <GameProvider>
          <FooterIconRow>
            <div
              className={cn(
                'flex flex-col bg-white md:flex-row',
                isNow ? 'h-svh overflow-hidden' : 'min-h-svh'
              )}
            >
              <aside className="relative z-20 shrink-0 px-5 pt-6 md:z-10 md:w-[200px] md:pb-14 md:pl-[clamp(20px,3.5vw,44px)] md:pr-0 md:pt-[30px]">
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
