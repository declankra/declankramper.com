'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'
import { toast } from 'sonner'

interface Product {
  name: string
  image: string
  href: string
}

interface DualitySectionProps {
  products?: Product[]
  isAudioMuted?: boolean
}

const defaultProducts: Product[] = [
  { name: 'Surgent Landing', image: '/finished/garpple/surgent-landing.webp', href: '#' },
  { name: 'Surgent 1.0 App Store', image: '/finished/garpple/surgent-1.0-app-store.webp', href: '#' },
  { name: 'Surgent Shared with Friends', image: '/finished/garpple/surgent-shared-with-friends.webp', href: '#' },
  { name: 'RTC Preview', image: '/images/buildsTimeline/RTCpreview.webp', href: '#' },
  { name: 'Race Time Calculator Key Events', image: '/finished/race-time-calculator/key_events.png', href: '#' },
  { name: 'ChiTrack', image: '/finished/chitrack/ChiTrack.webp', href: '#' },
  { name: 'Caitlin ChiTrack', image: '/finished/chitrack/caitlin_chitrack.png', href: '#' },
  { name: 'Aspire Hackathon', image: '/images/buildsTimeline/AspireHackathon.webp', href: '#' },
  { name: 'Divvy Bottom', image: '/images/buildsTimeline/divvy-bottom.webp', href: '#' },
  { name: 'Athlete Personality Test', image: '/images/buildsTimeline/AthletePersonalityTest.webp', href: '#' },
  {
    name: 'Strava Personality Result',
    image: '/finished/strava-personality-test/personality_result.png',
    href: '#'
  },
  { name: 'Elite Dashboard', image: '/finished/elite-ai/elite-dashboard.webp', href: '#' }
]

const useMediaQuery = (query: string, defaultValue = false) => {
  const [matches, setMatches] = useState(defaultValue)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const useCarouselSound = (isMuted?: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null)
  const noiseBufferRef = useRef<AudioBuffer | null>(null)
  const swooshBufferRef = useRef<AudioBuffer | null>(null)
  const isMutedRef = useRef(Boolean(isMuted))

  useEffect(() => {
    isMutedRef.current = Boolean(isMuted)
  }, [isMuted])

  const ensureContext = useCallback(() => {
    if (typeof window === 'undefined' || isMutedRef.current) return null
    const context = audioContextRef.current ?? new AudioContext()
    audioContextRef.current = context
    if (context.state === 'suspended') {
      context.resume().catch(() => undefined)
    }
    if (!noiseBufferRef.current) {
      const length = Math.floor(context.sampleRate * 0.04)
      const buffer = context.createBuffer(1, length, context.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < length; i += 1) {
        const decay = 1 - i / length
        data[i] = (Math.random() * 2 - 1) * decay
      }
      noiseBufferRef.current = buffer
    }
    if (!swooshBufferRef.current) {
      const length = Math.floor(context.sampleRate * 0.35)
      const buffer = context.createBuffer(1, length, context.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < length; i += 1) {
        const t = i / length
        const envelope = Math.sin(Math.PI * t) * (1 - t * 0.2)
        data[i] = (Math.random() * 2 - 1) * envelope
      }
      swooshBufferRef.current = buffer
    }
    return context
  }, [])

  const playDetent = useCallback(
    (velocityX: number) => {
      if (typeof window === 'undefined' || isMutedRef.current || document.hidden) return
      const intensity = clamp(Math.abs(velocityX) / 900, 0.2, 1)

      const context = ensureContext()
      if (!context || !noiseBufferRef.current) return

      const startTime = context.currentTime

      const noise = context.createBufferSource()
      noise.buffer = noiseBufferRef.current

      const noiseFilter = context.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.value = 900 + intensity * 700
      noiseFilter.Q.value = 1.6 + intensity * 0.8

      const noiseGain = context.createGain()
      noiseGain.gain.setValueAtTime(0.0001, startTime)
      noiseGain.gain.linearRampToValueAtTime(0.02 + intensity * 0.03, startTime + 0.004)
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.045)

      const ping = context.createOscillator()
      ping.type = 'triangle'
      ping.frequency.setValueAtTime(260 + intensity * 160, startTime)
      ping.frequency.exponentialRampToValueAtTime(180 + intensity * 120, startTime + 0.07)

      const pingGain = context.createGain()
      pingGain.gain.setValueAtTime(0.0001, startTime)
      pingGain.gain.linearRampToValueAtTime(0.018 + intensity * 0.025, startTime + 0.006)
      pingGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.09)

      const clack = context.createOscillator()
      clack.type = 'square'
      clack.frequency.setValueAtTime(140 + intensity * 90, startTime)
      clack.frequency.exponentialRampToValueAtTime(90 + intensity * 60, startTime + 0.05)

      const clackGain = context.createGain()
      clackGain.gain.setValueAtTime(0.0001, startTime)
      clackGain.gain.linearRampToValueAtTime(0.012 + intensity * 0.02, startTime + 0.004)
      clackGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.05)


      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(context.destination)

      ping.connect(pingGain)
      pingGain.connect(context.destination)

      clack.connect(clackGain)
      clackGain.connect(context.destination)

      noise.start(startTime)
      noise.stop(startTime + 0.06)
      ping.start(startTime)
      ping.stop(startTime + 0.1)
      clack.start(startTime)
      clack.stop(startTime + 0.06)
    },
    [ensureContext]
  )

  const playSwoosh = useCallback(
    (velocityX: number) => {
      if (typeof window === 'undefined' || isMutedRef.current || document.hidden) return
      const intensity = clamp(Math.abs(velocityX) / 1400, 0, 1)
      if (intensity < 0.3) return

      const context = ensureContext()
      if (!context || !swooshBufferRef.current) return

      const startTime = context.currentTime
      const source = context.createBufferSource()
      source.buffer = swooshBufferRef.current

      const highpass = context.createBiquadFilter()
      highpass.type = 'highpass'
      highpass.frequency.value = 140

      const lowpass = context.createBiquadFilter()
      lowpass.type = 'lowpass'
      const startCutoff = 1800 + intensity * 2000
      const endCutoff = 550 + intensity * 450
      lowpass.frequency.setValueAtTime(startCutoff, startTime)
      lowpass.frequency.exponentialRampToValueAtTime(endCutoff, startTime + 0.28)

      const gain = context.createGain()
      const peak = 0.03 + intensity * 0.05
      gain.gain.setValueAtTime(0.0001, startTime)
      gain.gain.linearRampToValueAtTime(peak, startTime + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.32)

      source.connect(highpass)
      highpass.connect(lowpass)
      lowpass.connect(gain)
      gain.connect(context.destination)

      source.start(startTime)
      source.stop(startTime + 0.35)
    },
    [ensureContext]
  )

  const prime = useCallback(() => {
    ensureContext()
  }, [ensureContext])

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => undefined)
        audioContextRef.current = null
      }
    }
  }, [])

  return { playDetent, playSwoosh, prime }
}

const ProofCarousel = memo(
  ({
    products,
    maxHeight,
    isAudioMuted
  }: {
    products: Product[]
    maxHeight?: number
    isAudioMuted?: boolean
  }) => {
  const isSmall = useMediaQuery('(max-width: 640px)')
  const isMedium = useMediaQuery('(max-width: 1024px)')
  const minFaces = Math.max(products.length, 3)
  const baseFaceWidth = isSmall ? 150 : isMedium ? 185 : 220
  const faceCount = minFaces
  const faceAngle = 360 / faceCount
  const rotation = useMotionValue(0)
  const rotationSpring = useSpring(rotation, {
    stiffness: 140,
    damping: 24,
    mass: 0.3
  })
  const fallbackAspect = 4 / 5
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({})
  const aspectValues = Object.values(aspectRatios)
  const minAspect = aspectValues.length ? Math.min(...aspectValues) : fallbackAspect
  const basePadding = isSmall ? 110 : 140
  const minFaceWidth = isSmall ? 110 : isMedium ? 140 : 160
  const maxHeightCap = Number.isFinite(maxHeight) ? maxHeight : null
  const maxFaceWidthFromHeight = maxHeightCap
    ? Math.max(0, (maxHeightCap - basePadding) * minAspect)
    : baseFaceWidth
  const faceWidthCandidate = maxHeightCap
    ? Math.min(baseFaceWidth, maxFaceWidthFromHeight || baseFaceWidth)
    : baseFaceWidth
  const faceWidth =
    maxHeightCap && maxFaceWidthFromHeight < minFaceWidth
      ? Math.max(80, maxFaceWidthFromHeight)
      : Math.max(minFaceWidth, faceWidthCandidate)
  const cylinderWidth = faceWidth * faceCount
  const radius =
    Math.round(cylinderWidth / (2 * Math.PI)) + (isSmall ? 0 : isMedium ? 20 : 60)
  const baseHeight = isSmall ? 300 : isMedium ? 360 : 420
  const defaultMaxHeight = isSmall ? 330 : isMedium ? 380 : 420
  const maxHeightBound = maxHeightCap ? Math.min(maxHeightCap, defaultMaxHeight) : defaultMaxHeight
  const idealHeight = Math.round(faceWidth / minAspect + basePadding)
  let containerHeight = Math.max(baseHeight, Math.min(maxHeightBound, idealHeight))
  if (maxHeightCap && maxHeightCap < baseHeight) {
    containerHeight = Math.max(0, Math.floor(maxHeightCap))
  }

  const registerAspectRatio = useCallback((src: string, width: number, height: number) => {
    if (!width || !height) return
    const ratio = width / height
    setAspectRatios((prev) => {
      const existing = prev[src]
      if (existing && Math.abs(existing - ratio) < 0.02) return prev
      return { ...prev, [src]: ratio }
    })
  }, [])

  const detentSpacingPx = isSmall ? 16 : isMedium ? 18 : 22
  const detentAccumulatorRef = useRef(0)
  const { playDetent, playSwoosh, prime } = useCarouselSound(isAudioMuted)

  useEffect(() => {
    detentAccumulatorRef.current = 0
  }, [detentSpacingPx])

  const handleDrag = useCallback(
    (_: unknown, info: { delta: { x: number }; velocity: { x: number } }) => {
      rotation.set(rotation.get() + info.delta.x * 0.35)
      detentAccumulatorRef.current += info.delta.x
      const step = detentSpacingPx
      while (Math.abs(detentAccumulatorRef.current) >= step) {
        detentAccumulatorRef.current -= Math.sign(detentAccumulatorRef.current) * step
        playDetent(info.velocity.x)
      }
    },
    [detentSpacingPx, playDetent, rotation]
  )

  const handleDragEnd = useCallback(
    (_: unknown, info: { velocity: { x: number } }) => {
      rotation.set(rotation.get() + info.velocity.x * 0.08)
      detentAccumulatorRef.current = 0
      if (Math.abs(info.velocity.x) > 140) {
        playDetent(info.velocity.x)
      }
      if (Math.abs(info.velocity.x) > 650) {
        playSwoosh(info.velocity.x)
      }
    },
    [playDetent, playSwoosh, rotation]
  )

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: containerHeight,
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onDragStart={prime}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="relative flex h-full w-full items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{
          rotateY: rotationSpring,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          touchAction: 'pan-y'
        }}
      >
        {Array.from({ length: faceCount }).map((_, i) => {
          const product = products[i % products.length]
          return (
            <div
              key={`${product.name}-${i}`}
              className="pointer-events-none absolute flex items-center justify-center overflow-hidden rounded-2xl bg-white/70 shadow-sm backdrop-blur-sm"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${i * faceAngle}deg) translateZ(${radius}px)`,
                zIndex: 1
              }}
            >
              <div className="relative w-full">
                <div
                  className="relative w-full"
                  style={{ aspectRatio: aspectRatios[product.image] ?? fallbackAspect }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 280px"
                    className="pointer-events-none select-none object-contain"
                    draggable={false}
                    style={{ WebkitUserDrag: 'none' } as React.CSSProperties}
                    priority={i < 2}
                    onLoadingComplete={(img) =>
                      registerAspectRatio(product.image, img.naturalWidth, img.naturalHeight)
                    }
                  />
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
  }
)
ProofCarousel.displayName = 'ProofCarousel'

export default function DualitySection({
  products = defaultProducts,
  isAudioMuted
}: DualitySectionProps) {
  const carouselWrapRef = useRef<HTMLDivElement | null>(null)
  const [carouselHeight, setCarouselHeight] = useState<number | null>(null)
  const fadeInEase = [0.25, 0.46, 0.45, 0.94] as const

  useEffect(() => {
    const el = carouselWrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const updateHeight = () => {
      const nextHeight = Math.floor(el.getBoundingClientRect().height)
      setCarouselHeight((prev) => (prev === nextHeight ? prev : nextHeight))
    }

    const observer = new ResizeObserver(updateHeight)
    observer.observe(el)
    updateHeight()

    return () => observer.disconnect()
  }, [])

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
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
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
    <div className="flex min-h-0 flex-1 flex-col items-start md:items-center w-full">
      <motion.p
        className="text-base md:text-lg lg:text-xl font-normal text-[#0A0A0B] leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: fadeInEase }}
      >
        that move numbers <span className="text-[#666666]">for businesses</span>
      </motion.p>

      <motion.p
        className="text-base md:text-lg lg:text-xl font-normal text-[#0A0A0B] leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: fadeInEase }}
      >
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
      </motion.p>

      <div ref={carouselWrapRef} className="mt-3 sm:mt-4 w-full max-w-5xl flex-1 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6, ease: fadeInEase }}
        >
          <ProofCarousel
            products={products}
            maxHeight={carouselHeight ?? undefined}
            isAudioMuted={isAudioMuted}
          />
        </motion.div>
      </div>
    </div>
  )
}
