'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import SparkBackground from '@/components/home/SparkBackground'
import { useShellTab } from '@/components/shell/ShellChrome'
import { useShellFeatures } from '@/components/shell/ShellFeaturesContext'
import VariantPanel from '@/components/now/VariantPanel'
import {
  DEFAULT_HERO,
  DEFAULT_TREATMENT,
  HERO_VARIANTS,
  type HeroVariantId,
  type TreatmentId,
} from '@/components/now/nowContent'

export default function NowTab() {
  const { activeTab, tabReady } = useShellTab()
  const { audioElement, audioReactive } = useShellFeatures()
  const [hero, setHero] = useState<HeroVariantId>(DEFAULT_HERO)
  const [treatment, setTreatment] = useState<TreatmentId>(DEFAULT_TREATMENT)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Saved picks only apply while exploring with ?panel — without it the
    // locked defaults always render (a stale localStorage value would
    // otherwise shadow copy changes shipped after a panel session).
    if (!new URLSearchParams(window.location.search).has('panel')) return
    const h = window.localStorage.getItem('dk-hero-variant') as HeroVariantId | null
    const t = window.localStorage.getItem('dk-treatment') as TreatmentId | null
    if (h && HERO_VARIANTS[h]) setHero(h)
    if (t && ['t0', 't1', 't2', 't3'].includes(t)) setTreatment(t)
  }, [])

  const v = HERO_VARIANTS[hero]
  const subFirstSentence = `${v.sub.split('. ')[0]}.`
  const mediaActive = tabReady && activeTab === 'now'

  useEffect(() => {
    const video = videoRef.current
    if (!mediaActive || !video) return

    // iOS Safari can ignore the declarative autoplay request when a video is
    // mounted after client-side tab state resolves. Set the muted properties
    // before explicitly starting playback so the first frame never waits for
    // a user gesture.
    video.defaultMuted = true
    video.muted = true

    const startPlayback = () => {
      void video.play().catch(() => {
        // Browsers may reject play() while the document is backgrounded. The
        // autoplay attribute and canplay listener will retry when it is ready.
      })
    }

    startPlayback()
    video.addEventListener('canplay', startPlayback)
    return () => video.removeEventListener('canplay', startPlayback)
  }, [mediaActive])

  return (
    <div className="relative flex h-full flex-col justify-center">
      {/* Spark background: now-tab only (decision 2026-07-21); fades with tab.
          z-0 (not negative): negative z-index paints behind the shell's white
          background, which made the music-reactive sparks invisible. Content
          sits above it via relative z-10. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{ opacity: activeTab === 'now' ? 1 : 0 }}
      >
        {mediaActive ? (
          <SparkBackground audio={audioElement} isActive={audioReactive} />
        ) : null}
      </div>

      <div className="relative z-10 grid items-center gap-[clamp(24px,4vw,60px)] md:grid-cols-[1fr_0.92fr]">
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

        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[clamp(12px,1.4vw,18px)]">
          {mediaActive ? (
            <video
              ref={videoRef}
              className="block h-full w-full object-contain"
              src="/finished/now-product-montage-expanded.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : null}
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
