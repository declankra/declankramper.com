import { PostHog } from "posthog-node";

// NOTE: This is a Node.js client for sending events from the server side to PostHog.
// Returns null in development to prevent any event tracking.
export default function PostHogClient(): PostHog | null {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}