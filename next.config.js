// /coffee is a separate Next.js app (~/Code/chicago-coffee-shop-decision, basePath '/coffee').
// These rewrites proxy it whole, so none of this site's layout renders there (Next.js multi-zones).
const COFFEE_ORIGIN = process.env.COFFEE_ORIGIN || 'https://chicago-coffee-eight.vercel.app';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/builds', destination: '/#builds', permanent: false },
      { source: '/everything-i-built', destination: '/#builds', permanent: false },
    ];
  },
  async rewrites() {
    return [
      // The coffee agent's routes (eve) sit at that deployment's root, outside its basePath.
      { source: '/coffee/eve/v1/:path*', destination: `${COFFEE_ORIGIN}/eve/v1/:path*` },
      { source: '/coffee', destination: `${COFFEE_ORIGIN}/coffee` },
      { source: '/coffee/:path*', destination: `${COFFEE_ORIGIN}/coffee/:path*` },
      {
        source: '/ph/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ph/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
