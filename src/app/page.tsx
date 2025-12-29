// src/app/page.tsx
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import SparkBackground from '@/components/home/SparkBackground'
import DualitySection from '@/components/home/ProductCarousel'
import BottomNavigation from '@/components/home/BottomNavigation'
import AmbientAudio, { type AmbientAudioControls } from '@/components/music/AmbientAudio'
import CursorTrail from '@/components/game/CursorTrail'
import FusionFrenzyGameContent from '@/components/game/FusionFrenzyGameContent'
import { GameProvider, useGame } from '@/components/game/GameContext'
import { ReadmeDialog } from '@/components/readme/ReadmeDialog'
import type { RecentWrite } from '@/components/home/BottomNavigation'

// Hero text animation variants
const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
}

function HomeContent() {
  const { setGameState, gameState } = useGame()
  const [isReadmeOpen, setIsReadmeOpen] = useState(false)
  const [readmeOrigin, setReadmeOrigin] = useState({ x: 0, y: 0 })
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [audioState, setAudioState] = useState({ isPlaying: false, isMuted: false })
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null)
  const audioControlsRef = useRef<AmbientAudioControls | null>(null)
  const [recentWrites, setRecentWrites] = useState<RecentWrite[]>([])

  const handleGameClick = useCallback(() => {
    setGameState('instructions')
  }, [setGameState])

  const handleMusicClick = useCallback(() => {
    audioControlsRef.current?.togglePlayback()

    // Show iOS-style notification
    toast(
      <div className="flex items-center gap-3 w-full">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 5V15"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M15 3V13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="6" cy="16.5" r="2.5" fill="white" />
            <circle cx="13" cy="14.5" r="2.5" fill="white" />
            <path
              d="M8 6L15 4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            This is Lane 8, I once was a DJ.
          </p>
        </div>
      </div>,
      {
        duration: 4000,
        position: 'top-center',
        className: 'ios-notification-toast',
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          borderRadius: '18px',
          padding: '12px 16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
          minWidth: '320px',
          maxWidth: '400px',
        },
      }
    )
  }, [])

  const handleReadmeClick = useCallback((e?: React.MouseEvent) => {
    // Get position from event or use center-bottom as fallback
    if (e) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setReadmeOrigin({ x: rect.left + rect.width / 2, y: rect.top })
    } else {
      setReadmeOrigin({ x: window.innerWidth / 2, y: window.innerHeight - 100 })
    }
    setIsReadmeOpen(true)
  }, [])


  useEffect(() => {
    let isMounted = true

    const loadRecentWrites = async () => {
      try {
        const response = await fetch('/api/writes/recent')
        if (!response.ok) return
        const data = (await response.json()) as RecentWrite[]
        if (isMounted) {
          setRecentWrites(data)
        }
      } catch (error) {
        console.error('Failed to load recent writes:', error)
      }
    }

    loadRecentWrites()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      {/* Atmospheric Background */}
      <SparkBackground
        audio={audioElement}
        isActive={audioState.isPlaying && !audioState.isMuted}
      />

      {/* Cursor Trail Effect (game only) */}
      {gameState === 'active' && <CursorTrail />}

      {/* Game Components (modals, canvas, etc.) */}
      <FusionFrenzyGameContent />

      {/* Audio System */}
      <AmbientAudio
        ref={audioControlsRef}
        onAudioReady={setAudioElement}
        onAudioStateChange={setAudioState}
      />

      {/* Main Content */}
      <main className="relative z-10 flex h-auto flex-col justify-start overflow-visible px-8 pt-20 md:h-[100svh] md:overflow-hidden md:px-16 md:pt-24 lg:px-24 lg:pt-28">
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Hero Section */}
          <div className="flex min-h-0 flex-1 flex-col max-w-7xl">
            {/* Main Hero Text - Single Line */}
            <motion.h1
              ref={heroTitleRef}
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

            {/* Duality Section - Below Hero */}
            <div className="mt-6 md:mt-10 flex min-h-0 flex-1 flex-col">
              <DualitySection isAudioMuted={audioState.isMuted} />
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-auto pt-6 pb-4 md:pt-8 md:pb-6">
            <BottomNavigation
              onGameClick={handleGameClick}
              onReadmeClick={handleReadmeClick}
              onMusicClick={handleMusicClick}
              recentWrites={recentWrites}
            />
          </div>
        </div>
      </main>

      {/* README Dialog */}
      <ReadmeDialog
        open={isReadmeOpen}
        onOpenChange={setIsReadmeOpen}
        origin={readmeOrigin}
      />
    </>
  )
}

export default function Home() {
  return (
    <GameProvider>
      <HomeContent />
    </GameProvider>
  )
}
