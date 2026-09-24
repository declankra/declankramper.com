'use client'

import { useCallback, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import AmbientAudio, { type AmbientAudioControls } from '@/components/music/AmbientAudio'
import { showIosMusicToast } from '@/components/music/IosMusicToast'
import { useGame } from '@/components/game/GameContext'
import { getRandomDestination } from '@/lib/random'
import { ShellFeaturesContext } from '@/components/shell/ShellFeaturesContext'
import { useShellTab } from '@/components/shell/ShellChrome'
import { tabFromHash } from '@/components/shell/useHashTab'

const CursorTrail = dynamic(() => import('@/components/game/CursorTrail'), { ssr: false })
const FusionFrenzyGameContent = dynamic(
  () => import('@/components/game/FusionFrenzyGameContent'),
  { ssr: false }
)
const ReadmeDialog = dynamic(
  () => import('@/components/readme/ReadmeDialog').then((mod) => mod.ReadmeDialog),
  { ssr: false }
)

// Hosts the shell-level features (ambient audio, game, readme dialog). The
// icon cluster itself lives in the rail (RailMoreIcons) and reaches these
// features through ShellFeaturesContext.
interface FooterIconRowProps {
  children: React.ReactNode
}

export default function FooterIconRow({ children }: FooterIconRowProps) {
  const router = useRouter()
  const { goToTab } = useShellTab()
  const { setGameState, gameState } = useGame()
  const [isReadmeOpen, setIsReadmeOpen] = useState(false)
  const [readmeOrigin, setReadmeOrigin] = useState({ x: 0, y: 0 })
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [audioState, setAudioState] = useState({ isPlaying: false, isMuted: false })
  const audioControlsRef = useRef<AmbientAudioControls | null>(null)

  const toggleMusic = useCallback(() => {
    audioControlsRef.current?.togglePlayback()
    showIosMusicToast()
  }, [])

  const openGame = useCallback(() => setGameState('instructions'), [setGameState])

  const openReadme = useCallback((e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setReadmeOrigin({ x: rect.left + rect.width / 2, y: rect.top })
    setIsReadmeOpen(true)
  }, [])

  const goRandom = useCallback(() => {
    const destination = getRandomDestination()
    // Home tabs ("/#builds") go through the shell, not a raw router.push.
    if (destination.startsWith('/#')) {
      goToTab(tabFromHash(destination.slice(1)))
    } else {
      router.push(destination)
    }
  }, [goToTab, router])

  return (
    <ShellFeaturesContext.Provider
      value={{
        audioElement,
        audioReactive: audioState.isPlaying && !audioState.isMuted,
        toggleMusic,
        openGame,
        openReadme,
        goRandom,
      }}
    >
      {children}

      {gameState === 'active' && <CursorTrail />}
      {gameState !== 'inactive' && <FusionFrenzyGameContent />}
      <AmbientAudio
        ref={audioControlsRef}
        onAudioReady={setAudioElement}
        onAudioStateChange={setAudioState}
      />
      <ReadmeDialog open={isReadmeOpen} onOpenChange={setIsReadmeOpen} origin={readmeOrigin} />
    </ShellFeaturesContext.Provider>
  )
}
