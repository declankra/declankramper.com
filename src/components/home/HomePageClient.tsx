'use client'

import dynamic from 'next/dynamic'
import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SparkBackground from '@/components/home/SparkBackground'
import HomeProductHighlight from '@/components/home/HomeProductHighlight'
import BottomNavigation, { type RecentWrite } from '@/components/home/BottomNavigation'
import ProductCarousel from '@/components/home/ProductCarousel'
import AmbientAudio, { type AmbientAudioControls } from '@/components/music/AmbientAudio'
import { GameProvider, useGame } from '@/components/game/GameContext'
import { showIosMusicToast } from '@/components/music/IosMusicToast'

const CursorTrail = dynamic(() => import('@/components/game/CursorTrail'), { ssr: false })
const FusionFrenzyGameContent = dynamic(() => import('@/components/game/FusionFrenzyGameContent'), { ssr: false })
const ReadmeDialog = dynamic(
  () => import('@/components/readme/ReadmeDialog').then((mod) => mod.ReadmeDialog),
  { ssr: false }
)

interface HomePageClientProps {
  recentWrites: RecentWrite[]
}

function HomeContent({ recentWrites }: HomePageClientProps) {
  const { setGameState, gameState } = useGame()
  const [isReadmeOpen, setIsReadmeOpen] = useState(false)
  const [readmeOrigin, setReadmeOrigin] = useState({ x: 0, y: 0 })
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [audioState, setAudioState] = useState({ isPlaying: false, isMuted: false })
  const audioControlsRef = useRef<AmbientAudioControls | null>(null)
  const fadeInEase = [0.25, 0.46, 0.45, 0.94] as const

  const handleGameClick = useCallback(() => {
    setGameState('instructions')
  }, [setGameState])

  const handleMusicClick = useCallback(() => {
    audioControlsRef.current?.togglePlayback()
    showIosMusicToast()
  }, [])

  const handleReadmeClick = useCallback((e?: React.MouseEvent) => {
    if (e) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setReadmeOrigin({ x: rect.left + rect.width / 2, y: rect.top })
    } else {
      setReadmeOrigin({ x: window.innerWidth / 2, y: window.innerHeight - 100 })
    }
    setIsReadmeOpen(true)
  }, [])

  return (
    <>
      <SparkBackground
        audio={audioElement}
        isActive={audioState.isPlaying && !audioState.isMuted}
      />

      {gameState === 'active' && <CursorTrail />}
      {gameState !== 'inactive' && <FusionFrenzyGameContent />}

      <AmbientAudio
        ref={audioControlsRef}
        onAudioReady={setAudioElement}
        onAudioStateChange={setAudioState}
      />

      <section className="relative z-10 px-8 md:px-16 lg:px-24">
        {/* Above the fold: fills viewport, links pinned to bottom */}
        <div className="flex min-h-svh flex-col pt-20 md:pt-24 lg:pt-28">
          <div className="flex min-h-0 flex-1 flex-col max-w-7xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="w-[70vw] max-w-none text-left text-[clamp(1.25rem,5.5vw,6.5rem)] font-medium text-[#0A0A0B] tracking-tight whitespace-nowrap"
              style={{ letterSpacing: '-0.03em' }}
            >
              Declan builds products.
            </motion.h1>

            <div className="mt-6 md:mt-10 flex min-h-0 flex-1 flex-col">
              <HomeProductHighlight />
            </div>
          </div>

          <div className="mt-auto pt-6 pb-4 md:pt-8 md:pb-6">
            <BottomNavigation
              onGameClick={handleGameClick}
              onReadmeClick={handleReadmeClick}
              onMusicClick={handleMusicClick}
              recentWrites={recentWrites}
            />
          </div>
        </div>

        {/* Below the fold: scroll to reveal */}
        <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-[#eee] pb-12 md:pb-16">
          <motion.p
            className="text-xs font-medium text-[#666] uppercase tracking-[0.06em] mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.6, ease: fadeInEase }}
          >
            More work
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.6, ease: fadeInEase }}
          >
            <ProductCarousel isAudioMuted={audioState.isMuted} />
          </motion.div>
        </div>
      </section>

      <ReadmeDialog
        open={isReadmeOpen}
        onOpenChange={setIsReadmeOpen}
        origin={readmeOrigin}
      />
    </>
  )
}

export default function HomePageClient({ recentWrites }: HomePageClientProps) {
  return (
    <GameProvider>
      <HomeContent recentWrites={recentWrites} />
    </GameProvider>
  )
}
