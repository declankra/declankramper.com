const CHUNK_ERROR_PATTERNS = [
  /ChunkLoadError/i,
  /Loading chunk [^\s]+ failed/i,
  /Failed to load chunk/i,
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /\/_next\/static\/chunks\//i,
] as const

const CHUNK_RELOAD_STORAGE_KEY = "chunk-load-recovery"
const CHUNK_RELOAD_THROTTLE_MS = 30_000

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const extractMessage = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value
  }

  if (value instanceof Error) {
    return value.message || value.name
  }

  if (isRecord(value)) {
    const message = value.message
    if (typeof message === "string") {
      return message
    }

    const reason = value.reason
    if (reason) {
      return extractMessage(reason)
    }
  }

  return undefined
}

export const getChunkLoadErrorMessage = (value: unknown): string | undefined => {
  const message = extractMessage(value)?.trim()
  return message ? message : undefined
}

export const isChunkLoadError = (value: unknown): boolean => {
  const message = getChunkLoadErrorMessage(value)
  if (!message) {
    return false
  }

  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message))
}

type ChunkReloadRecord = {
  pathname: string
  timestamp: number
}

const readChunkReloadRecord = (storage: Storage): ChunkReloadRecord | null => {
  const raw = storage.getItem(CHUNK_RELOAD_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ChunkReloadRecord>
    if (typeof parsed.pathname !== "string" || typeof parsed.timestamp !== "number") {
      return null
    }

    return {
      pathname: parsed.pathname,
      timestamp: parsed.timestamp,
    }
  } catch {
    return null
  }
}

export const shouldReloadForChunkError = (
  storage: Storage,
  pathname: string,
  now = Date.now()
): boolean => {
  const previousAttempt = readChunkReloadRecord(storage)

  if (!previousAttempt) {
    return true
  }

  const isSamePath = previousAttempt.pathname === pathname
  const isWithinThrottleWindow = now - previousAttempt.timestamp < CHUNK_RELOAD_THROTTLE_MS

  return !(isSamePath && isWithinThrottleWindow)
}

export const markChunkReloadAttempt = (
  storage: Storage,
  pathname: string,
  now = Date.now()
) => {
  storage.setItem(
    CHUNK_RELOAD_STORAGE_KEY,
    JSON.stringify({
      pathname,
      timestamp: now,
    })
  )
}
