import type { Metadata } from 'next'

import StoplightBook from '@/components/stoplights/StoplightBook'
import { STOPLIGHTS } from '@/components/stoplights/stoplights'

const DESCRIPTION = 'a collection of stoplights from around the world'

export const metadata: Metadata = {
  title: 'stoplights',
  description: DESCRIPTION,
  openGraph: {
    title: 'stoplights | Declan Kramper',
    description: DESCRIPTION,
    url: '/stoplights',
    siteName: 'Declan Kramper',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'stoplights | Declan Kramper',
    description: DESCRIPTION,
  },
}

export default function StoplightsPage() {
  return (
    <div className="mt-1 max-w-[760px]">
      <h1 className="sr-only">stoplights</h1>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/stoplights/japan-1200.webp"
        srcSet="/stoplights/japan-640.webp 640w, /stoplights/japan-1200.webp 1200w"
        sizes="(min-width: 768px) 400px, calc(100vw - 40px)"
        width={1200}
        height={1600}
        alt="A red pedestrian signal in Japan: a little red man in a hat, glowing in front of a glass office building at golden hour"
        fetchPriority="high"
        className="h-auto w-full max-w-[400px] rounded-[14px] border border-[#eee] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
      />

      <div className="mt-6 max-w-[540px] text-[13.5px] leading-[1.6] text-[#666]">
        <p>
          among all my travels, i&apos;ve always noticed the stop lights. different shapes,
          behaviors, sounds. idk why they stuck out to me, but they do. i think they can tell you
          just a little bit about the country, almost like they can talk.
        </p>
        <p className="mt-3">
          here&apos;s a collection of stoplights from places i&apos;ve been around the world
        </p>
      </div>

      <section aria-label="the collection" className="mt-12">
        <StoplightBook stoplights={STOPLIGHTS} />
      </section>

      <details className="group mt-14 max-w-[540px] text-[12px] leading-[1.6] text-[#999]">
        <summary className="w-fit cursor-pointer list-none rounded-sm transition-colors duration-150 hover:text-[#666] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A0A0B] [&::-webkit-details-marker]:hidden">
          photo credits <span className="inline-block transition-transform duration-200 group-open:rotate-90">›</span>
        </summary>
        <ul className="mt-3 space-y-1">
          <li>japan — mine</li>
          {STOPLIGHTS.map(({ slug, country, credit }) => (
            <li key={slug}>
              {country} —{' '}
              <a
                href={credit.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#ddd] underline-offset-[3px] transition-colors hover:text-[#666]"
              >
                {credit.author}
              </a>
              ,{' '}
              <a
                href={credit.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#ddd] underline-offset-[3px] transition-colors hover:text-[#666]"
              >
                {credit.license}
              </a>
              , via {credit.site} (cropped)
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
