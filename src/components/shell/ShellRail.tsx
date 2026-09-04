'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { useShellTab } from '@/components/shell/ShellChrome'
import NamePills from '@/components/shell/NamePills'
import RailMoreIcons from '@/components/shell/RailMoreIcons'
import { TAB_IDS } from '@/components/shell/useHashTab'
import ArticleSections from '@/components/writes/ArticleSections'

const EASE = [0.22, 1, 0.36, 1] as const

export default function ShellRail() {
  const { activeTab, selectTab, articleFocus } = useShellTab()

  return (
    <div className="flex flex-col">
      {/* Name slot: fixed height so the name ⇄ back-button swap never shifts layout */}
      <div className="relative h-[23px]">
        <AnimatePresence initial={false}>
          {articleFocus ? (
            <motion.div
              key="back"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.28, ease: EASE, delay: 0.1 } }}
              exit={{ opacity: 0, x: 8, transition: { duration: 0.15 } }}
              className="absolute left-0 top-0"
            >
              <Link
                href="/writes"
                className="group flex items-center gap-1.5 whitespace-nowrap text-[15px] font-medium tracking-[-0.01em] text-[#888] transition-colors hover:text-[#0A0A0B] focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-0.5"
                >
                  <path
                    d="M5.5 4L1.5 8M1.5 8L5.5 12M1.5 8H10C11.3807 8 12.5 6.88071 12.5 5.5V5.5C12.5 4.11929 11.3807 3 10 3H8.5"
                    stroke="currentColor"
                  />
                </svg>
                writes
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.28, ease: EASE, delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="absolute left-0 top-0"
            >
              <NamePills />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {articleFocus && <ArticleSections />}

      {/* Tabs collapse upward into the name while reading an article */}
      <motion.nav
        aria-label="sections"
        aria-hidden={articleFocus || undefined}
        initial={false}
        animate={articleFocus ? 'collapsed' : 'open'}
        variants={{
          open: {
            height: 'auto',
            transition: { duration: 0.3, ease: EASE, staggerChildren: 0.04, delayChildren: 0.05 },
          },
          collapsed: {
            height: 0,
            transition: { duration: 0.3, ease: EASE, staggerChildren: 0.03, staggerDirection: -1 },
          },
        }}
        className={cn(
          'mt-3 flex flex-row items-center gap-[18px] overflow-hidden md:mt-4 md:flex-col md:items-start md:gap-3',
          articleFocus && 'pointer-events-none'
        )}
      >
        {TAB_IDS.map((tab) => (
          <motion.button
            key={tab}
            type="button"
            tabIndex={articleFocus ? -1 : undefined}
            variants={{
              open: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE } },
              collapsed: { opacity: 0, y: -12, transition: { duration: 0.18, ease: EASE } },
            }}
            onClick={() => selectTab(tab)}
            aria-current={activeTab === tab ? 'page' : undefined}
            className={cn(
              'border-b-[1.5px] border-transparent pb-0.5 text-sm tracking-[-0.005em] text-[#999] transition-colors duration-200 hover:text-[#666] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A0A0B]',
              activeTab === tab && 'border-[#0A0A0B] font-semibold text-[#0A0A0B]'
            )}
          >
            {tab}
          </motion.button>
        ))}
      </motion.nav>

      {/* Bottom-left "more" cluster; fades while reading an article. */}
      <motion.div
        initial={false}
        animate={articleFocus ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.25, ease: EASE }}
        className={cn(articleFocus && 'pointer-events-none')}
        aria-hidden={articleFocus || undefined}
      >
        <RailMoreIcons />
      </motion.div>
    </div>
  )
}
