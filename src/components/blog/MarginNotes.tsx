'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import './margin-notes.css'

// Handwritten margin notes. Tapping a footnote number writes that footnote in
// red Kramper Hand beside its line; tapping the number (or the note) again
// erases it. Otherwise a note stays open while the reader is on the page.
// Nothing in the article moves: where the right margin has room the note sits
// there, and on narrow screens it lies over the text on a paper card, above
// the line when it fits, so the lines still to read stay clear.
// The note copies come from rehypeMarginNotes (src/lib/margin-notes.ts).

const FONT = '"Kramper Hand"'
const PEN_SPEED = 2.6 // px of handwriting per ms
const WRITE_MS = [180, 560] as const
const ERASE_MS = [90, 220] as const
const MARGIN_GAP = 40 // article edge to the note
const MARGIN_MIN = 180 // less room than this and the note goes on a card
const MARGIN_MAX = 280
const EDGE = 16 // keep notes this far inside the viewport
const STACK_GAP = 14 // between notes stacked in the margin
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
const RING_MS = 170 // the pen circling the note's number
// With the ring's dash pattern (1 2), an offset of 1.05 puts the dash fully
// off the path, so no round-cap dot shows before it draws.
const RING_HIDDEN = '1.05'

// Negative insets leave room for ascenders, descenders and loops.
const UNWRITTEN = 'inset(-0.5em calc(100% + 0.3em) -0.5em -0.3em)'
const WRITTEN = 'inset(-0.5em -0.3em -0.5em -0.3em)'

type Note = {
  ref: HTMLAnchorElement
  el: HTMLElement
  order: number
  shift: number // set when it opens, to keep the note in view
  anims: Animation[]
  closing: boolean
}

type Line = { words: HTMLElement[]; left: number; right: number }

const clamp = (value: number, [min, max]: readonly [number, number]) => Math.min(max, Math.max(min, value))

// Group the note's words into the lines the browser wrapped them into.
function measureLines(el: HTMLElement): Line[] {
  const lines: Line[] = []
  const half = parseFloat(getComputedStyle(el).fontSize) / 2
  let top = -Infinity
  for (const word of el.querySelectorAll<HTMLElement>('.fn-w')) {
    const left = word.offsetLeft
    const right = left + word.offsetWidth
    if (word.offsetTop > top + half) {
      top = word.offsetTop
      lines.push({ words: [word], left, right })
    } else {
      const line = lines[lines.length - 1]
      line.words.push(word)
      line.left = Math.min(line.left, left)
      line.right = Math.max(line.right, right)
    }
  }
  return lines
}

export default function MarginNotes() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.getElementById('writes-post-root')
    const refs = Array.from(root?.querySelectorAll<HTMLAnchorElement>('a[data-footnote-ref]') ?? [])
    if (!root || refs.length === 0) return

    const noteFor = (ref: HTMLAnchorElement) => document.getElementById(ref.id.replace('fnref', 'fnnote'))
    for (const ref of refs) {
      const note = noteFor(ref)
      if (!note) continue
      ref.setAttribute('aria-expanded', 'false')
      ref.setAttribute('aria-controls', note.id)
    }
    // Start the font download now so the first note is ready to write.
    document.fonts?.load(`20px ${FONT}`).catch(() => {})

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const notes = new Map<HTMLAnchorElement, Note>()
    let inMargin = true
    let layer = 30

    const setMode = () => {
      const room = document.documentElement.clientWidth - root.getBoundingClientRect().right - MARGIN_GAP - EDGE
      inMargin = room >= MARGIN_MIN
      root.dataset.fnMode = inMargin ? 'margin' : 'card'
      root.style.setProperty('--fn-width', `${Math.min(MARGIN_MAX, room)}px`)
    }

    // Sizes the note and sets its offset from its natural spot (the top of its
    // reference's line) so it fits the viewport the reader is looking at.
    // Long footnotes get smaller handwriting, down to 15px.
    const place = (note: Note) => {
      const { el, ref } = note
      const base = inMargin ? 21 : 20
      el.style.fontSize = `${base}px`
      const fit = (room: number) => {
        const height = el.offsetHeight
        if (height > room) el.style.fontSize = `${Math.max(15, base * Math.sqrt(room / height))}px`
        return el.offsetHeight
      }
      const top = root.getBoundingClientRect().top + el.offsetTop
      const floor = window.innerHeight - EDGE
      if (inMargin) {
        const height = fit(Math.min(window.innerHeight - EDGE * 2, 640) * 0.8)
        const up = Math.min(0, floor - height - top)
        note.shift = top + up < EDGE ? EDGE - top : up
        el.style.transformOrigin = ''
        return
      }
      // A card never covers its own line. Above it is best (those lines are
      // read); otherwise the side with more room. A card still too tall for
      // that side runs past the screen edge, away from the line.
      const lineHeight = parseFloat(getComputedStyle(el.parentElement ?? root).lineHeight) || 26
      const roomAbove = top - EDGE - 6
      const roomBelow = floor - top - lineHeight - 6
      const natural = el.offsetHeight
      const goAbove = natural <= roomAbove || (natural > roomBelow && roomAbove > roomBelow)
      const height = fit(Math.min(window.innerHeight * 0.6, goAbove ? roomAbove : roomBelow))
      note.shift = goAbove ? -height - 6 : lineHeight + 6
      const originX = ref.getBoundingClientRect().left - el.getBoundingClientRect().left
      el.style.transformOrigin = `${originX}px ${goAbove ? '100%' : '0'}`
    }

    // Margin notes never overlap: a later note moves below an earlier one.
    const stack = () => {
      let floor = -Infinity
      const open = [...notes.values()].sort((a, b) => a.order - b.order)
      for (const { el, shift } of open) {
        const natural = el.offsetTop + shift
        const top = inMargin ? Math.max(natural, floor) : natural
        el.style.translate = `0 ${top - el.offsetTop}px`
        floor = top + el.offsetHeight + STACK_GAP
      }
    }

    const write = (note: Note) => {
      const { el } = note
      if (reduceMotion.matches) {
        note.anims = [el.animate({ opacity: [0, 1] }, { duration: 150, easing: 'ease-out' })]
        return
      }
      let time = 0
      if (!inMargin) {
        note.anims.push(el.animate({ opacity: [0, 1], scale: [0.97, 1] }, { duration: 180, easing: EASE_OUT }))
        time = 50
      }
      // The number first; the pen circles it as the words start.
      const digit = el.querySelector<HTMLElement>('.fn-num-digit')
      const ring = el.querySelector<SVGPathElement>('.fn-num-ring path')
      if (digit) {
        note.anims.push(digit.animate({ clipPath: [UNWRITTEN, WRITTEN] }, {
          delay: time, duration: 40, easing: 'linear', fill: 'backwards',
        }))
      }
      if (ring) {
        note.anims.push(ring.animate({ strokeDashoffset: [RING_HIDDEN, '0'] }, {
          delay: time + 30, duration: RING_MS, easing: EASE_OUT, fill: 'backwards',
        }))
      }
      time += 110
      const lines = measureLines(el)
      const length = lines.reduce((sum, line) => sum + line.right - line.left, 0)
      const speed = length / clamp(length / PEN_SPEED, WRITE_MS)
      for (const line of lines) {
        for (const word of line.words) {
          note.anims.push(word.animate({ clipPath: [UNWRITTEN, WRITTEN] }, {
            delay: time + (word.offsetLeft - line.left) / speed,
            duration: Math.max(16, word.offsetWidth / speed),
            easing: 'linear',
            fill: 'backwards',
          }))
        }
        time += (line.right - line.left) / speed
      }
      Promise.all(note.anims.map((anim) => anim.finished))
        .then(() => { el.dataset.settled = '' })
        .catch(() => {})
    }

    const erase = (note: Note) => {
      const { el } = note
      if (reduceMotion.matches) {
        note.anims = [el.animate({ opacity: [1, 0] }, { duration: 120, easing: 'ease-out', fill: 'forwards' })]
      } else {
        const lines = measureLines(el).reverse()
        const length = lines.reduce((sum, line) => sum + line.right - line.left, 0)
        const ms = clamp(length / (PEN_SPEED * 2.6), ERASE_MS)
        const speed = length / ms
        let time = 0
        for (const line of lines) {
          for (const word of line.words) {
            note.anims.push(word.animate({ clipPath: [WRITTEN, UNWRITTEN] }, {
              delay: time + (line.right - word.offsetLeft - word.offsetWidth) / speed,
              duration: Math.max(12, word.offsetWidth / speed),
              easing: 'linear',
              fill: 'forwards',
            }))
          }
          time += (line.right - line.left) / speed
        }
        // Then the circle comes off, and the number last.
        const ring = el.querySelector<SVGPathElement>('.fn-num-ring path')
        const digit = el.querySelector<HTMLElement>('.fn-num-digit')
        if (ring) {
          note.anims.push(ring.animate({ strokeDashoffset: ['0', RING_HIDDEN] }, {
            delay: Math.max(0, time - 40), duration: 110, easing: 'ease-out', fill: 'forwards',
          }))
        }
        if (digit) {
          note.anims.push(digit.animate({ clipPath: [WRITTEN, UNWRITTEN] }, {
            delay: time + 50, duration: 30, easing: 'linear', fill: 'forwards',
          }))
        }
        if (!inMargin) {
          note.anims.push(el.animate({ opacity: [1, 0], scale: [1, 0.98] }, {
            delay: time + 20, duration: 120, easing: 'ease-out', fill: 'forwards',
          }))
        }
      }
      Promise.all(note.anims.map((anim) => anim.finished))
        .then(() => {
          if (!note.closing) return
          note.anims.forEach((anim) => anim.cancel())
          note.anims = []
          el.hidden = true
          el.style.translate = ''
          delete el.dataset.settled
          notes.delete(note.ref)
          stack()
        })
        .catch(() => {})
    }

    const open = (ref: HTMLAnchorElement) => {
      const el = noteFor(ref)
      if (!el) return
      const note = notes.get(ref) ?? { ref, el, order: refs.indexOf(ref), shift: 0, anims: [], closing: false }
      note.anims.forEach((anim) => anim.cancel())
      note.anims = []
      note.closing = false
      notes.set(ref, note)
      ref.setAttribute('aria-expanded', 'true')
      el.hidden = false
      el.style.zIndex = String(++layer)
      delete el.dataset.settled
      setMode()
      place(note)
      stack()
      write(note)
    }

    const close = (note: Note) => {
      note.anims.forEach((anim) => anim.cancel())
      note.anims = []
      note.closing = true
      note.ref.setAttribute('aria-expanded', 'false')
      erase(note)
    }

    const toggle = (ref: HTMLAnchorElement) => {
      const note = notes.get(ref)
      if (note && !note.closing) close(note)
      else open(ref)
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element
      const ref = target.closest<HTMLAnchorElement>('a[data-footnote-ref]')
      if (ref && refs.includes(ref)) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        if (document.fonts?.check(`20px ${FONT}`) === false) {
          document.fonts.load(`20px ${FONT}`).then(() => toggle(ref), () => toggle(ref))
        } else {
          toggle(ref)
        }
        return
      }
      // Tapping an open note erases it too, unless it's a link or a text selection.
      const noteEl = target.closest<HTMLElement>('.fn-note')
      if (!noteEl || target.closest('a') || window.getSelection()?.isCollapsed === false) return
      const note = [...notes.values()].find((item) => item.el === noteEl)
      if (note && !note.closing) close(note)
    }

    // Width changes re-fit and re-place open notes; height changes (images
    // loading) only re-stack, so notes never jump while someone reads.
    let frame = 0
    let width = 0
    const relayout = () => {
      frame = 0
      const nextWidth = document.documentElement.clientWidth
      if (nextWidth !== width) {
        width = nextWidth
        setMode()
        for (const note of notes.values()) place(note)
      }
      stack()
    }
    const requestLayout = () => {
      if (!frame) frame = requestAnimationFrame(relayout)
    }
    const observer = new ResizeObserver(requestLayout)
    observer.observe(root)
    window.addEventListener('resize', requestLayout)
    root.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', requestLayout)
      root.removeEventListener('click', onClick)
      for (const note of notes.values()) {
        note.anims.forEach((anim) => anim.cancel())
        note.el.hidden = true
      }
    }
  }, [pathname])

  return null
}
