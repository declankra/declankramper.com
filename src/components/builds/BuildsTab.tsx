import type { ReactNode } from 'react'

import VisualLightbox from '@/components/builds/VisualLightbox'
import {
  currentlyBuildingProjects,
  finishedProjects,
  testimonials,
} from '@/components/finished/FinishedProjectsData'
import type { FinishedProjectVisual } from '@/types/finished'

// Editorial: which testimonial appears after which project row (by id).
const QUOTE_PLACEMENTS: Array<{ afterId: string; testimonialId: string }> = [
  { afterId: 'Surgent', testimonialId: 'tyler-feedback-2' },
  { afterId: 'aspire-hackathon', testimonialId: 'martha-feedback' },
  { afterId: 'psPRD', testimonialId: 'sheldon-feedback' },
  { afterId: 'sunbelt-consulting', testimonialId: 'tyler-feedback-1' },
  { afterId: 'next-level-lawn-care', testimonialId: 'next-level-feedback' },
]

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

interface Row {
  key: string
  year: string
  title: string
  subtitle: string
  metrics?: string[]
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
      href: p.link,
      visuals: p.visuals ?? [],
    })),
    ...finished.map((p) => ({
      key: p.id,
      year: String(p.year),
      title: p.title,
      subtitle: p.subtitle,
      metrics: p.metrics,
      href: p.link ?? p.learnMoreUrl,
      visuals: p.visuals ?? [],
    })),
  ]

  const items: ReactNode[] = []
  rows.forEach((row) => {
    items.push(
      <div key={row.key} className="flex items-start gap-4 border-b border-[#f3f3f4] py-4">
        <VisualLightbox
          visuals={row.visuals}
          title={row.title}
          preloadPreview={row.key === 'construction-quote-mapping'}
        />
        <div className="min-w-0">
          <time className="text-[11px] tabular-nums text-[#999]">{row.year}</time>
          <h3 className="flex items-center gap-1.5 text-[14.5px] font-medium text-[#0A0A0B]">
            {row.href ? (
              <a
                href={row.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-baseline gap-1 transition-colors hover:text-[#666]"
              >
                {row.title}
                <span
                  aria-hidden="true"
                  className="text-[11px] text-[#bbb] transition-colors group-hover:text-[#666]"
                >
                  ↗
                </span>
              </a>
            ) : (
              row.title
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

    const quote = QUOTE_PLACEMENTS.find((q) => q.afterId === row.key)
    if (quote) {
      const t = testimonials.find((x) => x.id === quote.testimonialId)
      if (t) {
        items.push(
          <blockquote
            key={`quote-${t.id}`}
            className="max-w-[560px] border-b border-[#f3f3f4] py-[18px] text-[13px] italic leading-[1.55] text-[#666]"
          >
            “{t.text}”
            <cite className="mt-1.5 block text-[11px] not-italic text-[#999]">
              {t.title} · {MONTHS[t.month - 1]} {t.year}
            </cite>
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
          because ideas are meant to be built, finished, and put out there
        </p>
      </div>
      <div className="max-w-[700px]">{items}</div>
    </div>
  )
}
