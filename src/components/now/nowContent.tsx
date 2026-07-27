import type { ReactNode } from 'react'

export type HeroVariantId = 'A' | 'B' | 'D1' | 'D2'
export type TreatmentId = 't0' | 't1' | 't2' | 't3'

// Locked copy (2026-07-27): hero B + no beliefs block (t0) — beliefs block
// parked until the wording is revisited. Alternates stay reachable via ?panel.
export const DEFAULT_HERO: HeroVariantId = 'B'
export const DEFAULT_TREATMENT: TreatmentId = 't0'

export interface HeroVariant {
  label: string
  heading: ReactNode
  sub: string
}

export const HERO_VARIANTS: Record<HeroVariantId, HeroVariant> = {
  A: {
    label: 'A · everyday products',
    heading: (
      <>i enjoy thinking about the products we use everyday. <em>and then building them.</em></>
    ),
    sub: "right now that means applying AI inside real businesses (dkBuilds) — i sit with the people doing the work, build the system, and stay until it's actually used.",
  },
  B: {
    label: 'B · people who cared',
    heading: (
      <>the products we use everyday are testaments of people who <em>cared.</em> now i&apos;m building mine</>
    ),
    sub: "today that means applying AI inside real businesses (dkBuilds). AI is making it economically viable to do the thing you're uniquely curious about. so this is me doing mine.",
  },
  D1: {
    label: 'D1 · hybrid',
    heading: (
      <>everyday products are built by people who <em>cared</em>. i think about them constantly. and then i build my own.</>
    ),
    sub: "right now: applying AI inside real businesses (dkBuilds). because AI is making it economically viable to do the thing you're uniquely curious about — this is me doing mine.",
  },
  D2: {
    label: 'D2 · hybrid, tighter',
    heading: (
      <>i build products because the ones i use everyday were built by people who <em>cared</em>.</>
    ),
    sub: "today that's applied AI inside real businesses (dkBuilds) — betting on a world where doing the thing you're uniquely curious about becomes economically viable. this is mine.",
  },
}

export const TREATMENT_LABELS: Record<TreatmentId, string> = {
  t0: 'none (locked)',
  t1: 'classic beliefs block',
  t2: 'woven single line',
  t3: 'spare',
}
