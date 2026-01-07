"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog in production
    // Events captured in dev get queued but never sent since init() isn't called
    if (process.env.NODE_ENV !== "production") return

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: '2025-05-24',
      capture_exceptions: true,
    })
  }, [])

  // Always render PHProvider so usePostHog() hook works in components
  return <PHProvider client={posthog}>{children}</PHProvider>
}
