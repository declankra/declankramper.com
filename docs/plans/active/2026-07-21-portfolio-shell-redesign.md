# declankramper.com Portfolio Shell Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild declankramper.com as a single persistent shell (vertical left rail, hash-based tabs `now / builds / writes`, footer icon row, in-shell article reading) per the locked spec at `docs/superpowers/specs/2026-07-21-declankramper-redesign-spec.md` (repo copy; living original: `~/Obsidian/jarvis/declankramper.com redesign spec.md`) and the interactive mockup artifact (`https://claude.ai/code/artifact/3836bd73-6e46-4784-a4e5-387bea5cd009`).

**Architecture:** One route group `src/app/(portfolio-shell)/` holds `/` (the three-tab home; tab state in the URL hash, all three panes server-rendered and toggled client-side) and `/writes/[slug]` (real crawlable article routes that render inside the same persistent shell). Old `/builds`, `/writes`, `/everything-i-built` URLs redirect to hash equivalents. Existing fun features (music, game, readme, random) re-home from the old homepage bottom nav into a fixed footer icon row owned by the shell.

**Tech Stack:** Next.js 16 App Router, Tailwind v4, framer-motion 12, existing gray-matter/remark blog pipeline. **No new dependencies.**

## Global Constraints

Copied verbatim from the spec — every task implicitly includes these:

- Palette: white ground, ink `#0A0A0B`, secondary `#666`, muted `#999`, hairlines `#eee`, hover blob `#f0f0f0`.
- Type: Plus Jakarta Sans everywhere (already loaded via next/font in root layout — do not touch).
- Ease: `cubic-bezier(0.22, 1, 0.36, 1)` for transitions; springs stiffness ~400 / damping ~20 for pill stagger.
- Tab switch: crossfade + rise, opacity 0→1 with translateY 8→0, ~300ms. Article open: translateX 26→0 + fade instead.
- Rail: ~200px fixed column. Name 15px/600. Tabs 14px; active = ink + 600 weight + 1.5px underline; inactive `#999`, hover `#666`.
- Content column scrolls independently (`overflow-y: auto`); shell and footer icon row never move. Reset content scroll to top on tab switch.
- Mobile (<768px, Tailwind `md:` breakpoint stands in for the spec's ~760px): rail collapses to a top bar (name up top, tabs horizontal below), content below; footer icon row stays one bottom row; hover interactions become taps.
- Gate hover-only interactions with `@media (hover: hover) and (pointer: fine)` semantics (in practice: framer hover handlers + tap fallbacks). 44px minimum hit areas on touch.
- `prefers-reduced-motion`: all transitions collapse to near-instant (`<MotionConfig reducedMotion="user">` covers framer; keep CSS transitions ≤200ms color-only so no extra guard needed).
- UI chrome copy is lowercase ("declan kramper", "now", "builds", "writes", section intros). Project titles render as authored in data (do NOT CSS-lowercase them — it would mangle "psPRD").
- Machine-readable endpoints stay untouched: `/candidate`, `/candidate.md`, `/resume.json`, `/llms.txt`, `/llms-full.txt`, `src/lib/candidate-profile.ts`.
- `/runs`, `/archive/*`, `/experiment`, `/resume`, `/api/*` routes: untouched. `/runs` becomes unlisted (no nav entry) but stays live.
- Repo has **no test infrastructure** — do not add one. Every task's verification cycle is: `npm run lint` clean, `npm run build` green, plus the explicit browser checks listed in the task (`npm run dev`, check at desktop width and at 375px).
- Commit after every task with the message given in the task.

## Interview Decisions (2026-07-21, resolved with Declan — authoritative)

These answers override any earlier draft assumption; the tasks below already incorporate them:

1. **Metrics rule:** numbers Declan supplied (in the spec, the mockup session, or already on the current site) are valid — ship them. Concretely: Surgent's metric line ships (spec numbers); quote-mapping's "452 line decisions reconciled to the cent" ships (measured result); race-time-calculator ships `2,790+ users · 48k+ predictions` (Declan confirmed valid); numbers already inside existing subtitles (e.g. lawn care's "$30k") stay exactly as written. The ONE exclusion: the construction procurement "85% less admin time / ~$96k/yr" wording — Declan explicitly rejected publishing it until verified, so that entry ships with no metric line. Never invent numbers not supplied by Declan.
2. **Testimonial:** interleave `tyler-feedback-2` only ("…perhaps the GREATEST skill a product person can have."). The construction-client quote swaps in later once approved.
3. **Builds row interaction:** title → external link (new tab); thumbnail click → lightbox modal of all the project's visuals (port the existing Dialog-based modal from `FinishedProjectsList.tsx`). Rows are NOT whole-row links.
4. **Writes tab:** plain list — search box and category filter are dropped.
5. **Footer icon row ships seven icons:** music, game, random, **runs** (→ `/runs`), readme, **resume** (→ `/resume`, opens the resume page), **soundcloud** (→ `https://soundcloud.com/declank10`). Icons KEEP their existing interactive/animated designs (Declan explicitly wants them — polish, don't flatten to static glyphs); the two new icons (ResumeIcon, SoundcloudIcon) are built as animated siblings of the existing ones. Coffee + ✦ still deferred.
6. **Name-pill email:** `mailto:declankramper@gmail.com` (not the dkbuilds address).
7. **Article extras:** keep ReadingProgress and PostNavigation, restyled muted.
8. **Analytics:** capture a PostHog `tab_switch` event in `selectTab` (repo pattern: `usePostHog` from `posthog-js/react`).
9. **Accepted defaults:** dynamic copyright year; ontology-xtract clip as video placeholder; D1 + classic as shipped defaults; brief now-pane flash on deep-loading `/#builds` pre-hydration is acceptable; hero copy + treatment remain open, decided live via `/?panel`.

**Baseline note:** The working tree already contains uncommitted shell work (`src/app/(portfolio-shell)/` route group, `src/components/layout/PortfolioShell.tsx` top bar, deletions of the old `src/app/page.tsx`, `src/app/builds/*`, `src/app/writes/page.tsx`). Decision from Declan (2026-07-21): keep the route-group *shape*, discard everything not aligned with the spec (the top-bar shell, route-backed `/builds` + `/writes` pages). Tasks below do exactly that — do not `git checkout` anything back.

---

### Task 1: Shell foundation — rail, hash tabs, layout

**Files:**
- Create: `src/components/shell/useHashTab.ts`
- Create: `src/components/shell/ShellChrome.tsx`
- Create: `src/components/shell/ShellRail.tsx`
- Create: `src/components/shell/HomeTabs.tsx`
- Rewrite: `src/app/(portfolio-shell)/layout.tsx`
- Rewrite: `src/app/(portfolio-shell)/page.tsx`
- Delete: `src/components/layout/PortfolioShell.tsx`

**Interfaces:**
- Produces: `type TabId = 'now' | 'builds' | 'writes'` and `TAB_IDS` (from `useHashTab.ts`); `useShellTab(): { activeTab: TabId; selectTab: (t: TabId) => void }` (from `ShellChrome.tsx`); `HomeTabs` props `{ now: ReactNode; builds: ReactNode; writes: ReactNode }`; content scroll container has `id="shell-content"`. Tasks 3–7 rely on all of these names exactly.

- [ ] **Step 1: Write the hash-tab hook**

`src/components/shell/useHashTab.ts`:

```ts
'use client'

import { useCallback, useEffect, useState } from 'react'

export type TabId = 'now' | 'builds' | 'writes'

export const TAB_IDS: TabId[] = ['now', 'builds', 'writes']

export function tabFromHash(hash: string): TabId {
  const clean = hash.replace(/^#/, '')
  return (TAB_IDS as string[]).includes(clean) ? (clean as TabId) : 'now'
}

// Tab state lives in the URL hash (spec: "/#builds"; URL stays "/" for the
// three sections). pushState avoids the browser's scroll-to-anchor behavior;
// hashchange/popstate listeners keep back/forward working.
export function useHashTab(): [TabId, (tab: TabId) => void] {
  const [tab, setTabState] = useState<TabId>('now')

  useEffect(() => {
    const sync = () => setTabState(tabFromHash(window.location.hash))
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  const setTab = useCallback((next: TabId) => {
    const url = next === 'now' ? window.location.pathname : `#${next}`
    window.history.pushState(null, '', url)
    setTabState(next)
  }, [])

  return [tab, setTab]
}
```

- [ ] **Step 2: Write ShellChrome (layout skeleton + tab context)**

`src/components/shell/ShellChrome.tsx`. This is the single client owner of shell state. Task 6 will extend it with the feature providers (audio/game/readme); build it now with just rail + content column + context.

```tsx
'use client'

import { createContext, useCallback, useContext, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { MotionConfig } from 'framer-motion'

import { usePostHog } from 'posthog-js/react'

import ShellRail from '@/components/shell/ShellRail'
import { useHashTab, type TabId } from '@/components/shell/useHashTab'

interface ShellTabContextValue {
  activeTab: TabId
  selectTab: (tab: TabId) => void
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
  const [hashTab, setHashTab] = useHashTab()

  const isHome = pathname === '/'
  // On /writes/[slug] the "writes" tab reads as active (spec: article opens
  // inside the shell; nav stays put and visible).
  const activeTab: TabId = isHome
    ? hashTab
    : pathname.startsWith('/writes')
      ? 'writes'
      : hashTab

  const selectTab = useCallback(
    (tab: TabId) => {
      posthog?.capture('tab_switch', { tab })
      if (isHome) {
        setHashTab(tab)
      } else {
        // Reading an article: clicking any tab exits back to the home shell.
        router.push(tab === 'now' ? '/' : `/#${tab}`, { scroll: false })
      }
    },
    [isHome, posthog, router, setHashTab]
  )

  return (
    <MotionConfig reducedMotion="user">
      <ShellTabContext.Provider value={{ activeTab, selectTab }}>
        <div className="flex h-svh flex-col bg-white md:flex-row">
          <aside className="shrink-0 px-5 pt-6 md:w-[200px] md:pb-14 md:pl-[clamp(20px,3.5vw,44px)] md:pr-0 md:pt-[30px]">
            <ShellRail />
          </aside>
          <div
            id="shell-content"
            className="flex-1 overflow-y-auto px-5 pb-24 pt-4 md:pl-[clamp(24px,3vw,40px)] md:pr-[clamp(20px,5vw,64px)] md:pt-[30px]"
          >
            {children}
          </div>
        </div>
      </ShellTabContext.Provider>
    </MotionConfig>
  )
}
```

- [ ] **Step 3: Write ShellRail**

`src/components/shell/ShellRail.tsx`. Plain name mark for now — Task 7 swaps it for the hover-pill component. Tabs are buttons (not links) because tab state is hash state.

```tsx
'use client'

import { cn } from '@/lib/utils'
import { useShellTab } from '@/components/shell/ShellChrome'
import { TAB_IDS } from '@/components/shell/useHashTab'

export default function ShellRail() {
  const { activeTab, selectTab } = useShellTab()

  return (
    <div className="flex flex-col">
      <span className="w-fit whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em] text-[#0A0A0B]">
        declan kramper
      </span>
      <nav
        aria-label="sections"
        className="mt-3 flex flex-row items-center gap-[18px] md:mt-4 md:flex-col md:items-start md:gap-3"
      >
        {TAB_IDS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => selectTab(tab)}
            aria-current={activeTab === tab ? 'page' : undefined}
            className={cn(
              'border-b-[1.5px] border-transparent pb-0.5 text-sm tracking-[-0.005em] text-[#999] transition-colors duration-200 hover:text-[#666] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A0A0B]',
              activeTab === tab && 'border-[#0A0A0B] font-semibold text-[#0A0A0B]'
            )}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  )
}
```

- [ ] **Step 4: Write HomeTabs**

`src/components/shell/HomeTabs.tsx`. All three panes stay mounted (their server-rendered HTML is in the initial document for crawlers); the active one animates in per the spec's crossfade + rise. `initial={false}` means no entrance animation on first paint and inline `opacity:0` on inactive panes during SSR.

```tsx
'use client'

import { useEffect, type ReactNode } from 'react'
import { motion } from 'framer-motion'

import { useShellTab } from '@/components/shell/ShellChrome'
import { TAB_IDS, type TabId } from '@/components/shell/useHashTab'

const EASE = [0.22, 1, 0.36, 1] as const

interface HomeTabsProps {
  now: ReactNode
  builds: ReactNode
  writes: ReactNode
}

export default function HomeTabs({ now, builds, writes }: HomeTabsProps) {
  const { activeTab } = useShellTab()
  const panes: Record<TabId, ReactNode> = { now, builds, writes }

  useEffect(() => {
    document.getElementById('shell-content')?.scrollTo({ top: 0 })
  }, [activeTab])

  return (
    <>
      {TAB_IDS.map((id) => {
        const active = id === activeTab
        return (
          <motion.div
            key={id}
            hidden={!active}
            initial={false}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {panes[id]}
          </motion.div>
        )
      })}
    </>
  )
}
```

- [ ] **Step 5: Rewrite the route-group layout and home page**

`src/app/(portfolio-shell)/layout.tsx`:

```tsx
import type { ReactNode } from 'react'

import ShellChrome from '@/components/shell/ShellChrome'

export default function PortfolioShellLayout({
  children,
}: {
  children: ReactNode
}) {
  return <ShellChrome>{children}</ShellChrome>
}
```

`src/app/(portfolio-shell)/page.tsx` — literal placeholder panes so the shell is checkable now; Tasks 3–5 replace each `<section>` with the real pane components:

```tsx
import HomeTabs from '@/components/shell/HomeTabs'

export default function Home() {
  return (
    <HomeTabs
      now={<section className="text-sm text-[#666]">now pane</section>}
      builds={<section className="text-sm text-[#666]">builds pane</section>}
      writes={<section className="text-sm text-[#666]">writes pane</section>}
    />
  )
}
```

- [ ] **Step 6: Delete the old top-bar shell**

```bash
rm src/components/layout/PortfolioShell.tsx
```

The existing `src/app/(portfolio-shell)/builds/page.tsx` and `writes/page.tsx` still import nothing from it — they're deleted in Task 2. If the build complains about them meanwhile, that's expected only if PortfolioShell was imported there; it is not (they import feature components).

- [ ] **Step 7: Verify**

Run: `npm run lint && npm run build` — expect clean/green.
Run: `npm run dev`, open `http://localhost:3000`:
- Desktop: name top-left, tabs stacked beneath (~16px gap), placeholder pane right of rail. Clicking `builds` swaps the pane with a fade+rise and sets the URL to `/#builds` with no scroll jump. Browser back returns to `now`.
- Load `http://localhost:3000/#builds` directly: builds placeholder is active after hydration.
- 375px width: name on top, tabs horizontal below it, content underneath.

- [ ] **Step 8: Commit**

```bash
git add -A src/components/shell "src/app/(portfolio-shell)" src/components/layout/PortfolioShell.tsx
git commit -m "feat: vertical-rail shell with hash-based tabs"
```

---

### Task 2: Route consolidation + redirects

**Files:**
- Move: `src/app/writes/[slug]/` → `src/app/(portfolio-shell)/writes/[slug]/` (URL unchanged: `/writes/{slug}`)
- Delete: `src/app/(portfolio-shell)/builds/page.tsx`, `src/app/(portfolio-shell)/writes/page.tsx`, `src/app/everything-i-built/` (whole dir)
- Modify: `next.config.js` (add redirects)
- Modify: `src/lib/random.ts:27-32` (projectPages)
- Delete: `NEXT_SESSION_PORTFOLIO_SHELL.md` (superseded by this plan)

**Interfaces:**
- Consumes: shell layout from Task 1 (moving `[slug]` into the group makes articles render inside `ShellChrome`).
- Produces: canonical URLs — `/` (+`#builds`/`#writes`), `/writes/{slug}`. Old `/builds`, `/writes`, `/everything-i-built` 307-redirect to hash URLs.

- [ ] **Step 1: Move the article route into the shell group and drop stale pages**

```bash
git mv "src/app/writes/[slug]" "src/app/(portfolio-shell)/writes/[slug]"
rmdir src/app/writes
git rm -r src/app/everything-i-built
rm "src/app/(portfolio-shell)/builds/page.tsx" && rmdir "src/app/(portfolio-shell)/builds"
rm "src/app/(portfolio-shell)/writes/page.tsx"
rm NEXT_SESSION_PORTFOLIO_SHELL.md
```

(`writes/page.tsx` inside the group is removed but `writes/[slug]/` stays — a segment with no page.tsx is fine; the `/writes` URL itself is handled by redirect below.)

- [ ] **Step 2: Add redirects**

In `next.config.js`, add alongside the existing `rewrites`:

```js
  async redirects() {
    return [
      { source: '/builds', destination: '/#builds', permanent: false },
      { source: '/writes', destination: '/#writes', permanent: false },
      { source: '/everything-i-built', destination: '/#builds', permanent: false },
    ];
  },
```

If `next build` rejects a hash in `destination` (it shouldn't, but verify), fall back to page-level redirects: recreate `src/app/(portfolio-shell)/writes/page.tsx` containing only `import { redirect } from 'next/navigation'; export default function W() { redirect('/#writes') }` and equivalents for the other two sources.

- [ ] **Step 3: Update random destinations**

In `src/lib/random.ts`, replace the `projectPages` array:

```ts
const projectPages = [
  '/#builds',
  '/#writes',
  '/runs',
]
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build` — green.
Run: `npm run dev`, then:
- `curl -sI http://localhost:3000/builds | grep -i location` → `location: /#builds` (same for `/writes`, `/everything-i-built`).
- Open an existing article, e.g. `http://localhost:3000/writes/crazy-does`: it renders **inside the shell** (rail visible, `writes` tab active/underlined). Old styling still there — Task 5 restyles it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: consolidate routes into shell group, redirect legacy URLs to hash tabs"
```

---

### Task 3: Now tab — spotlight layout, hero variants, prototype panel

**Files:**
- Create: `src/components/now/nowContent.tsx` (variant copy data)
- Create: `src/components/now/NowTab.tsx`
- Create: `src/components/now/VariantPanel.tsx`
- Modify: `src/app/(portfolio-shell)/page.tsx` (mount real NowTab)

**Interfaces:**
- Consumes: `useShellTab()` from Task 1 (SparkBackground gating); existing `SparkBackground` component (`src/components/home/SparkBackground.tsx`, props `{ audio: HTMLAudioElement | null; isActive: boolean }`).
- Produces: `HeroVariantId = 'A' | 'B' | 'D1' | 'D2'`, `TreatmentId = 't1' | 't2' | 't3'`, localStorage keys `dk-hero-variant` / `dk-treatment`. `NowTab` takes no props. Task 6 wires real audio into SparkBackground via `useShellFeatures()` — until then NowTab passes `audio={null} isActive={false}`.

- [ ] **Step 1: Write the variant copy data**

`src/components/now/nowContent.tsx` — copy is verbatim from the spec; do not edit wording:

```tsx
import type { ReactNode } from 'react'

export type HeroVariantId = 'A' | 'B' | 'D1' | 'D2'
export type TreatmentId = 't1' | 't2' | 't3'

export const DEFAULT_HERO: HeroVariantId = 'D1'
export const DEFAULT_TREATMENT: TreatmentId = 't1'

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
      <>the products we use everyday are testaments of people who <em>cared</em>. i&apos;ve benefited from them my whole life. now i&apos;m building mine.</>
    ),
    sub: "these days: applying AI inside real businesses as dkBuilds, and shipping my own apps because i can't help myself.",
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
  t1: 'classic beliefs block',
  t2: 'woven single line',
  t3: 'spare',
}
```

- [ ] **Step 2: Write NowTab**

`src/components/now/NowTab.tsx`. Spotlight layout: text left, montage video panel right, fits one desktop screen without scrolling; columns stack on mobile. Holding media until Declan's montage exists: the ontology-xtract clip (`/finished/ontology-xtract/ontology-xtract-preview.web-hq.mp4`).

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import SparkBackground from '@/components/home/SparkBackground'
import { useShellTab } from '@/components/shell/ShellChrome'
import VariantPanel from '@/components/now/VariantPanel'
import {
  DEFAULT_HERO,
  DEFAULT_TREATMENT,
  HERO_VARIANTS,
  type HeroVariantId,
  type TreatmentId,
} from '@/components/now/nowContent'

export default function NowTab() {
  const { activeTab } = useShellTab()
  const [hero, setHero] = useState<HeroVariantId>(DEFAULT_HERO)
  const [treatment, setTreatment] = useState<TreatmentId>(DEFAULT_TREATMENT)

  useEffect(() => {
    const h = window.localStorage.getItem('dk-hero-variant') as HeroVariantId | null
    const t = window.localStorage.getItem('dk-treatment') as TreatmentId | null
    if (h && HERO_VARIANTS[h]) setHero(h)
    if (t && ['t1', 't2', 't3'].includes(t)) setTreatment(t)
  }, [])

  const v = HERO_VARIANTS[hero]
  const subFirstSentence = `${v.sub.split('. ')[0]}.`

  return (
    <div className="relative flex min-h-[calc(100svh-180px)] flex-col justify-center md:min-h-[calc(100svh-140px)]">
      {/* Spark background: now-tab only (decision 2026-07-21); fades with tab */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500"
        style={{ opacity: activeTab === 'now' ? 1 : 0 }}
      >
        <SparkBackground audio={null} isActive={false} />
      </div>

      <div className="grid items-center gap-[clamp(24px,4vw,60px)] md:grid-cols-[1fr_0.92fr]">
        <div>
          <h1 className="max-w-[640px] text-balance text-[clamp(26px,3.4vw,42px)] font-medium leading-[1.16] tracking-[-0.028em] text-[#0A0A0B] [&_em]:italic">
            {v.heading}
          </h1>

          {treatment !== 't3' && (
            <p className="mt-5 max-w-[540px] text-[clamp(14px,1.35vw,16px)] leading-[1.62] text-[#666]">
              {v.sub}
            </p>
          )}

          {treatment === 't1' && (
            <div className="mt-[30px] flex max-w-[540px] flex-col gap-[7px]">
              <div className="mb-[3px] text-[10.5px] uppercase tracking-[0.14em] text-[#999]">
                what i believe
              </div>
              <p className="text-[13.5px] leading-[1.5] text-[#666]">
                <b className="font-semibold text-[#0A0A0B]">building the right things</b> — shortening
                the loop from problem to shipped value.
              </p>
              <p className="text-[13.5px] leading-[1.5] text-[#666]">
                <b className="font-semibold text-[#0A0A0B]">health and fitness, always</b> — the
                foundation for an enjoyable great life.
              </p>
              <p className="text-[13.5px] leading-[1.5] text-[#999]">
                because both will appreciate in a post-AI world. (the only thing left is your
                uniqueness.)
              </p>
            </div>
          )}

          {treatment === 't2' && (
            <p className="mt-4 max-w-[540px] text-[13.5px] italic leading-[1.6] text-[#999]">
              two things i believe appreciate in a post-AI world: building the right things, and
              health. the only thing left is your uniqueness.
            </p>
          )}

          {treatment === 't3' && (
            <>
              <p className="mt-5 max-w-[540px] text-[clamp(14px,1.35vw,16px)] leading-[1.62] text-[#666]">
                {subFirstSentence}
              </p>
              <div className="mt-[26px] text-[12.5px] text-[#999]">
                more of what i believe →{' '}
                <Link
                  href="/#writes"
                  className="text-[#666] underline underline-offset-[3px]"
                >
                  the writes
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="relative aspect-[16/11] overflow-hidden rounded-[14px] border border-[#eee] bg-gradient-to-br from-[#f6f6f7] to-[#e9e9ec]">
          <video
            className="h-full w-full object-cover"
            src="/finished/ontology-xtract/ontology-xtract-preview.web-hq.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <span className="absolute bottom-3 left-3.5 rounded-full bg-white/80 px-2.5 py-1 text-[10.5px] uppercase tracking-[0.08em] text-[#a9a9b0]">
            currently
          </span>
        </div>
      </div>

      <VariantPanel
        hero={hero}
        treatment={treatment}
        onHeroChange={(h) => {
          setHero(h)
          window.localStorage.setItem('dk-hero-variant', h)
        }}
        onTreatmentChange={(t) => {
          setTreatment(t)
          window.localStorage.setItem('dk-treatment', t)
        }}
      />
    </div>
  )
}
```

- [ ] **Step 3: Write VariantPanel**

`src/components/now/VariantPanel.tsx` — the mockup's control panel, ported. Renders only when the URL has `?panel` (so Declan can flip variants on production: `declankramper.com/?panel`). Not linked from anywhere.

```tsx
'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import {
  HERO_VARIANTS,
  TREATMENT_LABELS,
  type HeroVariantId,
  type TreatmentId,
} from '@/components/now/nowContent'

interface VariantPanelProps {
  hero: HeroVariantId
  treatment: TreatmentId
  onHeroChange: (h: HeroVariantId) => void
  onTreatmentChange: (t: TreatmentId) => void
}

export default function VariantPanel({
  hero,
  treatment,
  onHeroChange,
  onTreatmentChange,
}: VariantPanelProps) {
  const [enabled, setEnabled] = useState(false)
  const [minimized, setMinimized] = useState(false)

  useEffect(() => {
    setEnabled(new URLSearchParams(window.location.search).has('panel'))
  }, [])

  if (!enabled) return null

  const segButton = (on: boolean) =>
    cn(
      'rounded-lg border border-[#2c2c30] px-2 py-1 text-[11.5px] transition-colors',
      on
        ? 'border-[#f4f4f5] bg-[#f4f4f5] font-semibold text-[#111]'
        : 'text-[#8b8b90] hover:text-[#f4f4f5]'
    )

  return (
    <aside className="fixed bottom-4 right-4 z-50 w-[272px] overflow-hidden rounded-[14px] bg-[#161618] text-[#f4f4f5] shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
      <header
        className="flex cursor-pointer select-none items-center justify-between px-3.5 py-3"
        onClick={() => setMinimized((m) => !m)}
      >
        <b className="text-xs">variant controls</b>
        <span className="text-[11px] text-[#8b8b90]">{minimized ? 'show' : 'hide'}</span>
      </header>
      {!minimized && (
        <div className="flex flex-col gap-3 px-3.5 pb-3.5">
          <div>
            <div className="mb-1.5 text-[10px] uppercase tracking-[0.12em] text-[#8b8b90]">
              hero copy
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(HERO_VARIANTS) as HeroVariantId[]).map((id) => (
                <button key={id} type="button" className={segButton(hero === id)} onClick={() => onHeroChange(id)}>
                  {HERO_VARIANTS[id].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[10px] uppercase tracking-[0.12em] text-[#8b8b90]">
              written content treatment
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(TREATMENT_LABELS) as TreatmentId[]).map((id) => (
                <button key={id} type="button" className={segButton(treatment === id)} onClick={() => onTreatmentChange(id)}>
                  {TREATMENT_LABELS[id]}
                </button>
              ))}
            </div>
          </div>
          <p className="border-t border-[#2c2c30] pt-2.5 text-[10.5px] leading-[1.5] text-[#8b8b90]">
            selection persists in this browser via localStorage. remove ?panel from the URL to hide.
          </p>
        </div>
      )}
    </aside>
  )
}
```

- [ ] **Step 4: Mount NowTab**

In `src/app/(portfolio-shell)/page.tsx`, replace the `now` placeholder:

```tsx
import HomeTabs from '@/components/shell/HomeTabs'
import NowTab from '@/components/now/NowTab'

export default function Home() {
  return (
    <HomeTabs
      now={<NowTab />}
      builds={<section className="text-sm text-[#666]">builds pane</section>}
      writes={<section className="text-sm text-[#666]">writes pane</section>}
    />
  )
}
```

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run build` — green.
Browser:
- `/` desktop: hero D1 left, ontology-xtract video looping right with "currently" chip, beliefs block below sub, everything fits one screen without content-column scroll. Spark particles visible behind content; switch to builds → sparks fade out.
- `/?panel`: dark panel bottom-right; clicking `B` and `spare` swaps copy instantly; reload keeps the selection; plain `/` hides the panel but keeps the selection.
- 375px: columns stack (text then video), may scroll.

- [ ] **Step 6: Commit**

```bash
git add src/components/now "src/app/(portfolio-shell)/page.tsx"
git commit -m "feat: spotlight now tab with hero/treatment variant prototyping panel"
```

---

### Task 4: Builds tab — enhanced list with metrics + testimonials

**Files:**
- Modify: `src/types/finished.ts` (add `metrics`)
- Modify: `src/components/finished/FinishedProjectsData.ts` (refresh copy, add verified metrics, add quote-mapping entry)
- Create: `src/components/builds/VisualLightbox.tsx`
- Create: `src/components/builds/BuildsTab.tsx`
- Modify: `src/app/(portfolio-shell)/page.tsx` (mount BuildsTab)

**Interfaces:**
- Consumes: `finishedProjects`, `currentlyBuildingProjects`, `testimonials` exports from `FinishedProjectsData.ts`; `FinishedProjectVisual` type; `Dialog`, `DialogOverlay`, `DialogPortal` from `@/components/ui/dialog` (same primitives the old `FinishedProjectsList.tsx` lightbox uses — it is your porting reference).
- Produces: `BuildsTab` (server component, no props); `VisualLightbox` (client) props `{ visuals: FinishedProjectVisual[]; title: string }`. `metrics?: string[]` on `FinishedProject` and `CurrentlyBuildingProject`.

- [ ] **Step 1: Add the metrics field**

In `src/types/finished.ts`, add to **both** `FinishedProject` and `CurrentlyBuildingProject`:

```ts
    metrics?: string[]; // short metric strings, rendered as one tabular-nums line
```

- [ ] **Step 2: Refresh data**

In `src/components/finished/FinishedProjectsData.ts`:

1. Add a new first entry to `currentlyBuildingProjects` (this is the flagship Elite AI quote-mapping work; no visuals yet → BuildsTab renders a gradient placeholder):

```ts
    {
        id: 'construction-quote-mapping',
        title: 'Construction Quote Mapping',
        subtitle: 'Vendor quote PDFs in, bid comparison + POs out. Built with and for real estimators.',
        metrics: ['in production trial', '452 line decisions reconciled to the cent'],
    },
```

2. On the `Surgent` entry (`id: 'Surgent'`), replace the stale subtitle and add metrics:

```ts
        subtitle: 'iOS running app for objective performance progress. Designed, built, shipped solo.',
        metrics: ['4,374+ users', '$3.1k run-rate 11 days after launch', '38% D1'],
```

3. On the `race-time-calculator` entry, add (Declan confirmed these numbers):

```ts
        metrics: ['2,790+ users', '48k+ predictions'],
```

4. **Do NOT add a metric line to `construction-industry-agent`** — Declan explicitly rejected the "85% / ~$96k" wording until verified. Every other entry: leave subtitles (including any numbers already in them) exactly as written; more metric lines get added over time as Declan supplies numbers.

- [ ] **Step 3: Write VisualLightbox**

`src/components/builds/VisualLightbox.tsx` — client component: the row thumbnail + a modal cycling through ALL the project's visuals (interview decision: thumb→lightbox preserves the old list's richest proof). Before writing it, open `src/components/finished/FinishedProjectsList.tsx:140-240` — it has the working Dialog composition for this repo's shadcn dialog; mirror whatever primitives it actually uses (it imports `Dialog`, `DialogOverlay`, `DialogPortal`). If radix warns about a missing `DialogTitle`, add one with an sr-only class.

```tsx
'use client'

import { useState } from 'react'

import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import type { FinishedProjectVisual } from '@/types/finished'

interface VisualLightboxProps {
  visuals: FinishedProjectVisual[]
  title: string
}

export default function VisualLightbox({ visuals, title }: VisualLightboxProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const frame =
    'relative aspect-[4/3] w-[96px] shrink-0 overflow-hidden rounded-[10px] border border-[#eee] bg-gradient-to-br from-[#f6f6f7] to-[#e9e9ec] md:w-[120px]'

  const first = visuals[0]
  if (!first) {
    return (
      <div className={`${frame} flex items-center justify-center text-lg font-semibold text-[#c2c2c8]`}>
        {title.charAt(0).toLowerCase()}
      </div>
    )
  }

  const current = visuals[Math.min(index, visuals.length - 1)]

  return (
    <>
      <button
        type="button"
        aria-label={`view ${title} visuals`}
        className={`${frame} cursor-zoom-in transition-opacity hover:opacity-90`}
        onClick={() => {
          setIndex(0)
          setOpen(true)
        }}
      >
        {first.type === 'video' ? (
          <video className="h-full w-full object-cover" src={first.src} autoPlay muted loop playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="h-full w-full object-cover" src={first.src} alt={first.alt ?? title} loading="lazy" />
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/60" />
          <div
            className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,900px)] -translate-x-1/2 -translate-y-1/2"
            onClick={() => setOpen(false)}
          >
            <div
              className="overflow-hidden rounded-[14px] bg-white p-2"
              onClick={(e) => e.stopPropagation()}
            >
              {current.type === 'video' ? (
                <video
                  className="max-h-[80vh] w-full object-contain"
                  src={current.src}
                  autoPlay
                  muted
                  loop
                  controls
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="max-h-[80vh] w-full object-contain" src={current.src} alt={current.alt ?? title} />
              )}
              {visuals.length > 1 && (
                <div className="flex items-center justify-center gap-3 p-2 text-[12px] text-[#666]">
                  <button
                    type="button"
                    className="px-2 py-1 transition-colors hover:text-[#0A0A0B]"
                    onClick={() => setIndex((index - 1 + visuals.length) % visuals.length)}
                  >
                    ←
                  </button>
                  <span className="tabular-nums text-[#999]">
                    {index + 1} / {visuals.length}
                  </span>
                  <button
                    type="button"
                    className="px-2 py-1 transition-colors hover:text-[#0A0A0B]"
                    onClick={() => setIndex((index + 1) % visuals.length)}
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogPortal>
      </Dialog>
    </>
  )
}
```

- [ ] **Step 4: Write BuildsTab**

`src/components/builds/BuildsTab.tsx` — server component. Currently-building rows first (badge), then finished newest→oldest. Interview decisions applied: title → external link (new tab) when the project has one; thumbnail → lightbox; rows are NOT whole-row anchors; `tyler-feedback-2` interleaved after the 4th row. Row hover translate-x is pure CSS.

```tsx
import type { ReactNode } from 'react'

import VisualLightbox from '@/components/builds/VisualLightbox'
import {
  currentlyBuildingProjects,
  finishedProjects,
  testimonials,
} from '@/components/finished/FinishedProjectsData'
import type { FinishedProjectVisual } from '@/types/finished'

// Editorial: which testimonial appears after which row index (0-based).
// Swap in the construction-client quote here once the client approves wording.
const INTERLEAVED_QUOTES: Array<{ afterIndex: number; testimonialId: string }> = [
  { afterIndex: 3, testimonialId: 'tyler-feedback-2' },
]

interface Row {
  key: string
  year: string
  title: string
  subtitle: string
  metrics?: string[]
  building: boolean
  href?: string
  visuals: FinishedProjectVisual[]
}

export default function BuildsTab() {
  const finished = [...finishedProjects].sort(
    (a, b) => b.year - a.year || b.month - a.month
  )

  const rows: Row[] = [
    ...currentlyBuildingProjects.map((p) => ({
      key: p.id,
      year: 'now',
      title: p.title,
      subtitle: p.subtitle,
      metrics: p.metrics,
      building: true,
      href: p.link,
      visuals: p.visuals ?? [],
    })),
    ...finished.map((p) => ({
      key: p.id,
      year: String(p.year),
      title: p.title,
      subtitle: p.subtitle,
      metrics: p.metrics,
      building: false,
      href: p.link ?? p.learnMoreUrl,
      visuals: p.visuals ?? [],
    })),
  ]

  const items: ReactNode[] = []
  rows.forEach((row, i) => {
    items.push(
      <div
        key={row.key}
        className="flex items-start gap-4 border-b border-[#f3f3f4] py-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1"
      >
        <VisualLightbox visuals={row.visuals} title={row.title} />
        <div className="min-w-0">
          <time className="text-[11px] tabular-nums text-[#999]">{row.year}</time>
          <h3 className="flex items-center gap-1.5 text-[14.5px] font-medium text-[#0A0A0B]">
            {row.href ? (
              <a
                href={row.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[#666]"
              >
                {row.title}
              </a>
            ) : (
              row.title
            )}
            {row.building && (
              <span className="rounded-full bg-[#0A0A0B] px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-white">
                building
              </span>
            )}
          </h3>
          <p className="mb-1 mt-0.5 text-[12.5px] leading-[1.45] text-[#666]">{row.subtitle}</p>
          {row.metrics && row.metrics.length > 0 && (
            <div className="text-[11.5px] tabular-nums text-[#999]">
              {row.metrics.join(' · ')}
            </div>
          )}
        </div>
      </div>
    )

    const quote = INTERLEAVED_QUOTES.find((q) => q.afterIndex === i)
    if (quote) {
      const t = testimonials.find((x) => x.id === quote.testimonialId)
      if (t) {
        items.push(
          <blockquote
            key={`quote-${t.id}`}
            className="max-w-[560px] border-b border-[#f3f3f4] py-[18px] text-[13px] italic leading-[1.55] text-[#666]"
          >
            “{t.text}”
            <cite className="mt-1.5 block text-[11px] not-italic text-[#999]">{t.title}</cite>
          </blockquote>
        )
      }
    }
  })

  return (
    <div>
      <div className="mb-6 mt-1 max-w-[640px]">
        <h2 className="mb-1.5 text-[15px] font-semibold text-[#0A0A0B]">builds</h2>
        <p className="text-[13.5px] leading-[1.5] text-[#999]">
          everything i&apos;ve built, 2013 → now. production AI platforms to a chrome extension.
        </p>
      </div>
      <div className="max-w-[700px]">{items}</div>
    </div>
  )
}
```

- [ ] **Step 5: Mount BuildsTab**

In `src/app/(portfolio-shell)/page.tsx`, replace the builds placeholder with `<BuildsTab />` (add `import BuildsTab from '@/components/builds/BuildsTab'`).

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build` — green.
Browser `/#builds`:
- Building rows first ("Construction Quote Mapping" with badge and gradient placeholder thumb, then Ontology-Xtract with looping video thumb), then finished projects newest first with per-row years.
- Surgent row shows the metric line `4,374+ users · $3.1k run-rate 11 days after launch · 38% D1` and no "170+ waitlist" copy anywhere. Race Time Calculator shows `2,790+ users · 48k+ predictions`. Construction Industry Agent shows NO metric line.
- Clicking a project title opens its live link in a new tab; clicking a thumbnail opens the lightbox — check a multi-visual project (Construction Industry Agent has 3 images: ← → arrows cycle, counter reads 1/3) and Esc/outside-click closes it.
- One italic quote row after the 4th row: "…perhaps the GREATEST skill a product person can have." — Director of Product Management, Client.
- Rows nudge right ~4px on hover; list scrolls under the fixed rail (rail never moves).

- [ ] **Step 7: Commit**

```bash
git add src/types/finished.ts src/components/finished/FinishedProjectsData.ts src/components/builds "src/app/(portfolio-shell)/page.tsx"
git commit -m "feat: enhanced builds list with structured metrics and interleaved testimonial"
```

---

### Task 5: Writes tab + in-shell article reading + draft filter

**Files:**
- Create: `src/components/writes/WritesTab.tsx`
- Create: `src/components/writes/ArticleTransition.tsx`
- Modify: `src/lib/blog.ts` (draft filter)
- Modify: `content/posts/format.md` (add `draft: true`)
- Rewrite: `src/app/(portfolio-shell)/writes/[slug]/page.tsx` (in-shell article styling)
- Modify: `src/app/(portfolio-shell)/page.tsx` (mount WritesTab)

**Interfaces:**
- Consumes: `getAllPosts()`, `getPostBySlug()`, `getAdjacentPosts()` from `src/lib/blog.ts`; `BlogPostSummary` type; `formatDateUTC` from `src/lib/date.ts`; existing `ReadingProgress`, `PostNavigation` components.
- Produces: `WritesTab` props `{ posts: BlogPostSummary[] }`; `ArticleTransition` props `{ children: ReactNode }`. Draft posts (frontmatter `draft: true`) excluded from lists, adjacent-nav, static params, and direct rendering (404).

- [ ] **Step 1: Draft filter in blog.ts**

In `src/lib/blog.ts`, add after `toBlogPostSummary`:

```ts
function isDraft(data: Record<string, unknown>): boolean {
  return data.draft === true;
}
```

In `getPostSummaryBySlugCached`, after `const { data } = matter(fileContents);` add:

```ts
    if (isDraft(data as Record<string, unknown>)) {
      return null;
    }
```

In `getPostBySlugCached`, after `const { data, content } = matter(fileContents);` add:

```ts
    if (isDraft(data as Record<string, unknown>)) {
      return null;
    }
```

- [ ] **Step 2: Flag the template post as draft**

In `content/posts/format.md` frontmatter, add the line `draft: true` after `title`.

- [ ] **Step 3: Write WritesTab**

`src/components/writes/WritesTab.tsx` — server component, list per mockup (no search box, no category filter, no pagination; the full list is short):

```tsx
import Link from 'next/link'

import type { BlogPostSummary } from '@/types/blog'
import { formatDateUTC } from '@/lib/date'

export default function WritesTab({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <div>
      <div className="mb-6 mt-1 max-w-[640px]">
        <h2 className="mb-1.5 text-[15px] font-semibold text-[#0A0A0B]">writes</h2>
        <p className="text-[13.5px] leading-[1.5] text-[#999]">
          thinking out loud, crystallized. applied AI, products, and some life.
        </p>
      </div>
      <div className="max-w-[680px]">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-[#f3f3f4] py-[18px]">
            <div className="mb-1.5 flex items-center gap-2">
              {post.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[#eee] px-2 py-[3px] text-[10px] uppercase tracking-[0.08em] text-[#999]"
                >
                  {c.toLowerCase()}
                </span>
              ))}
              <time className="text-[11px] tabular-nums text-[#999]" dateTime={post.date}>
                {formatDateUTC(post.date, { year: 'numeric', month: 'short' })}
              </time>
            </div>
            <h3 className="mb-1 text-base font-semibold">
              <Link
                href={`/writes/${post.slug}`}
                className="text-[#0A0A0B] no-underline hover:underline hover:underline-offset-[3px]"
              >
                {post.title}
              </Link>
            </h3>
            <p className="text-[13.5px] leading-[1.55] text-[#666]">{post.preview}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write ArticleTransition**

`src/components/writes/ArticleTransition.tsx` — the spec's "slides in from the right" (translateX 26→0 + fade):

```tsx
'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export default function ArticleTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 26 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 5: Rewrite the article page**

Rewrite `src/app/(portfolio-shell)/writes/[slug]/page.tsx`. Keep `generateStaticParams`, `generateMetadata`, data fetching, `ReadingProgress`, and `PostNavigation` exactly as they are today; replace the rendered JSX. Remove `BreadcrumbNav`, `ScrollbarsActivator`, and `Badge` imports. New body (spec: title, meta line `date · categories · read time`, prose at ~620px measure, 15px/1.75 body, "← writes" back affordance at top):

```tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, adjacentPosts] = await Promise.all([
    getPostBySlug(slug),
    getAdjacentPosts(slug),
  ]);

  if (!post) {
    notFound();
  }

  const words = post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(words / 220));

  return (
    <ArticleTransition>
      <article id="writes-post-root" className="max-w-[620px] pb-16">
        <ReadingProgress />
        <Link
          href="/#writes"
          className="mb-[22px] inline-flex items-center gap-1.5 text-[12.5px] text-[#999] transition-colors hover:text-[#0A0A0B]"
        >
          ← writes
        </Link>
        <h1 className="mb-2 text-[clamp(22px,2.6vw,30px)] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0A0A0B]">
          {post.title}
        </h1>
        <div className="mb-[26px] text-xs text-[#999]">
          {formatDateUTC(post.date, { year: 'numeric', month: 'long', day: 'numeric' })} ·{' '}
          {post.categories.map((c) => c.toLowerCase()).join(', ')} · {readMinutes} min read
        </div>
        <div
          className="blog-content text-[15px] leading-[1.75] text-[#333]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <PostNavigation previous={adjacentPosts.previous} next={adjacentPosts.next} />
      </article>
    </ArticleTransition>
  );
}
```

Adjust imports at the top of the file accordingly (`import Link from 'next/link'`, `import ArticleTransition from '@/components/writes/ArticleTransition'`; drop the removed component imports). Check how the current file renders `post.content` (the existing `blog-content`/prose class names) and keep whatever class hook the existing `globals.css` blog styles target so embedded media styling still applies — the container above assumes `blog-content`; if the current file uses a different class, keep that one. Check `PostNavigation`'s actual props signature in `src/components/blog/PostNavigation.tsx` before wiring (it may take `{ previous, next }` or the whole `adjacentPosts` object — match it).

- [ ] **Step 6: Mount WritesTab**

Final `src/app/(portfolio-shell)/page.tsx`:

```tsx
import { getAllPosts } from '@/lib/blog'
import HomeTabs from '@/components/shell/HomeTabs'
import NowTab from '@/components/now/NowTab'
import BuildsTab from '@/components/builds/BuildsTab'
import WritesTab from '@/components/writes/WritesTab'

export default async function Home() {
  const posts = await getAllPosts()
  return (
    <HomeTabs
      now={<NowTab />}
      builds={<BuildsTab />}
      writes={<WritesTab posts={posts} />}
    />
  )
}
```

- [ ] **Step 7: Verify**

Run: `npm run lint && npm run build` — green. Build output must NOT include `/writes/format`.
Browser:
- `/#writes`: pills + date + title + always-visible preview per row; "Your Title Here" (format.md) absent.
- Click a title → article slides in from the right (~26px), rail stays perfectly still, `writes` tab still underlined. `← writes` returns to the list tab. Clicking `builds` while reading exits to the builds tab.
- `http://localhost:3000/writes/format` → 404.
- Direct-load `http://localhost:3000/writes/crazy-does` (fresh tab): article renders inside the shell — real, crawlable URL.

- [ ] **Step 8: Commit**

```bash
git add src/components/writes src/lib/blog.ts content/posts/format.md "src/app/(portfolio-shell)"
git commit -m "feat: writes tab with in-shell article reading and draft filter"
```

---

### Task 6: Footer icon row + feature re-homing (music, game, readme, random)

**Files:**
- Create: `src/components/shell/ShellFeaturesContext.tsx`
- Create: `src/components/shell/FooterIconRow.tsx`
- Create: `src/components/home/SoundcloudIcon.tsx`
- Create: `src/components/home/ResumeIcon.tsx`
- Modify: `src/components/shell/ShellChrome.tsx` (mount providers + footer row)
- Modify: `src/components/now/NowTab.tsx` (wire real audio into SparkBackground)

**Interfaces:**
- Consumes: `AmbientAudio` + `AmbientAudioControls` (`@/components/music/AmbientAudio`), `showIosMusicToast` (`@/components/music/IosMusicToast`), `GameProvider`/`useGame` (`@/components/game/GameContext`), dynamic `CursorTrail` + `FusionFrenzyGameContent` (`@/components/game/*`), dynamic `ReadmeDialog` (`@/components/readme/ReadmeDialog`), `getRandomDestination` (`@/lib/random`), existing icon components `MusicIcon`, `GameIcon`, `RandomIcon`, `RunIcon`, `ReadmeIcon` from `src/components/home/`.
- Produces: `useShellFeatures(): { audioElement: HTMLAudioElement | null; audioReactive: boolean }` for NowTab's SparkBackground; `SoundcloudIcon` + `ResumeIcon` (new, modeled on the existing icon components' animated pattern).

**Interview decision (hard requirement):** the existing icon components are animated/interactive micro-designs and Declan explicitly wants that character KEPT in the footer row — polish them, do not replace them with static glyphs. Open each icon component first (`MusicIcon.tsx`, `GameIcon.tsx`, `RandomIcon.tsx`, `RunIcon.tsx`, `ReadmeIcon.tsx`), understand its built-in animation, and adapt only size/color to the muted row (base `#999`, ink on hover, 2px lift). `SoundcloudIcon` and `ResumeIcon` must follow the same pattern — study `MusicIcon.tsx`/`ReadmeIcon.tsx` and build each as a sibling with its own small interactive touch, not a plain SVG. (A document/page motif suits ResumeIcon; keep it distinct from ReadmeIcon at a glance.)

- [ ] **Step 1: Write ShellFeaturesContext**

`src/components/shell/ShellFeaturesContext.tsx`:

```tsx
'use client'

import { createContext, useContext } from 'react'

export interface ShellFeaturesValue {
  audioElement: HTMLAudioElement | null
  audioReactive: boolean
}

export const ShellFeaturesContext = createContext<ShellFeaturesValue>({
  audioElement: null,
  audioReactive: false,
})

export function useShellFeatures(): ShellFeaturesValue {
  return useContext(ShellFeaturesContext)
}
```

- [ ] **Step 2: Write FooterIconRow**

`src/components/shell/FooterIconRow.tsx`. Port the handler logic from the old `src/components/home/HomePageClient.tsx:34-51` (game/music/readme handlers) — that file is your reference until Task 8 deletes it. One horizontal row, fixed bottom-left, gradient fade behind so content scrolls under it; copyright fixed bottom-right. Config-driven so adding soundcloud/coffee/✦ later is one line each (they are intentionally absent until Declan supplies destinations).

```tsx
'use client'

import { useCallback, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import AmbientAudio, { type AmbientAudioControls } from '@/components/music/AmbientAudio'
import { showIosMusicToast } from '@/components/music/IosMusicToast'
import { useGame } from '@/components/game/GameContext'
import { getRandomDestination } from '@/lib/random'
import MusicIcon from '@/components/home/MusicIcon'
import GameIcon from '@/components/home/GameIcon'
import RandomIcon from '@/components/home/RandomIcon'
import RunIcon from '@/components/home/RunIcon'
import ReadmeIcon from '@/components/home/ReadmeIcon'
import ResumeIcon from '@/components/home/ResumeIcon'
import SoundcloudIcon from '@/components/home/SoundcloudIcon'
import { ShellFeaturesContext } from '@/components/shell/ShellFeaturesContext'

const CursorTrail = dynamic(() => import('@/components/game/CursorTrail'), { ssr: false })
const FusionFrenzyGameContent = dynamic(
  () => import('@/components/game/FusionFrenzyGameContent'),
  { ssr: false }
)
const ReadmeDialog = dynamic(
  () => import('@/components/readme/ReadmeDialog').then((mod) => mod.ReadmeDialog),
  { ssr: false }
)

export default function FooterIconRow({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { setGameState, gameState } = useGame()
  const [isReadmeOpen, setIsReadmeOpen] = useState(false)
  const [readmeOrigin, setReadmeOrigin] = useState({ x: 0, y: 0 })
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [audioState, setAudioState] = useState({ isPlaying: false, isMuted: false })
  const audioControlsRef = useRef<AmbientAudioControls | null>(null)

  const handleMusic = useCallback(() => {
    audioControlsRef.current?.togglePlayback()
    showIosMusicToast()
  }, [])

  const handleGame = useCallback(() => setGameState('instructions'), [setGameState])

  const handleReadme = useCallback((e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setReadmeOrigin({ x: rect.left + rect.width / 2, y: rect.top })
    setIsReadmeOpen(true)
  }, [])

  const handleRandom = useCallback(() => {
    router.push(getRandomDestination())
  }, [router])

  const icons: Array<{
    id: string
    title: string
    icon: React.ReactNode
    onClick?: (e: React.MouseEvent) => void
    href?: string
  }> = [
    { id: 'music', title: 'music', icon: <MusicIcon />, onClick: handleMusic },
    { id: 'game', title: 'game', icon: <GameIcon />, onClick: handleGame },
    { id: 'random', title: 'random', icon: <RandomIcon />, onClick: handleRandom },
    { id: 'runs', title: 'runs', icon: <RunIcon />, href: '/runs' },
    { id: 'readme', title: 'readme', icon: <ReadmeIcon />, onClick: handleReadme },
    { id: 'resume', title: 'resume', icon: <ResumeIcon />, href: '/resume' },
    { id: 'soundcloud', title: 'soundcloud', icon: <SoundcloudIcon />, href: 'https://soundcloud.com/declank10' },
    // room to grow (spec): coffee rankings, ✦ — add when destinations exist
  ]

  return (
    <ShellFeaturesContext.Provider
      value={{ audioElement, audioReactive: audioState.isPlaying && !audioState.isMuted }}
    >
      {children}

      {gameState === 'active' && <CursorTrail />}
      {gameState !== 'inactive' && <FusionFrenzyGameContent />}
      <AmbientAudio
        ref={audioControlsRef}
        onAudioReady={setAudioElement}
        onAudioStateChange={setAudioState}
      />
      <ReadmeDialog open={isReadmeOpen} onOpenChange={setIsReadmeOpen} origin={readmeOrigin} />

      <div className="fixed bottom-0 left-5 z-[5] flex items-center gap-4 bg-gradient-to-t from-white from-70% to-white/0 pb-3.5 pr-2.5 pt-2.5 md:left-[clamp(20px,3.5vw,44px)]">
        {icons.map((item) => {
          const itemClass =
            "relative p-1 text-[#999] transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:text-[#0A0A0B] after:absolute after:-inset-2.5 after:content-[''] [&_svg]:h-4 [&_svg]:w-4"
          if (item.href) {
            const external = !item.href.startsWith('/')
            return external ? (
              <a key={item.id} href={item.href} target="_blank" rel="noreferrer" title={item.title} aria-label={item.title} className={itemClass}>
                {item.icon}
              </a>
            ) : (
              <Link key={item.id} href={item.href} title={item.title} aria-label={item.title} className={itemClass}>
                {item.icon}
              </Link>
            )
          }
          return (
            <button key={item.id} type="button" title={item.title} aria-label={item.title} onClick={item.onClick} className={itemClass}>
              {item.icon}
            </button>
          )
        })}
      </div>
      <span className="fixed bottom-4 right-5 z-[4] text-[11px] text-[#c6c6cb] md:right-[clamp(20px,5vw,64px)]">
        © {new Date().getFullYear()} declan kramper
      </span>
    </ShellFeaturesContext.Provider>
  )
}
```

Note: per the interview decision above, each icon component's built-in interactive animation is KEPT — adapt only size (`h-4 w-4` via the `[&_svg]` selector; adjust if an icon isn't a plain svg root) and colors (muted `#999` base → ink on hover, 2px row lift). If an icon hard-codes colors that fight the muted row, edit the icon component to accept `currentColor` rather than stripping its animation. The `after:` pseudo-element gives the 44px hit area.

- [ ] **Step 3: Mount in ShellChrome**

In `src/components/shell/ShellChrome.tsx`: import `GameProvider` from `@/components/game/GameContext` and `FooterIconRow`; wrap the shell div:

```tsx
      <ShellTabContext.Provider value={{ activeTab, selectTab }}>
        <GameProvider>
          <FooterIconRow>
            <div className="flex h-svh flex-col bg-white md:flex-row">
              {/* ...aside + #shell-content unchanged... */}
            </div>
          </FooterIconRow>
        </GameProvider>
      </ShellTabContext.Provider>
```

Also add bottom padding so the last content row scrolls clear of the fixed footer row: `#shell-content` already has `pb-24` — keep it.

- [ ] **Step 4: Wire real audio into SparkBackground**

In `src/components/now/NowTab.tsx`, replace `<SparkBackground audio={null} isActive={false} />` with:

```tsx
const { audioElement, audioReactive } = useShellFeatures()
// ...
<SparkBackground audio={audioElement} isActive={audioReactive} />
```

(import `useShellFeatures` from `@/components/shell/ShellFeaturesContext`).

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run build` — green.
Browser:
- Icon row fixed bottom-left on every view (all three tabs AND an article page), seven icons in order: music, game, random, runs, readme, resume, soundcloud; copyright bottom-right shows the current year; content scrolls underneath the gradient.
- Each icon still performs its interactive micro-animation (compare against the old homepage nav if unsure) — muted `#999` base, ink + 2px lift on row hover.
- music toggles ambient audio; with audio playing, sparks on the now tab react.
- game launches the FusionFrenzy overlay from the builds tab too (provider is shell-level now).
- readme opens the dialog from any tab; random navigates somewhere valid (repeat 5×; hash destinations land on the right tab); runs navigates to `/runs`; resume navigates to `/resume`; soundcloud opens `soundcloud.com/declank10` in a new tab.
- 375px: single row, no wrapping, taps work, hit areas comfortable.

- [ ] **Step 6: Commit**

```bash
git add src/components/shell src/components/now/NowTab.tsx src/components/home/SoundcloudIcon.tsx src/components/home/ResumeIcon.tsx
git commit -m "feat: footer icon row (music, game, random, runs, readme, resume, soundcloud) at shell level"
```

---

### Task 7: Name hover pills

**Files:**
- Create: `src/components/shell/NamePills.tsx`
- Modify: `src/components/shell/ShellRail.tsx` (use NamePills)

**Interfaces:**
- Consumes: `candidateLinks` from `@/lib/candidate-profile` (linkedin, dkBuilds).
- Produces: `NamePills` (no props), replacing the plain name span in ShellRail.

- [ ] **Step 1: Write NamePills**

`src/components/shell/NamePills.tsx`. Desktop: hovering the name extends link pills horizontally to the right, spring/stagger, floating over content. Mobile: tap toggles; pills wrap below the name; tap outside dismisses. Name itself is NOT a link (mockup: `cursor: default`; "now" tab is home).

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { candidateLinks } from '@/lib/candidate-profile'

const PILLS = [
  { label: 'github', href: 'https://github.com/declankra' },
  { label: 'linkedin', href: candidateLinks.linkedin },
  { label: 'resume', href: '/resume' },
  { label: 'dkbuilds.co', href: candidateLinks.dkBuilds },
  { label: 'email', href: 'mailto:declankramper@gmail.com' }, // interview decision: gmail, not the dkbuilds address
]

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 20 }

export default function NamePills() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Tap-outside dismiss (mobile)
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const pills = (
    <AnimatePresence>
      {open &&
        PILLS.map((pill, i) => (
          <motion.a
            key={pill.label}
            href={pill.href}
            target={pill.href.startsWith('/') ? undefined : '_blank'}
            rel={pill.href.startsWith('/') ? undefined : 'noreferrer'}
            initial={{ opacity: 0, x: -6, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -6, scale: 0.95, transition: { duration: 0.12, delay: 0 } }}
            transition={{ ...SPRING, delay: i * 0.05 }}
            whileHover={{ scale: 1.06 }}
            className="inline-flex h-[23px] items-center whitespace-nowrap rounded-full border border-[#eee] bg-white px-[9px] text-[11px] text-[#666] no-underline transition-colors hover:text-[#0A0A0B]"
          >
            {pill.label}
          </motion.a>
        ))}
    </AnimatePresence>
  )

  return (
    <div
      ref={wrapRef}
      className="relative flex w-fit items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label="declan kramper — links"
        onClick={() => setOpen((o) => !o)}
        className="cursor-default whitespace-nowrap border-none bg-transparent p-0 text-[15px] font-semibold tracking-[-0.01em] text-[#0A0A0B]"
      >
        declan kramper
      </button>
      {/* Desktop: pills float to the right of the name, over content */}
      <span className="absolute left-[calc(100%+10px)] top-1/2 z-20 hidden -translate-y-1/2 gap-1.5 md:flex">
        {pills}
      </span>
      {/* Mobile: pills wrap below the name */}
      <span className="absolute left-0 top-[calc(100%+6px)] z-20 flex max-w-[80vw] flex-wrap gap-1.5 md:hidden">
        {pills}
      </span>
    </div>
  )
}
```

Note: `mouseenter/leave` doesn't fire on touch devices (tap triggers click → toggle), which gives the `(hover: hover)` gating without a media query. Rendering `pills` twice is fine — only one wrapper is visible per breakpoint, but BOTH mount, which would double-trigger AnimatePresence; to avoid duplicate DOM/animation cost, gate with a `useMediaQuery`-style check instead if it visibly stutters: simplest is `hidden md:flex` / `flex md:hidden` as written (both animate, invisible one is display:none — acceptable).

- [ ] **Step 2: Use it in ShellRail**

In `src/components/shell/ShellRail.tsx`, replace the name `<span>…declan kramper…</span>` with `<NamePills />` (add import).

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build` — green.
Browser:
- Desktop: hover the name → five pills spring out rightward with ~50ms stagger, floating over pane content; they don't reflow the rail or the content column. Mouse away → they retract. Each opens the right destination (github/declankra, linkedin, `/resume`, dkbuilds.co, mailto).
- 375px: tap name → pills wrap below the name; tap elsewhere dismisses.
- Keyboard: tab to the name button, Enter toggles, pills are focusable.

- [ ] **Step 4: Commit**

```bash
git add src/components/shell
git commit -m "feat: name hover link pills with spring stagger"
```

---

### Task 8: Cleanup, polish, QA

**Files:**
- Delete: `src/components/home/HomePageClient.tsx`, `src/components/home/BottomNavigation.tsx`, `src/components/home/HomeProductHighlight.tsx`, `src/components/home/ProductCarousel.tsx`, `src/components/finished/FinishedProjectsList.tsx`, `src/components/finished/scrollbar.css`
- Delete (only if unreferenced after the above — grep first): `src/components/home/BuildIcon.tsx`, `WriteIcon.tsx`, `ContactIcon.tsx`, `BizIcon.tsx`, `src/components/layout/BreadcrumbNav.tsx`, `src/components/blog/BlogList.tsx` + its child components (`CategoryFilter`, search input usage — interview decision: search and category filter are permanently dropped, not ported), `src/components/layout/ScrollbarsActivator.tsx`
- Keep: `src/components/home/RunIcon.tsx`, `MusicIcon.tsx`, `GameIcon.tsx`, `RandomIcon.tsx`, `ReadmeIcon.tsx`, `ResumeIcon.tsx`, `SoundcloudIcon.tsx` — all used by the footer icon row
- Modify: `src/app/layout.tsx` (remove empty Header/Footer stubs), `src/components/layout/Header.tsx` + `Footer.tsx` (delete), `CLAUDE.md`

**Interfaces:**
- Consumes: everything from Tasks 1–7. Produces: nothing new — this task removes the old world.

- [ ] **Step 1: Delete superseded components**

For each file in the delete list: `grep -rn "<Name>" src/` first. Delete only when the sole remaining references are within other files being deleted. Known safe immediately: `HomePageClient`, `BottomNavigation`, `HomeProductHighlight`, `ProductCarousel`, `FinishedProjectsList` (+ `scrollbar.css`). `WriteIcon`/`RunIcon` etc. die with `BottomNavigation` unless `/runs` or archive pages import them — check. `BreadcrumbNav`/`BlogList`/`ScrollbarsActivator` may still be used by `/runs` or `/archive/*` — if so, LEAVE them.

- [ ] **Step 2: Remove root-layout chrome stubs**

`src/components/layout/Header.tsx` and `Footer.tsx` are empty stubs rendering nothing. Delete both files and remove their imports + `<Header />` / `<Footer />` usage from `src/app/layout.tsx` (keep skip-link, providers, Toaster untouched).

- [ ] **Step 3: Update CLAUDE.md**

In `CLAUDE.md`: change "Next.js 14 with App Router" → "Next.js 16 with App Router"; under Directory Structure, replace the line about individual project pages with: "`(portfolio-shell)/` — persistent-shell route group: `/` (hash-tab home: now/builds/writes) and `/writes/[slug]` (articles render in-shell); legacy `/builds`, `/writes`, `/everything-i-built` redirect to hash URLs (next.config.js)".

- [ ] **Step 4: Motion + a11y audit**

- Toggle "reduce motion" in OS settings: tab switches, article slide, pills must be near-instant (MotionConfig covers framer; verify SparkBackground respects it or is acceptable as ambient).
- Keyboard-only pass: tab order reaches name → tabs → content links → footer icons; `aria-current="page"` on active tab; visible focus rings.
- `console` clean on all routes (no hydration warnings — especially around `hidden` panes and NamePills).

- [ ] **Step 5: Full verification sweep**

Run: `npm run lint && npm run build` — green, and the route list shows `/`, `/writes/[slug]` (SSG ○ or ●), redirects working, no `/writes/format`.
Browser matrix (desktop + 375px):
- `/` → now; `/#builds` → builds; `/#writes` → writes; back/forward cycles tabs.
- `/builds` (old URL) → redirected to `/#builds` with builds pane active.
- Article: open from list (slide-in), direct URL load, back affordance, tab-click exit.
- All four footer features + five name pills.
- No layout shift of rail/footer at any point (watch while switching tabs and opening articles).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove superseded homepage/nav components, update CLAUDE.md, polish pass"
```

---

## Explicitly Deferred (do NOT build)

Spec's "future explorations" + open content items — listed so no task scope-creeps into them:

- Scroll-morph nav (tabs → scroll-progress indicator). Build the rail so the tab list *can* animate later — the current flex-column with no height coupling satisfies this.
- Real brand icons in the name pills (text pills for now).
- Pretext/dynamic text; imagery/quotes section; Substack sections.
- Montage video production (holding slot: ontology-xtract clip) — Declan produces.
- Final hero copy + treatment pick — Declan decides live via `/?panel`.
- Construction-client testimonial quote (swaps in for `tyler-feedback-2` once the client approves wording) — Declan.
- Verified metric lines for race-time-calculator, construction-industry-agent, and others — Declan supplies numbers; until then those rows ship without metric lines (hard rule: nothing unverified).
- coffee rankings / ✦ mystery footer icons — add each when a destination exists (one config line in `FooterIconRow`).
- Tailwind v4 config tidy-up (`@config` shim) — optional, separate change.
