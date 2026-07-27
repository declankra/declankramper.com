import type { ReactNode } from 'react'

import ShellChrome from '@/components/shell/ShellChrome'

export default function PortfolioShellLayout({
  children,
}: {
  children: ReactNode
}) {
  return <ShellChrome>{children}</ShellChrome>
}
