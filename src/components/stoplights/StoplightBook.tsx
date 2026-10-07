'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from 'react'
import {
  animate,
  motion,
  motionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { stoplightImage, type Stoplight } from '@/components/stoplights/stoplights'

// A leaf is one sheet of the book: a stoplight on its front, a blank verso on
// its back. It hinges on the spine: 0deg lies on the right-hand stack, -180deg
// on the left. Narrow screens show only the right-hand page.
const FLAT = 0
const TURNED = -180
// Perspective as a multiple of the page width, deeper on one-page screens so
// a lifted page doesn't loom; keep in sync with the book's perspective classes.
const PERSPECTIVE = { spread: 5, single: 7 }
// A turn is a lift and a landing: on-screen movement, so ease-in-out.
const TURN_EASE = [0.645, 0.045, 0.355, 1] as const
const TURN = { duration: 0.9, ease: TURN_EASE }
// Jumps of more than one page riffle through the leaves in between.
const RIFFLE = { duration: 0.55, stagger: 0.035 }
// A released drag finishes from the hand, so it decelerates.
const RELEASE_EASE = [0.22, 1, 0.36, 1] as const
const DRAG_SLOP = 6
const FLICK_SPEED = 0.35 // px per ms
const PAPER = 'bg-[#fbfaf7]'

const rad = (deg: number) => (deg * Math.PI) / 180
const pad = (n: number) => String(n).padStart(2, '0')

// Where a turning leaf's outer edge appears, in page widths from the spine
// (negative: left of it). The perspective origin is the book's centre: the
// spine on a spread, mid-page on one-page screens.
function edgeOffset(angle: number, spread: boolean) {
  const phi = rad(-angle)
  const depth = spread ? PERSPECTIVE.spread : PERSPECTIVE.single
  const origin = spread ? 0 : 0.5
  return origin + (Math.cos(phi) - origin) * (depth / (depth - Math.sin(phi)))
}

// Light falls from the front, so a face darkens as it tilts away from you.
const frontShade = (angle: number) => 0.22 * (1 - Math.cos(rad(-angle)))
const backShade = (angle: number) => 0.22 * (1 - Math.abs(Math.cos(rad(-angle))))

interface Drag {
  pointerId: number
  x: number
  y: number
  lastX: number
  lastT: number
  velocity: number
  // Set once the gesture takes hold of a leaf; null while it may still be a tap.
  leaf: number | null
  forward: boolean
  from: number
  span: number
}

export default function StoplightBook({ stoplights }: { stoplights: Stoplight[] }) {
  const count = stoplights.length
  const [angles] = useState(() => stoplights.map(() => motionValue(FLAT)))
  // The number of turned leaves; leaf `current` is the right-hand page.
  const [current, setCurrent] = useState(0)
  // Two pages side by side, or one (narrow screens).
  const [spread, setSpread] = useState(false)
  // Photos mount a couple of pages ahead so a turn never reveals a blank page.
  const [loadedThrough, setLoadedThrough] = useState(2)
  const currentRef = useRef(0)
  const bookRef = useRef<HTMLDivElement>(null)
  const rightPageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<Drag | null>(null)
  const inViewRef = useRef(false)
  const reduceMotion = useReducedMotion()

  const commit = useCallback((next: number) => {
    currentRef.current = next
    setCurrent(next)
    setLoadedThrough((through) => Math.max(through, next + 2))
  }, [])

  const turnTo = useCallback(
    (target: number) => {
      const from = currentRef.current
      const to = Math.max(0, Math.min(count, target))
      if (to === from || dragRef.current?.leaf != null) return
      commit(to)

      const forward = to > from
      const end = forward ? TURNED : FLAT
      const [lo, hi] = forward ? [from, to] : [to, from]
      for (let leaf = lo; leaf < hi; leaf++) {
        if (reduceMotion) {
          angles[leaf].jump(end)
        } else if (hi - lo === 1) {
          animate(angles[leaf], end, TURN)
        } else {
          const order = forward ? leaf - lo : hi - 1 - leaf
          animate(angles[leaf], end, { ...RIFFLE, delay: order * RIFFLE.stagger, ease: TURN_EASE })
        }
      }
    },
    [angles, commit, count, reduceMotion]
  )

  useEffect(() => {
    const book = bookRef.current
    const page = rightPageRef.current
    if (!book || !page) return
    const observer = new ResizeObserver(() => {
      setSpread(book.offsetWidth > page.offsetWidth * 1.5)
    })
    observer.observe(book)
    return () => observer.disconnect()
  }, [])

  // Arrow keys turn pages while the book is on screen.
  useEffect(() => {
    const book = bookRef.current
    if (!book) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
      },
      { threshold: 0.35 }
    )
    observer.observe(book)

    const onKeyDown = (event: KeyboardEvent) => {
      if (!inViewRef.current || event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        turnTo(currentRef.current + (event.key === 'ArrowRight' ? 1 : -1))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      observer.disconnect()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [turnTo])

  // Pages follow the hand: drag a page across the spine to turn it, flick to
  // throw it, or tap a page to turn it.
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if ((event.target as HTMLElement).closest('button, a')) return
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastT: event.timeStamp,
      velocity: 0,
      leaf: null,
      forward: true,
      from: FLAT,
      span: 1,
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const page = rightPageRef.current
    if (!drag || drag.pointerId !== event.pointerId || !page) return

    if (drag.leaf === null) {
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      if (Math.hypot(dx, dy) < DRAG_SLOP) return
      // Mostly vertical: a scroll, not a turn.
      if (Math.abs(dy) > Math.abs(dx)) {
        dragRef.current = null
        return
      }
      const forward = dx < 0
      const leaf = forward ? currentRef.current : currentRef.current - 1
      if (leaf < 0 || leaf >= count) {
        dragRef.current = null
        return
      }
      const pageRect = page.getBoundingClientRect()
      const fromSpine = Math.abs(drag.x - pageRect.left)
      // On a spread, carrying the grabbed point across the spine to its mirror
      // image is a full turn. A one-page screen has nothing left of the spine:
      // reaching the spine turns the page, and a page width of travel brings
      // the previous one back.
      const reach = Math.max(fromSpine, pageRect.width * 0.35)
      drag.span = spread ? 2 * reach : forward ? reach : pageRect.width
      drag.leaf = leaf
      drag.forward = forward
      angles[leaf].stop()
      drag.from = angles[leaf].get()
      drag.x = event.clientX
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    const elapsed = event.timeStamp - drag.lastT
    if (elapsed > 0) {
      const velocity = (event.clientX - drag.lastX) / elapsed
      drag.velocity = drag.velocity * 0.2 + velocity * 0.8
      drag.lastX = event.clientX
      drag.lastT = event.timeStamp
    }
    const travel = drag.forward ? drag.x - event.clientX : event.clientX - drag.x
    const progress = Math.min(1, Math.max(0, travel / drag.span))
    const end = drag.forward ? TURNED : FLAT
    angles[drag.leaf].set(drag.from + (end - drag.from) * progress)
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null

    if (drag.leaf === null) {
      // A tap: the right-hand page turns forward, the left-hand page back.
      if (event.type === 'pointercancel' || !rightPageRef.current) return
      const spine = rightPageRef.current.getBoundingClientRect().left
      turnTo(currentRef.current + (event.clientX < spine ? -1 : 1))
      return
    }

    const angle = angles[drag.leaf]
    const stillMoving = event.timeStamp - drag.lastT < 80
    const flicked = stillMoving && Math.abs(drag.velocity) > FLICK_SPEED
    const turned = flicked ? drag.velocity < 0 : angle.get() < -90
    commit(turned ? drag.leaf + 1 : drag.leaf)

    const end = turned ? TURNED : FLAT
    if (reduceMotion) {
      angle.jump(end)
      return
    }
    const remaining = Math.abs(end - angle.get()) / 180
    animate(angle, end, { duration: 0.25 + 0.5 * remaining, ease: RELEASE_EASE })
  }

  const atStart = current === 0
  const atEnd = current === count

  return (
    <div className="@container w-full">
      <div className="w-[calc(var(--page-w)+var(--spine))] [--page-w:min(100cqw,420px)] [--spine:0px] @min-[640px]:[--page-w:min(50cqw,380px)] @min-[640px]:[--spine:var(--page-w)]">
        <div
          ref={bookRef}
          role="group"
          aria-roledescription="book"
          aria-label="stoplights from around the world"
          className="relative h-[calc(var(--page-w)*1.4)] cursor-pointer touch-pan-y select-none perspective-[calc(var(--page-w)*7)] @min-[640px]:perspective-[calc(var(--page-w)*5)]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <Stack side="left" depth={current} className="hidden @min-[640px]:block">
            <TitlePage count={count} />
            <CastShadow by={angles[0]} side="left" spread={spread} />
          </Stack>
          <Stack ref={rightPageRef} side="right" depth={count - current} inert={!atEnd}>
            <EndPage onRestart={() => turnTo(0)} />
            <CastShadow by={angles[count - 1]} side="right" spread={spread} />
          </Stack>

          {stoplights.map((stoplight, index) => (
            <Leaf
              key={stoplight.slug}
              index={index}
              count={count}
              angle={angles[index]}
              prevAngle={angles[index - 1]}
              nextAngle={angles[index + 1]}
              visible={index === current}
              spread={spread}
              front={
                <CountryPage
                  stoplight={stoplight}
                  number={index + 1}
                  showPhoto={index <= loadedThrough}
                />
              }
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <NavButton
            label="previous page"
            disabled={atStart}
            onClick={() => turnTo(currentRef.current - 1)}
          >
            <ArrowLeft size={16} strokeWidth={1.6} />
          </NavButton>
          <span aria-hidden="true" className="w-[60px] text-center text-[12px] tabular-nums text-[#999]">
            {atEnd ? 'fin' : `${pad(current + 1)} / ${pad(count)}`}
          </span>
          <NavButton label="next page" disabled={atEnd} onClick={() => turnTo(currentRef.current + 1)}>
            <ArrowRight size={16} strokeWidth={1.6} />
          </NavButton>
          <span aria-live="polite" className="sr-only">
            {atEnd ? 'the end' : `${stoplights[current].country}, ${current + 1} of ${count}`}
          </span>
        </div>
      </div>
    </div>
  )
}

function Leaf({
  index,
  count,
  angle,
  prevAngle,
  nextAngle,
  visible,
  spread,
  front,
}: {
  index: number
  count: number
  angle: MotionValue<number>
  prevAngle?: MotionValue<number>
  nextAngle?: MotionValue<number>
  visible: boolean
  spread: boolean
  front: ReactNode
}) {
  // Stacking follows the side a leaf lies on: on the right the earliest leaf
  // is on top, on the left the latest.
  const zIndex = useTransform(angle, (a) => (a > -90 ? count - index : index) + 1)
  const frontShadeOpacity = useTransform(angle, frontShade)
  const backShadeOpacity = useTransform(angle, backShade)

  return (
    <motion.div
      className="absolute inset-y-0 left-[var(--spine)] w-[var(--page-w)] origin-left transform-3d"
      style={{ rotateY: angle, zIndex }}
    >
      <Face side="front" hidden={!visible}>
        {front}
        {prevAngle && <CastShadow by={prevAngle} side="right" spread={spread} />}
        <Shade opacity={frontShadeOpacity} />
      </Face>
      <Face side="back" hidden>
        {nextAngle && <CastShadow by={nextAngle} side="left" spread={spread} />}
        <Shade opacity={backShadeOpacity} />
      </Face>
    </motion.div>
  )
}

function Face({
  side,
  hidden,
  children,
}: {
  side: 'front' | 'back'
  hidden: boolean
  children: ReactNode
}) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className={cn(
        'absolute inset-0 overflow-hidden backface-hidden',
        PAPER,
        // One-page screens have no left-hand page: a leaf vanishes as it
        // crosses the spine.
        side === 'back' && 'invisible rotate-y-180 @min-[640px]:visible'
      )}
    >
      {children}
      <Gutter side={side === 'front' ? 'left' : 'right'} />
    </div>
  )
}

// Paper curves down into the spine.
function Gutter({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-y-0 w-[8%]',
        side === 'left'
          ? 'left-0 bg-[linear-gradient(to_right,rgba(60,45,20,0.085),rgba(60,45,20,0))]'
          : 'right-0 bg-[linear-gradient(to_left,rgba(60,45,20,0.085),rgba(60,45,20,0))]'
      )}
    />
  )
}

function Shade({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[#141008]"
      style={{ opacity }}
    />
  )
}

// A lifted leaf shades the page it uncovers just past its edge, darkest
// mid-turn.
function CastShadow({
  by,
  side,
  spread,
}: {
  by: MotionValue<number>
  side: 'left' | 'right'
  spread: boolean
}) {
  const x = useTransform(by, (a) => {
    const edge = edgeOffset(a, spread)
    return `${(side === 'right' ? Math.max(0, edge) : Math.min(0, edge)) * 100}%`
  })
  const opacity = useTransform(by, (a) => {
    const over = side === 'right' ? a < 0 && a > -90 : a < -90 && a > -180
    return over ? Math.abs(Math.sin(rad(2 * a))) : 0
  })
  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0',
        side === 'right'
          ? 'bg-[linear-gradient(to_right,rgba(30,22,10,0),rgba(30,22,10,0.24)_4%,rgba(30,22,10,0)_40%)]'
          : 'bg-[linear-gradient(to_left,rgba(30,22,10,0),rgba(30,22,10,0.24)_4%,rgba(30,22,10,0)_40%)]'
      )}
      style={{ x, opacity }}
    />
  )
}

// The pages under the open spread; their edges peek out on the outer side,
// thicker the more pages they hold.
function Stack({
  side,
  depth,
  className,
  inert,
  children,
  ref,
}: {
  side: 'left' | 'right'
  depth: number
  className?: string
  inert?: boolean
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}) {
  const sign = side === 'right' ? 1 : -1
  const edges = Math.min(4, Math.ceil(depth / 3))
  const shadows = Array.from({ length: edges }, (_, i) => {
    const color = i % 2 === 0 ? '#e3ddd2' : '#fbfaf7'
    return `${sign * (i + 1)}px 0 0 ${color}`
  })
  shadows.push('0 1px 2px rgba(20,16,8,0.06)', '0 14px 34px -14px rgba(20,16,8,0.28)')

  return (
    <div
      ref={ref}
      inert={inert}
      aria-hidden={inert || undefined}
      className={cn(
        'absolute inset-y-0 w-[var(--page-w)] overflow-hidden',
        PAPER,
        side === 'left' ? 'left-0' : 'left-[var(--spine)]',
        className
      )}
      style={{ boxShadow: shadows.join(', ') }}
    >
      {children}
      <Gutter side={side === 'left' ? 'right' : 'left'} />
    </div>
  )
}

function CountryPage({
  stoplight,
  number,
  showPhoto,
}: {
  stoplight: Stoplight
  number: number
  showPhoto: boolean
}) {
  return (
    <div className="flex h-full flex-col px-[7%] pt-[7%]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ebe7df]">
        {showPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={stoplightImage(stoplight.slug, 960)}
            srcSet={`${stoplightImage(stoplight.slug, 480)} 480w, ${stoplightImage(stoplight.slug, 960)} 960w`}
            sizes="(min-width: 768px) 330px, 90vw"
            alt={stoplight.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
      <p className="mt-[5.5%] text-center text-[13.5px] font-medium tracking-[-0.01em] text-[#0A0A0B]">
        {stoplight.country}
      </p>
      <span className="mt-auto self-end pb-[5.5%] text-[10px] tabular-nums tracking-[0.04em] text-[#b8b1a5]">
        {pad(number)}
      </span>
    </div>
  )
}

function TitlePage({ count }: { count: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-[12%] text-center">
      <Signal lit="red" />
      <p className="mt-6 text-[15px] font-semibold tracking-[-0.01em] text-[#0A0A0B]">stoplights</p>
      <p className="mt-1 text-[12.5px] text-[#999]">from around the world</p>
      <p className="mt-8 text-[10.5px] uppercase tracking-[0.14em] text-[#b8b1a5]">{count} countries</p>
    </div>
  )
}

function EndPage({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <Signal lit="green" />
      <button
        type="button"
        onClick={onRestart}
        className="mt-6 rounded-sm text-[12.5px] text-[#999] underline-offset-[3px] transition-colors duration-150 hover:text-[#0A0A0B] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A0A0B]"
      >
        start over
      </button>
    </div>
  )
}

// A tiny three-lens signal: the book opens on red and closes on green.
function Signal({ lit }: { lit: 'red' | 'green' }) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center gap-[5px] rounded-[9px] bg-[#1d1d1f] px-[6px] py-[7px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
    >
      <span
        className={cn(
          'h-[13px] w-[13px] rounded-full',
          lit === 'red' ? 'bg-[#ff453a] shadow-[0_0_9px_rgba(255,69,58,0.8)]' : 'bg-[#3b2321]'
        )}
      />
      <span className="h-[13px] w-[13px] rounded-full bg-[#3a3220]" />
      <span
        className={cn(
          'h-[13px] w-[13px] rounded-full',
          lit === 'green' ? 'bg-[#30d158] shadow-[0_0_9px_rgba(48,209,88,0.8)]' : 'bg-[#1d3324]'
        )}
      />
    </div>
  )
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e6e6] text-[#666] transition-[color,border-color,transform,opacity] duration-150 ease-out hover:border-[#cfcfcf] hover:text-[#0A0A0B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A0A0B] active:scale-[0.96] disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  )
}
