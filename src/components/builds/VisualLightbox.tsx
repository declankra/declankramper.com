'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useShellTab } from '@/components/shell/ShellChrome'
import { Dialog, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog'
import type { FinishedProjectVisual } from '@/types/finished'

interface VisualLightboxProps {
  visuals: FinishedProjectVisual[]
  title: string
}

export default function VisualLightbox({ visuals, title }: VisualLightboxProps) {
  const { activeTab, tabReady } = useShellTab()
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const previewVideoRef = useRef<HTMLVideoElement | null>(null)
  const stripRef = useRef<HTMLDivElement | null>(null)
  const slideRefs = useRef<Array<HTMLDivElement | null>>([])
  const indexRef = useRef(0)
  const dragRef = useRef({ down: false, dragged: false, startX: 0, startScroll: 0, pointerId: -1 })
  const suppressClickRef = useRef(false)
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wheelAccRef = useRef(0)
  const wheelLastStepRef = useRef(0)

  const count = visuals.length
  const first = visuals[0]
  const mediaActive = tabReady && activeTab === 'builds'

  useEffect(() => {
    const video = previewVideoRef.current
    if (first?.type !== 'video' || !first.autoplay || !video) return

    if (mediaActive) {
      video.defaultMuted = true
      video.muted = true
      void video.play().catch(() => {
        // Autoplay is an enhancement; the preloaded first frame remains visible.
      })
    } else {
      video.pause()
    }
  }, [first, mediaActive])

  const scrollToIndex = useCallback((i: number, behavior: ScrollBehavior = 'smooth') => {
    slideRefs.current[i]?.scrollIntoView({ behavior, inline: 'center', block: 'nearest' })
  }, [])

  // Escape closes; arrow keys move the strip. (No DialogContent in this
  // composition, so Radix's built-in dismiss handling isn't present.)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') scrollToIndex(Math.max(indexRef.current - 1, 0))
      if (e.key === 'ArrowRight') scrollToIndex(Math.min(indexRef.current + 1, count - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, count, scrollToIndex])

  // A vertical mouse wheel steps between slides; horizontal deltas (trackpad
  // swipes) fall through to native scrolling. Must be a non-passive native
  // listener — React's onWheel can't preventDefault the page scroll.
  useEffect(() => {
    if (!open) return
    const strip = stripRef.current
    if (!strip) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()
      wheelAccRef.current += e.deltaY
      const now = performance.now()
      if (Math.abs(wheelAccRef.current) > 12 && now - wheelLastStepRef.current > 150) {
        const dir = wheelAccRef.current > 0 ? 1 : -1
        scrollToIndex(Math.min(Math.max(indexRef.current + dir, 0), count - 1))
        wheelLastStepRef.current = now
        wheelAccRef.current = 0
      }
    }
    strip.addEventListener('wheel', onWheel, { passive: false })
    return () => strip.removeEventListener('wheel', onWheel)
  }, [open, count, scrollToIndex])

  useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current)
    }
  }, [])

  // Track which slide sits closest to center so keyboard nav stays in sync
  // with free scrolling/swiping.
  const onStripScroll = useCallback(() => {
    const strip = stripRef.current
    if (!strip) return
    const center = strip.scrollLeft + strip.clientWidth / 2
    let nearest = 0
    let nearestDist = Infinity
    slideRefs.current.forEach((el, i) => {
      if (!el) return
      const slideCenter = el.offsetLeft + el.offsetWidth / 2
      const dist = Math.abs(slideCenter - center)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = i
      }
    })
    indexRef.current = nearest
    setIndex(nearest)
  }, [])

  // Mouse drag-to-pan. Snap is disabled while the pointer is down (it would
  // fight manual scrollLeft writes), then restored after settling on the
  // nearest slide. Touch keeps native scrolling. Pointer capture is deferred
  // until the drag threshold is crossed — capturing on pointerdown would
  // retarget the eventual click to the strip, bypassing the media's own click
  // handling and closing the dialog via the backdrop.
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const strip = stripRef.current
    if (!strip) return
    dragRef.current = {
      down: true,
      dragged: false,
      startX: e.clientX,
      startScroll: strip.scrollLeft,
      pointerId: e.pointerId,
    }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const strip = stripRef.current
    if (!drag.down || !strip) return
    const dx = e.clientX - drag.startX
    if (!drag.dragged && Math.abs(dx) > 4) {
      drag.dragged = true
      setDragging(true)
      strip.setPointerCapture(drag.pointerId)
    }
    if (drag.dragged) strip.scrollLeft = drag.startScroll - dx
  }, [])

  const onPointerUp = useCallback(() => {
    const drag = dragRef.current
    if (!drag.down) return
    drag.down = false
    if (drag.dragged) {
      suppressClickRef.current = true
      scrollToIndex(indexRef.current)
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current)
      snapTimeoutRef.current = setTimeout(() => setDragging(false), 400)
    }
  }, [scrollToIndex])

  const onClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return
    suppressClickRef.current = false
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const frame =
    'relative aspect-[4/3] w-[96px] shrink-0 overflow-hidden rounded-[10px] border border-[#eee] bg-gradient-to-br from-[#f6f6f7] to-[#e9e9ec] md:w-[120px]'

  if (!first) {
    return (
      <div className={`${frame} flex items-center justify-center text-lg font-semibold text-[#c2c2c8]`}>
        {title.charAt(0).toLowerCase()}
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        aria-label={`view ${title} visuals`}
        className={`${frame} cursor-zoom-in transition-opacity hover:opacity-90`}
        onClick={() => {
          indexRef.current = 0
          setIndex(0)
          setOpen(true)
        }}
      >
        {first.type === 'video' ? (
          <video
            ref={first.autoplay ? previewVideoRef : undefined}
            className="h-full w-full object-cover"
            src={first.src}
            poster={first.poster}
            preload={first.autoplay ? 'metadata' : 'none'}
            autoPlay={mediaActive && first.autoplay}
            muted
            loop
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="h-full w-full object-cover" src={first.src} alt={first.alt ?? title} loading="lazy" />
        )}
      </button>

      <Dialog open={open && mediaActive} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/60" />
          {/* Full-screen catcher: any click outside the media closes.
              The strip is a scroll-snap filmstrip — the focused visual sits
              centered while the next one peeks in from the right; scroll,
              swipe, drag, or click a peeked card to bring it to center. */}
          <div
            className="fixed inset-0 z-50 flex cursor-default items-center"
            onClick={() => setOpen(false)}
          >
            <DialogTitle className="sr-only">{title} visuals</DialogTitle>
            <div
              ref={stripRef}
              onScroll={onStripScroll}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClickCapture={onClickCapture}
              onDragStart={(e) => e.preventDefault()}
              className={`flex w-full snap-x snap-mandatory items-center gap-4 overflow-x-auto py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                dragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{
                paddingInline: 'max(calc((100vw - min(85vw, 860px)) / 2), 16px)',
                scrollSnapType: dragging ? 'none' : undefined,
              }}
            >
              {visuals.map((visual, i) => (
                <div
                  key={`${visual.src}-${i}`}
                  ref={(el) => {
                    slideRefs.current[i] = el
                  }}
                  className="flex w-[min(85vw,860px)] shrink-0 snap-center items-center justify-center"
                >
                  {/* Clicks live on the media itself: a click on an image never
                      closes (a peeked one centers instead), while clicks in the
                      empty space around it fall through to the backdrop. */}
                  {visual.type === 'video' ? (
                    <video
                      className="max-h-[80vh] max-w-full rounded-[14px]"
                      src={visual.src}
                      poster={visual.poster}
                      preload="metadata"
                      autoPlay
                      muted
                      loop
                      controls
                      playsInline
                      onClick={(e) => {
                        e.stopPropagation()
                        if (i !== index) scrollToIndex(i)
                      }}
                    />
                  ) : visual.type === 'pdf' || visual.pdfSrc ? (
                    <iframe
                      className="h-[75vh] w-full rounded-[14px] border-0"
                      src={visual.pdfSrc ?? visual.src}
                      title={visual.alt ?? title}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="max-h-[80vh] max-w-full rounded-[14px]"
                      src={visual.src}
                      alt={visual.alt ?? title}
                      draggable={false}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (i !== index) scrollToIndex(i)
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogPortal>
      </Dialog>
    </>
  )
}
