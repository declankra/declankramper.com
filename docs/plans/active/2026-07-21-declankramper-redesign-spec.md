---
title: declankramper.com redesign spec
date: 2026-07-19
status: locked except hero copy + written-content treatment
type: design-spec
---

# declankramper.com redesign spec

> **Repo copy** (snapshotted 2026-07-21). The living original is in the Obsidian vault at `~/Obsidian/jarvis/declankramper.com redesign spec.md` — if the two diverge, the Obsidian file wins; re-copy after meaningful edits. `[[wikilinks]]` below resolve only inside the vault.

> The implementation-ready spec for the declankramper.com redesign. Decided interactively with mockups on 2026-07-19; supersedes Part 1 of [[website redesign prompt]] (which remains useful for original inspiration links and the boneyard).
>
> **Claude artifact (visual reference):** [Interactive redesign mockup](https://claude.ai/code/artifact/3836bd73-6e46-4784-a4e5-387bea5cd009?via=auto_preview) — created from this spec and referenced while implementing the redesign.
> **Repo:** `/Users/macbook/Code/declankramper.com/`
> **Strategic context:** [[ApplyingToJobs/strategy/online-identity]] (four surfaces) · [[ApplyingToJobs/strategy/positioning]] (who I am)

## Purpose

Personal site = who I am, what I believe, what I build, how I think. Primary audiences in order: (1) recruiters/hiring managers for applied-AI roles (FDE, AI strategist, forward-deployed PM), (2) consulting prospects who click through from dkbuilds.co or LinkedIn, (3) readers/peers. Applied AI consulting is woven into *who I am* on this site; the full business/construction story lives on dkbuilds.co. The construction work appears here as one project among others (tagged "building"), not a centerpiece.

## Decisions (all locked 2026-07-19)

| Decision | Answer |
|---|---|
| Architecture | Single persistent shell, three sections: **now / builds / writes**. Content swaps in place; the shell never moves or reflows. |
| Nav placement | **Vertical left rail.** "declan kramper" top-left; tabs stacked directly beneath the name (small gap, ~16px). Content fills everything right of the rail and scrolls independently. |
| Name hover | Hovering the name extends link pills **to the right of the name, horizontally** (github, linkedin, resume, dkbuilds.co, email). Spring/stagger animation. Floats over content. Future nice-to-have (not now): real brand icons instead of text pills. Mobile: tap toggles; pills wrap below the name. |
| "More" fun stuff | **No fourth tab.** One **horizontal row of footer icons** fixed along the bottom-left: music, game, random, coffee rankings, readme, soundcloud, ✦ mystery. Single row, never two. Muted `#999`, lift + darken on hover. Room to add more icons over time. Copyright bottom-right. |
| now tab | **Spotlight layout, fits one screen, no scroll** (desktop; on mobile the columns stack and may scroll). Text block left (hero + subtitle + beliefs treatment, see TBD), one large media panel right playing a **single montage video** — autoplay, muted, looped — that Declan will create to encompass current work. Small "currently" chip on the video. No rotation dots. |
| builds tab | **Enhanced vertical list** (chronological, newest first). Each row: small visual thumbnail (~120px, 4:3), year, title, one-liner, metric line. "building" badge on in-progress projects. Client testimonial(s) inserted as quiet quote rows between project rows. Row hover: slight translate-x. Scrolls under the fixed shell. |
| writes tab | Reverse-chron list: category pills + date, clickable title, 1–2 sentence preview always visible. No pagination. |
| Article reading | Clicking a title opens the article **inside the shell** — content slides in from the right (~26px translate + fade), nav stays put and visible, "← writes" back affordance at top. Clicking any tab while reading also exits. Articles keep real `/writes/{slug}` URLs (crawlable, shareable) rendered within the persistent shell via a shared layout — the in-shell feel is a transition, not a modal. |
| Hero copy + written-content treatment | **TBD** — variants preserved below; decide later, everything else can build now. |

## Shell spec

- Rail: ~200px fixed column. Name (15px, 600 weight), tabs beneath (14px; active = ink `#0A0A0B` + 600 weight + 1.5px underline; inactive = `#999`, hover `#666`).
- Content column: independent scroll (`overflow-y: auto`); shell and footer icon row never move.
- Tab switch transition: outgoing/incoming content crossfade + rise, opacity 0→1 with translateY 8→0, ~300ms, ease `cubic-bezier(0.22, 1, 0.36, 1)`. Article open uses translateX 26→0 instead ("slides in from the right").
- Tab state shareable via hash (`/#builds`); URL stays `/` for the three sections; `/writes/{slug}` stays a real route.
- Mobile (<760px): rail collapses to a top bar — name up top, tabs horizontal below it, content below; footer icon row stays as a single bottom row; hover interactions become taps (`@media (hover: hover) and (pointer: fine)` gating).
- Reduced motion: all transitions collapse to near-instant under `prefers-reduced-motion`.

## now tab content (structure locked, copy TBD)

Left column: hero statement, subtitle, then one of the written-content treatments. Right column: the montage video panel.

### Hero copy variants (decide later)

- **A · everyday products** — "i enjoy thinking about the products we use everyday. *and then building them.*"
  Sub: "right now that means applying AI inside real businesses (dkBuilds) — i sit with the people doing the work, build the system, and stay until it's actually used."
- **B · people who cared** — "the products we use everyday are testaments of people who *cared*. i've benefited from them my whole life. now i'm building mine."
  Sub: "these days: applying AI inside real businesses as dkBuilds, and shipping my own apps because i can't help myself."
- **D1 · hybrid** — "everyday products are built by people who *cared*. i think about them constantly. and then i build my own."
  Sub: "right now: applying AI inside real businesses (dkBuilds). because AI is making it economically viable to do the thing you're uniquely curious about — this is me doing mine."
- **D2 · hybrid, tighter** — "i build products because the ones i use everyday were built by people who *cared*."
  Sub: "today that's applied AI inside real businesses (dkBuilds) — betting on a world where doing the thing you're uniquely curious about becomes economically viable. this is mine."

Direction note from Declan: the hero should combine the everyday-products and people-who-cared threads; the subtitle should carry the applied-AI work *plus* the thesis (AI making it economically viable to do what you're uniquely curious about — the why behind the consulting work). A/B were both liked; D1/D2 are attempts at the combination.

### Written-content treatments (decide later)

1. **classic** — subtitle + "what i believe" block: label, "**building the right things** — shortening the loop from problem to shipped value.", "**health and fitness, always** — the foundation for an enjoyable great life.", muted line "because both will appreciate in a post-AI world. (the only thing left is your uniqueness.)"
2. **woven** — subtitle + one italic muted line: "two things i believe appreciate in a post-AI world: building the right things, and health. the only thing left is your uniqueness."
3. **spare** — subtitle cut to its first sentence; beliefs replaced by a small "more of what i believe →" link into the writes. The video carries the screen.

### Montage video (Declan to produce)

One looping video encompassing current work (quote-mapping tool, Surgent, writing, etc.). Autoplay, muted, loop, no controls; "currently" chip overlay. Until it exists, a static image or the current ontology-xtract clip can hold the slot.

## builds tab content

- Data: keep `FinishedProjectsData.ts` as source but **add structured fields**: `metrics` (array of short strings) separate from `subtitle`, so the metric line renders consistently (tabular-nums). Keep `visuals[]` for thumbnails.
- Order: currently-building rows first (badge), then shipped, newest → oldest. Year shown per row (year group markers optional; the flat list with per-row years worked in mockups).
- Testimonials: existing `testimonials` data rendered as italic quote rows with attribution, interleaved between project rows (mockup placed one after the 4th row; placement editorial, not algorithmic).
- Metrics to refresh at implementation: Surgent is **4,374+ users, $3.1k annualized run-rate 11 days after launch, 38% D1** (current copy still says "170+ waitlist signups" / "just went live" — stale).

## writes tab content

Same content model as today (`content/posts/*.md`, gray-matter frontmatter). List shows pills + date + title + preview. Article view: title, meta line (date · categories · read time), prose at ~620px measure, 15px/1.75 body.

## Visual system (unchanged)

- Palette: white ground, ink `#0A0A0B`, secondary `#666`, muted `#999`, hairlines `#eee`, hover blob `#f0f0f0`. Thumbnails/placeholder media: soft zinc gradients.
- Type: Plus Jakarta Sans everywhere (already loaded via next/font).
- Motion: framer-motion; "snappy" ease `cubic-bezier(0.22, 1, 0.36, 1)` for transitions, springs (stiffness ~400, damping ~20) for the name-pill stagger; scale(1.02) + shadow lift on cards; `transform: scale(0.97)` on `:active` for buttons; 44px minimum hit areas on mobile.
- Spark background: keep as ambient effect, subtle, behind content (open sub-question from the original brief: all tabs or just now — decide in implementation, default to now-only).
- Stack: Next.js 16 (App Router), Tailwind, shadcn, framer-motion, Vercel. Analytics: PostHog + OpenPanel. All machine-readable endpoints (`/candidate`, `/candidate.md`, `/resume.json`, `/llms.txt`, `/llms-full.txt`) and `candidate-profile.ts` stay as-is.

## Implementation cleanups (do during the redesign)

1. **Draft filter for /writes**: `content/posts/format.md` ("Your Title Here", dated 1999) currently leaks into the list and gets a real page — add a `draft:` frontmatter flag (or exclude `format.md`) in `src/lib/blog.ts`.
2. **Duplicate route**: `/everything-i-built` and `/builds` render the same component — make `/everything-i-built` a redirect to `/builds` (or drop it) so there's one canonical URL.
3. **Structured metrics** on projects (see builds section) instead of metrics baked into free-text subtitles.
4. **Stale copy**: update Surgent metrics everywhere (see above).
5. **CLAUDE.md** in the repo says Next.js 14; actual is 16 — fix while in there.
6. Tailwind v4 is installed but a v3-style `tailwind.config.ts` is still shimmed via `@config` — optional tidy-up, don't block the redesign on it.
7. Old homepage elements being replaced: the "Declan builds products." hero + hover-expand lines, the 4-column `BottomNavigation` grid (its Core/Fun/About/Recent-writes contents redistribute into the new tabs and footer icon row), and the game/music/random entries move to footer icons. Keep the underlying features (game, ambient audio, random) — they're just re-homed.

## Future explorations (explicitly not in this build)

- **Scroll-morph nav**: as the user scrolls builds/writes, the three nav links morph into a scroll-progress indicator (and morph back on scroll-up / at top). Declan wants this *feeling* eventually; interaction design TBD in a later round. Build the rail so the tab list can animate/transform without layout shift.
- Real brand icons (GitHub, LinkedIn, etc.) in the name hover pills.
- Dynamic text ("pretext", chenglou) somewhere in the now tab.
- An imagery section (qy.co inspiration) — photos, quotes he's inspired by.
- Substack "life" vs "applied ai" sections (separate surface, see [[ApplyingToJobs/strategy/online-identity]]).

## Decisions addendum (2026-07-21, plan session)

- **Hash tabs confirmed** over the route-backed experiment found uncommitted in the repo (top-bar `PortfolioShell` + `/builds`,`/writes` pages) — that work is discarded/rebuilt; the route-group *shape* stays for `/` + `/writes/[slug]`. Legacy `/builds`, `/writes`, `/everything-i-built` redirect to `/#builds` / `/#writes`.
- **Vertical left rail confirmed** (per this spec; the uncommitted top bar was not it).
- **Spark background: now-tab only** (spec default accepted; fades out on tab switch).
- **Hero copy + treatment decided in-browser**: the mockup's control panel ships on the real site gated behind `/?panel` (localStorage-persisted). D1 + classic render as defaults until picked.
- **Footer icon row ships with seven icons** (interview 2026-07-21): music, game, random, **runs** (→ `/runs`), readme, **resume** (→ `/resume`), **soundcloud** (→ soundcloud.com/declank10). Icons keep their existing interactive/animated designs — polish, don't flatten; new ResumeIcon + SoundcloudIcon built as animated siblings. coffee / ✦ added when destinations exist.
- **Metrics rule** (interview, corrected): Declan-supplied numbers are valid and ship — Surgent (spec), quote-mapping ("452 line decisions reconciled to the cent"), race-time-calculator ("2,790+ users · 48k+ predictions"), and any numbers already in existing subtitles. The ONE hold: the "85% / ~$96k" procurement wording, until verified.
- **Builds row interaction** (interview): title → external link; thumbnail → lightbox of all project visuals (ported from old list). **Testimonial:** `tyler-feedback-2` interleaved; construction-client quote swaps in once approved.
- **Writes tab** (interview): plain list — search + category filter dropped. Articles keep reading-progress + prev/next.
- **Name-pill email** (interview): declankramper@gmail.com. **Analytics** (interview): PostHog `tab_switch` event on tab clicks.
- **Implementation plan:** `declankramper.com repo → docs/superpowers/plans/2026-07-21-portfolio-shell-redesign.md` (8 tasks, includes the full interview-decisions log).

## Open items checklist

- [ ] Pick hero copy (A / B / D1 / D2 or a new blend) — compare live via `/?panel` once built
- [ ] Pick written-content treatment (classic / woven / spare) — same panel
- [ ] Produce the montage video (holding slot: ontology-xtract clip)
- [x] Decide spark background scope — **now-only** (2026-07-21)
- [ ] Confirm testimonial attribution wording with clients before publishing
- [ ] Verify + supply publishable wording for the construction procurement metrics (the "85% / ~$96k" line is the only number held out of the build)
- [ ] Get construction-client approval for a testimonial quote (then swap it in for tyler-feedback-2 in `BuildsTab`)
- [x] Provide soundcloud URL — **soundcloud.com/declank10** (2026-07-21); coffee rankings / ✦ destinations still open
