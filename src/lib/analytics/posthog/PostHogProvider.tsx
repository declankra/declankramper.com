"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import "@/lib/analytics/posthog/init"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // Always render PHProvider so usePostHog() hook works in components
  return <PHProvider client={posthog}>{children}</PHProvider>
}
