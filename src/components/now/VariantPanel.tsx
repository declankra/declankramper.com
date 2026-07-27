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
