'use client'

import { createContext, useContext } from 'react'

export interface ShellFeaturesValue {
  audioElement: HTMLAudioElement | null
  audioReactive: boolean
  /** feature actions owned by the shell (FooterIconRow hosts the machinery);
   * consumed by the rail's more-icons cluster */
  toggleMusic: () => void
  openGame: () => void
  openReadme: (e: React.MouseEvent) => void
  goRandom: () => void
}

export const ShellFeaturesContext = createContext<ShellFeaturesValue>({
  audioElement: null,
  audioReactive: false,
  toggleMusic: () => undefined,
  openGame: () => undefined,
  openReadme: () => undefined,
  goRandom: () => undefined,
})

export function useShellFeatures(): ShellFeaturesValue {
  return useContext(ShellFeaturesContext)
}
