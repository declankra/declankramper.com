'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { useShellTab } from '@/components/shell/ShellChrome'
import NamePills from '@/components/shell/NamePills'
import RailMoreIcons from '@/components/shell/RailMoreIcons'
import { TAB_IDS } from '@/components/shell/useHashTab'

const EASE = [0.22, 1, 0.36, 1] as const

export default function ShellRail() {
  const { activeTab, selectTab, articleFocus } = useShellTab()

  return (
    <div className="flex flex-col">
      {/* Name slot: fixed height so the name ⇄ back-button swap never shifts layout */}
      <div className="relative h-[23px]">
        <AnimatePresence initial={false}>
          {articleFocus ? (
            <motion.button
              key="back"
              type="button"
              onClick={() => selectTab('writes')}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.28, ease: EASE, delay: 0.1 } }}
              exit={{ opacity: 0, x: 8, transition: { duration: 0.15 } }}
              className="group absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap border-none bg-transparent p-0 text-[15px] font-semibold tracking-[-0.01em] text-[#0A0A0B]"
            >
              <span
                aria-hidden="true"
                className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-0.5"
              >
                ←
              </span>
              writes
            </motion.button>
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
