import posthog from "posthog-js"

// Only initialize PostHog in production.
// Guard against double init when multiple entrypoints import this module.
if (process.env.NODE_ENV === "production" && !(posthog as any).__loaded) {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!posthogKey) {
    console.warn("PostHog key missing: set NEXT_PUBLIC_POSTHOG_KEY")
  } else {
    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "/ph",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ?? "https://us.posthog.com",
      defaults: "2025-11-30",
      capture_exceptions: true,
    })
  }
}
