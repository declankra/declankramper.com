'use client'

import { useCallback, useEffect, useRef } from 'react'

type BeatType = 'kick' | 'snare' | 'hat' | 'other'

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  length: number
  width: number
  hue: number
  alpha: number
}

interface Flash {
  x: number
  y: number
  life: number
  maxLife: number
  radius: number
  hue: number
  alpha: number
}

interface SparkBackgroundProps {
  audio?: HTMLAudioElement | null
  isActive?: boolean
}

interface BeatCheck {
  fired: boolean
  intensity: number
  type: BeatType
}

const MIN_BEAT_INTERVAL_MS = 180
const BASS_MIN_HZ = 40
const BASS_MAX_HZ = 200
const FLUX_MAX_HZ = 2000
const MIN_BEAT_INTERVAL_S = MIN_BEAT_INTERVAL_MS / 1000

const ENERGY_HIGHPASS_HZ = 30
const ENERGY_LOWPASS_HZ = 180
const ENERGY_FAST_ALPHA = 0.22
const ENERGY_SLOW_ALPHA = 0.02
const FLUX_FAST_ALPHA = 0.35
const FLUX_SLOW_ALPHA = 0.06
const THRESHOLD_MEAN_ALPHA = 0.02
const THRESHOLD_DEV_ALPHA = 0.02
const THRESHOLD_DEV_MULTIPLIER = 3.2
const WARMUP_SAMPLES = 16
const TYPE_LOW_MIN_HZ = 30
const TYPE_LOW_MAX_HZ = 140
const TYPE_MID_MIN_HZ = 140
const TYPE_MID_MAX_HZ = 900
const TYPE_HIGH_MIN_HZ = 2500
const TYPE_HIGH_MAX_HZ = 10000

const randomRange = (min: number, max: number) => min + Math.random() * (max - min)
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const lerp = (from: number, to: number, alpha: number) => from + (to - from) * alpha
const toUnit = (db: number) => clamp((db + 100) / 100, 0, 1)

export default function SparkBackground({
  audio,
  isActive = false
}: SparkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const sparksRef = useRef<Spark[]>([])
  const flashesRef = useRef<Flash[]>([])
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
  const isActiveRef = useRef(isActive)

  const audioContextRef = useRef<AudioContext | null>(null)
  const spectrumAnalyserRef = useRef<AnalyserNode | null>(null)
  const timeAnalyserRef = useRef<AnalyserNode | null>(null)
  const frequencyDataRef = useRef<Float32Array | null>(null)
  const timeDataRef = useRef<Float32Array | null>(null)

  const lastBeatAudioClockRef = useRef(0)
  const isInBeatRef = useRef(false)

  const thresholdMeanRef = useRef(0)
  const thresholdDevRef = useRef(0)
  const samplesSeenRef = useRef(0)
  const fastEnergyRef = useRef(0)
  const slowEnergyRef = useRef(0)
  const fastFluxRef = useRef(0)
  const slowFluxRef = useRef(0)

  const previousSpectrumRef = useRef<Float32Array | null>(null)
  const binRangesRef = useRef<{
    bassStart: number
    bassEnd: number
    fluxStart: number
    fluxEnd: number
    typeLowStart: number
    typeLowEnd: number
    typeMidStart: number
    typeMidEnd: number
    typeHighStart: number
    typeHighEnd: number
  } | null>(null)

  const lastAudioTimeRef = useRef(0)

  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

  useEffect(() => {
    if (!audio || audioContextRef.current) return
    if (typeof window === 'undefined') return

    const audioContext = new AudioContext()
    const source = audioContext.createMediaElementSource(audio)

    // Output path (leave audio untouched).
    const output = audioContext.createGain()
    output.gain.value = 1
    source.connect(output)
    output.connect(audioContext.destination)

    // Silent analysis path so analysis runs without doubling audio.
    const silent = audioContext.createGain()
    silent.gain.value = 0
    silent.connect(audioContext.destination)

    // Frequency-domain analyser for spectral flux.
    const spectrumAnalyser = audioContext.createAnalyser()
    spectrumAnalyser.fftSize = 2048
    spectrumAnalyser.smoothingTimeConstant = 0.15
    source.connect(spectrumAnalyser)
    spectrumAnalyser.connect(silent)

    // Time-domain analyser for low-band energy envelope.
    const highpass = audioContext.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = ENERGY_HIGHPASS_HZ

    const lowpass = audioContext.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = ENERGY_LOWPASS_HZ

    const timeAnalyser = audioContext.createAnalyser()
    timeAnalyser.fftSize = 1024
    timeAnalyser.smoothingTimeConstant = 0

    source.connect(highpass)
    highpass.connect(lowpass)
    lowpass.connect(timeAnalyser)
    timeAnalyser.connect(silent)

    audioContextRef.current = audioContext
    spectrumAnalyserRef.current = spectrumAnalyser
    timeAnalyserRef.current = timeAnalyser
    frequencyDataRef.current = new Float32Array(spectrumAnalyser.frequencyBinCount)
    timeDataRef.current = new Float32Array(timeAnalyser.fftSize)

    return () => {
      spectrumAnalyser.disconnect()
      timeAnalyser.disconnect()
      highpass.disconnect()
      lowpass.disconnect()
      silent.disconnect()
      output.disconnect()
      source.disconnect()
      if (audioContext.state !== 'closed') {
        audioContext.close().catch(() => undefined)
      }
      audioContextRef.current = null
      spectrumAnalyserRef.current = null
      timeAnalyserRef.current = null
      frequencyDataRef.current = null
      timeDataRef.current = null
    }
  }, [audio])

  useEffect(() => {
    const audioContext = audioContextRef.current
    if (!audioContext) return
    if (isActive && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => undefined)
    }
  }, [isActive])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    sizeRef.current = { width, height, dpr }
  }, [])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [resizeCanvas])

  const spawnBeatBurst = useCallback((intensity = 1, type: BeatType = 'other') => {
    const { width, height } = sizeRef.current
    if (width === 0 || height === 0) return

    const isMobile = width < 768
    const intensityClamped = clamp(intensity, 0.6, 2.2)
    const sizeScale = 0.7 + intensityClamped * 0.35
    const baseCount = isMobile ? 8 : 14
    const burstCount =
      type === 'kick'
        ? Math.round(baseCount * 0.9 * clamp(intensityClamped, 0.6, 1.6))
        : type === 'snare'
          ? Math.round(baseCount * 1.15 * clamp(intensityClamped, 0.6, 1.8))
          : type === 'hat'
            ? Math.round(baseCount * 1.45 * clamp(intensityClamped, 0.6, 2))
            : Math.round(baseCount * clamp(intensityClamped, 0.6, 1.6))
    const origin = {
      x: randomRange(width * 0.15, width * 0.85),
      y: randomRange(height * 0.15, height * 0.85)
    }

    const hueBase =
      type === 'kick'
        ? (Math.random() < 0.5 ? randomRange(8, 35) : randomRange(320, 355))
        : type === 'snare'
          ? randomRange(190, 285)
          : type === 'hat'
            ? randomRange(55, 170)
            : randomRange(25, 55)
    for (let i = 0; i < burstCount; i++) {
      const angle = randomRange(-Math.PI, Math.PI)
      const speed =
        randomRange(type === 'hat' ? 0.9 : 0.6, type === 'kick' ? 2.8 : 2.6) *
        (type === 'hat' ? 1.15 : 1) *
        intensityClamped
      const life =
        randomRange(type === 'hat' ? 12 : 18, type === 'kick' ? 48 : 42) *
        (0.85 + intensityClamped * 0.15) *
        (type === 'hat' ? 0.85 : 1)

      sparksRef.current.push({
        x: origin.x + randomRange(-6, 6),
        y: origin.y + randomRange(-6, 6),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        length:
          randomRange(type === 'hat' ? 4 : 6, type === 'kick' ? 30 : 22) *
          sizeScale *
          (type === 'hat' ? 0.8 : 1),
        width:
          randomRange(type === 'hat' ? 0.55 : 0.8, type === 'kick' ? 2.8 : 2.2) *
          (0.85 + intensityClamped * 0.2) *
          (type === 'hat' ? 0.75 : 1),
        hue: hueBase + randomRange(-6, 10),
        alpha: randomRange(type === 'hat' ? 0.55 : 0.5, 0.95)
      })
    }

    const flashLife = randomRange(type === 'hat' ? 8 : 10, type === 'kick' ? 22 : 18)
    flashesRef.current.push({
      x: origin.x,
      y: origin.y,
      life: flashLife,
      maxLife: flashLife,
      radius:
        randomRange(type === 'hat' ? 35 : 50, type === 'kick' ? 260 : 160) *
        sizeScale *
        (type === 'snare' ? 0.9 : 1),
      hue: hueBase + randomRange(-8, 8),
      alpha: randomRange(type === 'kick' ? 0.22 : 0.16, type === 'hat' ? 0.28 : 0.35)
    })
  }, [])

  const resetDetectorState = useCallback(() => {
    lastBeatAudioClockRef.current = 0
    isInBeatRef.current = false
    thresholdMeanRef.current = 0
    thresholdDevRef.current = 0
    samplesSeenRef.current = 0
    fastEnergyRef.current = 0
    slowEnergyRef.current = 0
    fastFluxRef.current = 0
    slowFluxRef.current = 0
    previousSpectrumRef.current = null
    binRangesRef.current = null
  }, [])

  const computeBeatSignal = useCallback(() => {
    const spectrumAnalyser = spectrumAnalyserRef.current
    const timeAnalyser = timeAnalyserRef.current
    const audioContext = audioContextRef.current
    const frequencyData = frequencyDataRef.current
    const timeData = timeDataRef.current
    if (!spectrumAnalyser || !timeAnalyser || !audioContext || !frequencyData || !timeData) return null

    // Time-domain low-band RMS energy.
    timeAnalyser.getFloatTimeDomainData(timeData)
    let mean = 0
    for (let i = 0; i < timeData.length; i++) mean += timeData[i]
    mean /= timeData.length
    let sumSquares = 0
    for (let i = 0; i < timeData.length; i++) {
      const centered = timeData[i] - mean
      sumSquares += centered * centered
    }
    const rms = Math.sqrt(sumSquares / timeData.length)

    // Frequency-domain spectral flux (in dB space).
    spectrumAnalyser.getFloatFrequencyData(frequencyData)

    if (!binRangesRef.current || binRangesRef.current.bassEnd > frequencyData.length - 1) {
      const nyquist = audioContext.sampleRate / 2
      const binHz = nyquist / frequencyData.length
      const bassStart = Math.max(0, Math.floor(BASS_MIN_HZ / binHz))
      const bassEnd = Math.min(frequencyData.length - 1, Math.ceil(BASS_MAX_HZ / binHz))
      const fluxStart = Math.max(0, Math.floor(BASS_MIN_HZ / binHz))
      const fluxEnd = Math.min(frequencyData.length - 1, Math.ceil(FLUX_MAX_HZ / binHz))
      const typeLowStart = Math.max(0, Math.floor(TYPE_LOW_MIN_HZ / binHz))
      const typeLowEnd = Math.min(frequencyData.length - 1, Math.ceil(TYPE_LOW_MAX_HZ / binHz))
      const typeMidStart = Math.max(0, Math.floor(TYPE_MID_MIN_HZ / binHz))
      const typeMidEnd = Math.min(frequencyData.length - 1, Math.ceil(TYPE_MID_MAX_HZ / binHz))
      const typeHighStart = Math.max(0, Math.floor(TYPE_HIGH_MIN_HZ / binHz))
      const typeHighEnd = Math.min(frequencyData.length - 1, Math.ceil(TYPE_HIGH_MAX_HZ / binHz))
      binRangesRef.current = {
        bassStart,
        bassEnd,
        fluxStart,
        fluxEnd,
        typeLowStart,
        typeLowEnd,
        typeMidStart,
        typeMidEnd,
        typeHighStart,
        typeHighEnd
      }
    }

    const { bassStart, bassEnd, fluxStart, fluxEnd, typeLowStart, typeLowEnd, typeMidStart, typeMidEnd, typeHighStart, typeHighEnd } =
      binRangesRef.current

    if (!previousSpectrumRef.current || previousSpectrumRef.current.length !== frequencyData.length) {
      previousSpectrumRef.current = new Float32Array(frequencyData.length)
    }

    const previousSpectrum = previousSpectrumRef.current
    let bassDbSum = 0
    let bassCount = 0
    for (let i = bassStart; i <= bassEnd; i++) {
      bassDbSum += frequencyData[i]
      bassCount += 1
    }

    let fluxDbSum = 0
    let fluxCount = 0
    for (let i = fluxStart; i <= fluxEnd; i++) {
      const value = frequencyData[i]
      const diff = value - previousSpectrum[i]
      if (diff > 0) {
        fluxDbSum += diff
      }
      previousSpectrum[i] = value
      fluxCount += 1
    }

    const bassDbAvg = bassCount > 0 ? bassDbSum / bassCount : -100
    const bassEnergy = toUnit(bassDbAvg)
    const flux = fluxCount > 0 ? clamp(fluxDbSum / (fluxCount * 24), 0, 1) : 0

    // Onset-style signals: fast/slow EMA difference.
    fastEnergyRef.current = lerp(fastEnergyRef.current, rms, ENERGY_FAST_ALPHA)
    slowEnergyRef.current = lerp(slowEnergyRef.current, rms, ENERGY_SLOW_ALPHA)
    const energyOnset = Math.max(0, fastEnergyRef.current - slowEnergyRef.current)

    fastFluxRef.current = lerp(fastFluxRef.current, flux, FLUX_FAST_ALPHA)
    slowFluxRef.current = lerp(slowFluxRef.current, flux, FLUX_SLOW_ALPHA)
    const fluxOnset = Math.max(0, fastFluxRef.current - slowFluxRef.current)

    const score = clamp(energyOnset * 8 + fluxOnset * 2.2, 0, 3)

    // Simple beat typing features.
    let lowSum = 0
    let lowCount = 0
    for (let i = typeLowStart; i <= typeLowEnd; i++) {
      lowSum += toUnit(frequencyData[i])
      lowCount += 1
    }
    let midSum = 0
    let midCount = 0
    for (let i = typeMidStart; i <= typeMidEnd; i++) {
      midSum += toUnit(frequencyData[i])
      midCount += 1
    }
    let highSum = 0
    let highCount = 0
    for (let i = typeHighStart; i <= typeHighEnd; i++) {
      highSum += toUnit(frequencyData[i])
      highCount += 1
    }

    const lowEnergy = lowCount > 0 ? lowSum / lowCount : 0
    const midEnergy = midCount > 0 ? midSum / midCount : 0
    const highEnergy = highCount > 0 ? highSum / highCount : 0

    let centroidNum = 0
    let centroidDen = 0
    const nyquist = audioContext.sampleRate / 2
    const binHz = nyquist / frequencyData.length
    for (let i = typeLowStart; i <= typeHighEnd; i++) {
      const weight = toUnit(frequencyData[i])
      centroidNum += i * binHz * weight
      centroidDen += weight
    }
    const centroidHz = centroidDen > 0 ? centroidNum / centroidDen : 0

    return {
      rms,
      bassEnergy,
      flux,
      energyOnset,
      fluxOnset,
      score,
      lowEnergy,
      midEnergy,
      highEnergy,
      centroidHz,
      audioClock: audioContext.currentTime
    }
  }, [])

  const classifyBeatType = useCallback(
    (signal: {
      lowEnergy: number
      midEnergy: number
      highEnergy: number
      centroidHz: number
      energyOnset: number
      fluxOnset: number
    }): BeatType => {
      const { lowEnergy, midEnergy, highEnergy, centroidHz, energyOnset, fluxOnset } = signal

      const kickScore = lowEnergy * 1.6 + energyOnset * 1.4 - highEnergy * 0.9
      const hatScore = highEnergy * 1.7 + fluxOnset * 1.4 - lowEnergy * 1.0
      const snareScore =
        midEnergy * 1.5 +
        fluxOnset * 1.0 +
        clamp((centroidHz - 700) / 2500, 0, 1) * 0.8 -
        lowEnergy * 0.4

      const best = Math.max(kickScore, snareScore, hatScore)
      if (best < 0.06) return 'other'
      if (best === kickScore) return 'kick'
      if (best === hatScore) return 'hat'
      return 'snare'
    },
    []
  )

  const checkBeatFromEnergy = useCallback((): BeatCheck => {
    const signal = computeBeatSignal()
    if (!signal) return { fired: false, intensity: 1, type: 'other' }

    samplesSeenRef.current += 1

    // Adaptive threshold using smoothed mean + smoothed deviation (robust-ish, O(1) per frame).
    thresholdMeanRef.current = lerp(thresholdMeanRef.current, signal.score, THRESHOLD_MEAN_ALPHA)
    thresholdDevRef.current = lerp(
      thresholdDevRef.current,
      Math.abs(signal.score - thresholdMeanRef.current),
      THRESHOLD_DEV_ALPHA
    )

    const threshold = thresholdMeanRef.current + thresholdDevRef.current * THRESHOLD_DEV_MULTIPLIER
    const canFire = signal.audioClock - lastBeatAudioClockRef.current > MIN_BEAT_INTERVAL_S

    // Hysteresis: fire once when we rise above threshold, then wait to drop back near baseline.
    const shouldArmReset = signal.score < thresholdMeanRef.current + thresholdDevRef.current * 0.8
    if (shouldArmReset) {
      isInBeatRef.current = false
    }

    const warmedUp = samplesSeenRef.current >= WARMUP_SAMPLES
    const fired = warmedUp && !isInBeatRef.current && canFire && signal.score > threshold
    const type = fired ? classifyBeatType(signal) : 'other'
    if (fired) {
      isInBeatRef.current = true
      lastBeatAudioClockRef.current = signal.audioClock
    }

    const intensity = clamp(0.6 + signal.energyOnset * 14 + signal.fluxOnset * 6, 0.6, 2.2)

    return { fired, intensity, type }
  }, [classifyBeatType, computeBeatSignal])

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      animationRef.current = requestAnimationFrame(drawFrame)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      animationRef.current = requestAnimationFrame(drawFrame)
      return
    }

    const { width, height } = sizeRef.current
    ctx.clearRect(0, 0, width, height)

    if (isActiveRef.current) {
      const currentTime = audio?.currentTime ?? 0
      if (currentTime + 0.1 < lastAudioTimeRef.current) {
        resetDetectorState()
      }
      lastAudioTimeRef.current = currentTime

      const beatCheck = checkBeatFromEnergy()
      if (beatCheck.fired) {
        spawnBeatBurst(beatCheck.intensity, beatCheck.type)
      }
    }

    if (sparksRef.current.length > 0 || flashesRef.current.length > 0) {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'

      flashesRef.current = flashesRef.current.filter(flash => {
        flash.life -= 1
        if (flash.life <= 0) return false

        const progress = 1 - flash.life / flash.maxLife
        const radius = flash.radius * (0.6 + progress * 0.8)
        const alpha = flash.alpha * (1 - progress)
        const gradient = ctx.createRadialGradient(
          flash.x,
          flash.y,
          0,
          flash.x,
          flash.y,
          radius
        )
        gradient.addColorStop(0, `hsla(${flash.hue}, 90%, 70%, ${alpha})`)
        gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(flash.x, flash.y, radius, 0, Math.PI * 2)
        ctx.fill()
        return true
      })

      sparksRef.current = sparksRef.current.filter(spark => {
        spark.life -= 1
        if (spark.life <= 0) return false

        spark.x += spark.vx
        spark.y += spark.vy
        spark.vx *= 0.98
        spark.vy *= 0.98

        const lifeRatio = spark.life / spark.maxLife
        const alpha = spark.alpha * lifeRatio
        ctx.strokeStyle = `hsla(${spark.hue}, 90%, 65%, ${alpha})`
        ctx.lineWidth = spark.width
        ctx.beginPath()
        ctx.moveTo(spark.x, spark.y)
        ctx.lineTo(
          spark.x - spark.vx * spark.length,
          spark.y - spark.vy * spark.length
        )
        ctx.stroke()
        return true
      })

      ctx.restore()
    }

    animationRef.current = requestAnimationFrame(drawFrame)
  }, [audio, checkBeatFromEnergy, resetDetectorState, spawnBeatBurst])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(drawFrame)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [drawFrame])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none transition-opacity duration-500"
      style={{
        zIndex: 0,
        opacity: isActive ? 1 : 0,
        background: 'transparent'
      }}
      aria-hidden="true"
    />
  )
}
