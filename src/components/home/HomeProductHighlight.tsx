'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { toast } from 'sonner'

export default function HomeProductHighlight() {
  const [hoveredItem, setHoveredItem] = useState<'consulting' | 'surgent' | null>(null)
  const [isHoverDevice, setIsHoverDevice] = useState(false)
  const hoveredItemRef = useRef<'consulting' | 'surgent' | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const consultingRef = useRef<HTMLDivElement>(null)
  const surgentRef = useRef<HTMLDivElement>(null)

  const fadeInEase = [0.25, 0.46, 0.45, 0.94] as const

  // Spring-animated blob (motion values = no re-renders)
  const blobTop = useMotionValue(0)
  const blobHeight = useMotionValue(0)
  const blobOpacity = useMotionValue(0)

  const springConfig = { stiffness: 180, damping: 17 }
  const blobTopSpring = useSpring(blobTop, springConfig)
  const blobHeightSpring = useSpring(blobHeight, springConfig)
  const blobOpacitySpring = useSpring(blobOpacity, springConfig)
  const expandedDetailsMaxHeight = isHoverDevice ? 80 : 180

  useEffect(() => {
    hoveredItemRef.current = hoveredItem
  }, [hoveredItem])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updateIsHoverDevice = () => setIsHoverDevice(mediaQuery.matches)

    updateIsHoverDevice()
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateIsHoverDevice)
    } else {
      mediaQuery.addListener(updateIsHoverDevice)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateIsHoverDevice)
      } else {
        mediaQuery.removeListener(updateIsHoverDevice)
      }
    }
  }, [])

  // Auto-transition carousel for consulting media is intentionally disabled
  // until the second asset is ready again.
  // const [consultingSlide, setConsultingSlide] = useState(0)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setConsultingSlide((prev) => (prev === 0 ? 1 : 0))
  //   }, 5000)
  //   return () => clearInterval(interval)
  // }, [consultingSlide])

  const measureItem = useCallback((key: 'consulting' | 'surgent') => {
    const list = listRef.current
    const item = key === 'consulting' ? consultingRef.current : surgentRef.current
    if (!list || !item) return null
    const listRect = list.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    return {
      top: itemRect.top - listRect.top,
      height: itemRect.height
    }
  }, [])

  useEffect(() => {
    if (!hoveredItem) {
      blobOpacity.set(0)
      return
    }

    let rafId: number
    const measure = () => {
      const current = hoveredItemRef.current
      if (!current) return
      const rect = measureItem(current)
      if (rect) {
        blobTop.set(rect.top)
        blobHeight.set(rect.height)
      }
      blobOpacity.set(1)
      rafId = requestAnimationFrame(measure)
    }
    rafId = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(rafId)
  }, [hoveredItem, measureItem, blobTop, blobHeight, blobOpacity])

  const handleShareClick = useCallback(async () => {
    if (typeof window === 'undefined') return
    const shareData = {
      title: 'Declan Kramper',
      text: "Check out Declan Kramper's site.",
      url: window.location.href
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(shareData.url)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy share link:', error)
      toast.error('Unable to share right now.')
    }
  }, [])

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: fadeInEase }}
      >
        <div
          ref={listRef}
          className="relative"
          onMouseLeave={() => {
            if (isHoverDevice) setHoveredItem(null)
          }}
        >
          <motion.div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              y: blobTopSpring,
              height: blobHeightSpring,
              opacity: blobOpacitySpring,
              borderRadius: 13,
              backgroundColor: '#f0f0f0'
            }}
          />

          <div
            ref={consultingRef}
            className={`relative z-1 px-4 py-3 rounded-[13px] ${isHoverDevice ? 'cursor-default' : 'cursor-pointer'}`}
            onMouseEnter={() => {
              if (isHoverDevice) setHoveredItem('consulting')
            }}
            onClick={() => {
              if (!isHoverDevice) {
                setHoveredItem((current) => (current === 'consulting' ? null : 'consulting'))
              }
            }}
          >
            <p className="text-base md:text-lg lg:text-xl font-normal text-[#0A0A0B] leading-relaxed">
              that move numbers <span className="text-[#666666]">for businesses</span>
            </p>
            <div
              className="overflow-hidden transition-all duration-400"
              style={{
                maxHeight: hoveredItem === 'consulting' ? expandedDetailsMaxHeight : 0,
                opacity: hoveredItem === 'consulting' ? 1 : 0,
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              <div className="pt-2">
                <p className="text-[13px] md:text-sm font-medium text-[#0A0A0B]">
                  Applied AI Consulting &middot;{' '}
                  <a
                    href="https://www.dkbuilds.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-transparent underline-offset-2 transition-colors hover:decoration-current"
                  >
                    dkBuilds.co
                  </a>
                </p>
                <p className="text-xs md:text-[13px] text-[#888] leading-snug mt-1">
                  Working closely with SMBs to apply the latest AI for tangible, measurable impact. First project is for a construction firm. More to come.
                </p>
              </div>
            </div>
          </div>

          <div
            ref={surgentRef}
            className={`relative z-1 px-4 py-3 rounded-[13px] ${isHoverDevice ? 'cursor-default' : 'cursor-pointer'}`}
            onMouseEnter={() => {
              if (isHoverDevice) setHoveredItem('surgent')
            }}
            onClick={() => {
              if (!isHoverDevice) {
                setHoveredItem((current) => (current === 'surgent' ? null : 'surgent'))
              }
            }}
          >
            <p className="text-base md:text-lg lg:text-xl font-normal text-[#0A0A0B] leading-relaxed">
              and people{' '}
              <button
                type="button"
                onClick={handleShareClick}
                className="inline-flex items-baseline text-[#0A0A0B] transition-colors hover:text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label="Share this site"
              >
                share
              </button>{' '}
              <span className="text-[#666666]">with their friends</span>
            </p>
            <div
              className="overflow-hidden transition-all duration-400"
              style={{
                maxHeight: hoveredItem === 'surgent' ? expandedDetailsMaxHeight : 0,
                opacity: hoveredItem === 'surgent' ? 1 : 0,
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              <div className="pt-2">
                <p className="text-[13px] md:text-sm font-medium text-[#0A0A0B]">
                  <a
                    href="https://surgent.run"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-transparent underline-offset-2 transition-colors hover:decoration-current"
                  >
                    Surgent
                  </a>{' '}
                  &middot; iOS Running App
                </p>
                <p className="text-xs md:text-[13px] text-[#888] leading-snug mt-1">
                  Turning health data into daily confidence. An iOS app for understanding your body's running performance through objective progress over time — gradually, then suddenly all at once.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:hidden">
            <AnimatePresence mode="wait">
              {hoveredItem === 'consulting' && (
                <motion.div
                  key="mobile-consulting-media"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full overflow-hidden rounded-[16px] border border-[#e5e5e5] bg-black"
                >
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="aspect-video w-full object-contain bg-black"
                  >
                    <source src="/finished/ontology-xtract/ontology-xtract-preview.web-hq.mp4" type="video/mp4" />
                  </video>
                </motion.div>
              )}

              {hoveredItem === 'surgent' && (
                <motion.div
                  key="mobile-surgent-media"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="flex justify-center pt-2"
                >
                  <motion.div
                    className="relative aspect-1406/2822 w-[44vw] max-w-[180px] min-w-[130px] drop-shadow-[0_18px_24px_rgba(0,0,0,0.22)]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div
                      className="absolute left-[6.8%] right-[6.6%] top-[3.2%] bottom-[3.2%] overflow-hidden rounded-[1.2rem] bg-black"
                    >
                      <Image
                        src="/finished/garpple/homeview1_v2.webp"
                        alt="Surgent app home screen"
                        fill
                        sizes="(max-width: 768px) 44vw, 180px"
                        className="object-cover"
                      />
                    </div>

                    <Image
                      src="/frames/iphone-16-pro-white-titanium.png"
                      alt="iPhone 16 Pro frame"
                      fill
                      sizes="(max-width: 768px) 44vw, 180px"
                      className="pointer-events-none select-none"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative hidden md:flex items-center justify-center min-h-[340px] lg:min-h-[420px]">
          <motion.div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center overflow-hidden"
            animate={{
              opacity: hoveredItem === 'consulting' ? 1 : 0,
              scale: hoveredItem === 'consulting' ? 1 : 0.97
            }}
            initial={false}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full flex-1 rounded-[16px] overflow-hidden border border-[#e5e5e5] bg-black">
              <motion.div
                className="absolute inset-0 rounded-[16px] overflow-hidden"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain rounded-[16px] bg-black"
                >
                  <source src="/finished/ontology-xtract/ontology-xtract-preview.web-hq.mp4" type="video/mp4" />
                </video>
              </motion.div>

              {/* Auto-transition consulting carousel (video + second image asset) temporarily disabled.
                  Keep this block for quick restore once the second asset is ready.
              <AnimatePresence mode="wait">
                {consultingSlide === 0 ? (
                  <motion.div
                    key="slide-video"
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain rounded-2xl"
                    >
                      <source src="/finished/ontology-xtract/ontology-xtract-preview.web-hq.mp4" type="video/mp4" />
                    </video>
                  </motion.div>
                ) : (
                  <motion.div
                    key="slide-image"
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Image
                      src="/finished/elite-ai/gravelbox_with_background.png"
                      alt="Gravelbox application interface"
                      fill
                      sizes="(min-width: 1024px) 50vw, 40vw"
                      className="object-cover rounded-2xl"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              */}
            </div>

            {/* Slide dots hidden while second consulting asset is not ready.
            <div className="flex gap-1.5 mt-3">
              <button
                type="button"
                onClick={() => setConsultingSlide(0)}
                className={`w-[6px] h-[6px] rounded-full transition-colors duration-300 ${
                  consultingSlide === 0 ? 'bg-[#999]' : 'bg-[#d4d4d4]'
                }`}
                aria-label="Show first slide"
              />
              <button
                type="button"
                onClick={() => setConsultingSlide(1)}
                className={`w-[6px] h-[6px] rounded-full transition-colors duration-300 ${
                  consultingSlide === 1 ? 'bg-[#999]' : 'bg-[#d4d4d4]'
                }`}
                aria-label="Show second slide"
              />
            </div>
            */}
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{
              opacity: hoveredItem === 'surgent' ? 1 : 0,
              scale: hoveredItem === 'surgent' ? 1 : 0.97
            }}
            initial={false}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative h-full max-h-[420px] aspect-1406/2822 drop-shadow-[0_24px_30px_rgba(0,0,0,0.22)] -mt-8"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                className="absolute left-[6.8%] right-[6.6%] top-[3.2%] bottom-[3.2%] overflow-hidden rounded-[1.6rem] bg-black"
              >
                <Image
                  src="/finished/garpple/homeview1_v2.webp"
                  alt="Surgent app home screen"
                  fill
                  sizes="(min-width: 1024px) 220px, 180px"
                  className="object-cover"
                />
              </div>

              <Image
                src="/frames/iphone-16-pro-white-titanium.png"
                alt="iPhone 16 Pro frame"
                fill
                sizes="(min-width: 1024px) 220px, 180px"
                className="pointer-events-none select-none"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
