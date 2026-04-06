"use client"

import { useEffect } from "react"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import "@/lib/analytics/posthog/init"
import {
  isChunkLoadError,
  markChunkReloadAttempt,
  shouldReloadForChunkError,
} from "@/lib/chunk-load"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const recoverFromChunkLoadError = (value: unknown) => {
      if (!isChunkLoadError(value)) {
        return
      }

      const { sessionStorage, location } = window
      if (!shouldReloadForChunkError(sessionStorage, location.pathname)) {
        return
      }

      markChunkReloadAttempt(sessionStorage, location.pathname)
      location.reload()
    }

    const handleError = (event: ErrorEvent) => {
      recoverFromChunkLoadError(event.error ?? event.message)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      recoverFromChunkLoadError(event.reason)
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
