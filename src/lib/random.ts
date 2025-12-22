// Random destination utility for the portfolio
// Collects all available destinations and picks one at random

const blogSlugs = [
  'first-blog',
  'why-deep-research-is-my-agi',
  'how-to-build-a-full-code-prototype-as-a-pm',
  'meaning-making',
  'on-demand-software',
  'pm-pov-capital-one',
  'writing-challenge-not-painful-enough',
  'luck',
  'crazy-does',
  'coffee-shop-to-nowhere',
  'on-the-future-of-products',
  'how-to-improve-product-apple-watch',
  'on-the-future-of-apps',
  'which-divvy-bike-station-needs-another-rack',
  'why-im-excited-for-the-future-of-work',
  'my-design-capabilities',
  'how-im-improving-my-design-sense',
  '2-5X-XX',
  'shipuary-2025',
  'garpple-thesis',
  'chitrack-lessons-learned'
]

const projectPages = [
  '/builds',
  '/runs',
  '/writes',
  '/everything-i-built',
]

export function getRandomDestination(): string {
  // Combine all destinations
  const blogPaths = blogSlugs.map(slug => `/writes/${slug}`)
  const allDestinations = [...blogPaths, ...projectPages]

  // Pick a random one
  const randomIndex = Math.floor(Math.random() * allDestinations.length)
  return allDestinations[randomIndex]
}

export function getRandomBlogPost(): string {
  const randomIndex = Math.floor(Math.random() * blogSlugs.length)
  return `/writes/${blogSlugs[randomIndex]}`
}

export function getRandomProjectPage(): string {
  const randomIndex = Math.floor(Math.random() * projectPages.length)
  return projectPages[randomIndex]
}
