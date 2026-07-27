'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Github, Hammer, Linkedin } from 'lucide-react'

import ContactIcon from '@/components/home/ContactIcon'
import { useShellTab } from '@/components/shell/ShellChrome'
import { candidateLinks } from '@/lib/candidate-profile'

function SubstackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 2.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 5.75H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M3 9H13V13.5L8 11.2L3 13.5V9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

interface NameLink {
  label: string
  href: string
  icon: ReactNode
  /** class an icon's built-in hover animation listens for */
  triggerClass?: string
}

const LINKS: NameLink[] = [
  { label: 'linkedin', href: candidateLinks.linkedin, icon: <Linkedin size={13} strokeWidth={1.8} /> },
  { label: 'dkbuilds.co', href: candidateLinks.dkBuilds, icon: <Hammer size={13} strokeWidth={1.8} /> },
  {
    label: 'contact',
    href: 'mailto:declankramper@gmail.com', // interview decision: gmail, not the dkbuilds address
    icon: <ContactIcon />,
    triggerClass: 'contact-link',
  },
  { label: 'github', href: 'https://github.com/declankra', icon: <Github size={13} strokeWidth={1.8} /> },
  { label: 'substack', href: candidateLinks.substack, icon: <SubstackIcon /> },
]

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 20 }

export default function NamePills() {
  const { selectTab } = useShellTab()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Hover-open must be earned by real pointer intent. When the name mounts
  // underneath a stationary cursor (e.g. it replaces the article back button
  // in the same spot), the browser synthesizes a mouseenter — without this
  // guard the links pop open uninvited on every article exit.
  const armedRef = useRef(false)
  useEffect(() => {
    const t = setTimeout(() => {
      armedRef.current = true
    }, 500)
    return () => clearTimeout(t)
  }, [])

  // Tap-outside dismiss (mobile)
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const links = (
    <AnimatePresence>
      {open &&
        LINKS.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('/') ? undefined : '_blank'}
            rel={link.href.startsWith('/') ? undefined : 'noreferrer'}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6, transition: { duration: 0.12, delay: 0 } }}
            transition={{ ...SPRING, delay: i * 0.05 }}
            className={`inline-flex h-[23px] items-center gap-1.5 whitespace-nowrap text-[12px] text-[#666] no-underline transition-colors hover:text-[#0A0A0B] [&_svg]:h-3.5 [&_svg]:w-3.5 ${link.triggerClass ?? ''}`}
          >
            {link.icon}
            {link.label}
          </motion.a>
        ))}
    </AnimatePresence>
  )

  return (
    <div
      ref={wrapRef}
      className="relative flex w-fit items-center"
      onMouseEnter={() => {
        if (armedRef.current) setOpen(true)
      }}
      onMouseLeave={() => {
        armedRef.current = true
        setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label="declan kramper — home"
        onClick={() => {
          // Desktop (hover reveals the links): a click always goes home to now.
          // Touch (no hover): first tap opens the links, tapping again goes home.
          const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
          if (canHover || open) {
            setOpen(false)
            selectTab('now')
          } else {
            setOpen(true)
          }
        }}
        className="whitespace-nowrap border-none bg-transparent p-0 text-[15px] font-semibold tracking-[-0.01em] text-[#0A0A0B]"
      >
        declan kramper
      </button>
      {/* Desktop: links float to the right of the name, over content (soft white
          backdrop keeps them readable without reading as chips) */}
      <span className="absolute left-[calc(100%+12px)] top-1/2 z-20 hidden -translate-y-1/2 gap-3.5 rounded-md bg-white/85 backdrop-blur-[2px] md:flex">
        {links}
      </span>
      {/* Mobile: links wrap below the name */}
      <span className="absolute left-0 top-[calc(100%+6px)] z-20 flex max-w-[80vw] flex-wrap gap-x-3.5 gap-y-1 rounded-md bg-white/85 backdrop-blur-[2px] md:hidden">
        {links}
      </span>
    </div>
  )
}
