'use client'

import type { ReactNode } from 'react'

import { tabEntryClass } from '@/components/shell/tabEntry'

/** A tab's content on its own route (/writes): enters like the home panes. */
export default function TabPane({ children }: { children: ReactNode }) {
  return <div className={tabEntryClass()}>{children}</div>
}
