'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

type Section = { id: string; title: string; nested: boolean }

export default function ArticleSections() {
  const pathname = usePathname()
  const [sections, setSections] = useState<Section[]>([])
  const [activeId, setActiveId] = useState('')
  const [title, setTitle] = useState<{ id: string; text: string } | null>(null)
  const [titleHidden, setTitleHidden] = useState(false)

  useEffect(() => {
    const articleTitle = document.getElementById('writes-post-title')
    const headings = Array.from(document.querySelectorAll<HTMLElement>(
      '#writes-post-root .prose :is(h1, h2, h3)[id]'
    ))
    const topLevel = Math.min(...headings.map((heading) => Number(heading.tagName[1])))
    const initialFrame = requestAnimationFrame(() => {
      setTitle(articleTitle ? { id: articleTitle.id, text: articleTitle.textContent?.trim() ?? '' } : null)
      setSections(headings.map((heading) => ({
        id: heading.id,
        title: heading.textContent?.trim() ?? '',
        nested: Number(heading.tagName[1]) > topLevel,
      })))
    })

    let frame = 0
    const update = () => {
      frame = 0
      const isTitleHidden = !!articleTitle && articleTitle.getBoundingClientRect().bottom <= 0
      setTitleHidden(isTitleHidden)
      let current = isTitleHidden ? articleTitle.id : ''
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > 120) break
        current = heading.id
      }
      // Short final sections may never reach the activation line on tall screens.
      // At the scroll limit, the reader has reached the final section regardless.
      const atBottom = window.scrollY > 0 &&
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY <= 2
      if (atBottom && headings.length > 0) current = headings[headings.length - 1].id
      setActiveId(current)
    }
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      cancelAnimationFrame(initialFrame)
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [pathname])

  const jumpToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const heading = document.getElementById(id)
    if (!heading) return
    event.preventDefault()
    window.history.pushState(null, '', `#${encodeURIComponent(id)}`)
    heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
    heading.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    })
  }

  if (!title && sections.length === 0) return null

  return (
    <nav aria-label="Article sections" className="mt-8 hidden md:block">
      {title && (
        <a
          href={`#${title.id}`}
          onClick={(event) => jumpToSection(event, title.id)}
          aria-hidden={!titleHidden}
          tabIndex={titleHidden ? undefined : -1}
          aria-current={titleHidden && activeId === title.id ? 'location' : undefined}
          className={cn(
            'mb-5 block text-[13px] leading-[1.55] text-[#999] transition-[color,opacity] duration-150 hover:text-[#333] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#333] motion-reduce:transition-none',
            titleHidden ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0',
            activeId === title.id && 'text-[#333]'
          )}
        >
          {title.text}
        </a>
      )}
      <ol className="space-y-3">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${encodeURIComponent(section.id)}`}
              onClick={(event) => jumpToSection(event, section.id)}
              aria-current={activeId === section.id ? 'location' : undefined}
              className={cn(
                'block text-[13px] leading-[1.55] text-[#999] transition-colors duration-150 hover:text-[#333] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#333] motion-reduce:transition-none',
                section.nested && 'pl-3',
                activeId === section.id && 'text-[#333]'
              )}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
