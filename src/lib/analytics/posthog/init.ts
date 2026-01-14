import posthog from "posthog-js"

// Only initialize PostHog in production.
// Guard against double init when multiple entrypoints import this module.
if (process.env.NODE_ENV === "production" && !(posthog as any).__loaded) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true,
  })
}
