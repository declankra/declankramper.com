'use client'

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

const AUDIO_PATH = '/audio/little-voices.mp3'
const FADE_DURATION = 2000 // 2 seconds
const TARGET_VOLUME = 0.15 // 15% volume

interface AmbientAudioProps {
  onAudioReady?: (audio: HTMLAudioElement) => void
  onAudioStateChange?: (state: { isPlaying: boolean; isMuted: boolean }) => void
}

export interface AmbientAudioControls {
  togglePlayback: () => void
}

const AmbientAudio = forwardRef<AmbientAudioControls, AmbientAudioProps>(function AmbientAudio({
  onAudioReady,
  onAudioStateChange
}: AmbientAudioProps, ref) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isStartingRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Check localStorage for user preference
  useEffect(() => {
    const savedPreference = localStorage.getItem('ambient-audio-muted')
    if (savedPreference !== null) {
      setIsMuted(savedPreference === 'true')
    }
  }, [])

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(AUDIO_PATH)
    audioRef.current.loop = true
    audioRef.current.volume = 0

    onAudioReady?.(audioRef.current)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [onAudioReady])

  // Fade in audio
  const fadeIn = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    const startTime = Date.now()
    const fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / FADE_DURATION, 1)

      audio.volume = progress * TARGET_VOLUME

      if (progress >= 1) {
        clearInterval(fadeInterval)
      }
    }, 50)
  }, [])

  const playAudio = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    const shouldAnnounceStart = !isInitialized

    try {
      if (isStartingRef.current) return
      isStartingRef.current = true
      audio.volume = 0
      await audio.play()
      setIsPlaying(true)
      if (shouldAnnounceStart) {
        setIsInitialized(true)
      }
      fadeIn()
    } catch (error) {
      // Autoplay failed - browser blocked it
      console.log('Audio autoplay blocked:', error)
    } finally {
      isStartingRef.current = false
    }
  }, [fadeIn, isInitialized])

  // Handle mute toggle
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return

    const newMuted = !isMuted
    setIsMuted(newMuted)
    audioRef.current.muted = newMuted
    localStorage.setItem('ambient-audio-muted', String(newMuted))
  }, [isMuted])

  useEffect(() => {
    onAudioStateChange?.({ isPlaying, isMuted })
  }, [isPlaying, isMuted, onAudioStateChange])

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    await playAudio()
  }, [isPlaying, playAudio])

  useImperativeHandle(ref, () => ({ togglePlayback }), [togglePlayback])

  // Apply mute state when audio starts
  useEffect(() => {
    if (audioRef.current && isInitialized) {
      audioRef.current.muted = isMuted
    }
  }, [isInitialized, isMuted])

  // Only show toggle after audio has started
  if (!isInitialized) return null

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-white border border-[#E5E5E5] text-[#888] hover:text-[#0A0A0B] hover:border-[#CCC] transition-[color,border-color,box-shadow] shadow-sm"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? (
          <VolumeX size={18} />
        ) : (
          <Volume2 size={18} />
        )}
      </motion.button>
    </AnimatePresence>
  )
})

AmbientAudio.displayName = 'AmbientAudio'

export default AmbientAudio
