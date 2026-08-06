import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

const root = process.cwd()
const dataPath = join(root, 'src/components/finished/FinishedProjectsData.ts')
const playerPath = join(root, 'src/components/builds/VisualLightbox.tsx')
const maxVideoBytes = 5 * 1024 * 1024
const maxPosterBytes = 200 * 1024

const withoutComments = readFileSync(dataPath, 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')

const videoVisuals = [...withoutComments.matchAll(/\{\s*type:\s*'video',([\s\S]*?)\n\s*\}/g)]

if (videoVisuals.length === 0) {
  throw new Error('No builds video visuals found; the regression check is no longer exercising the page data.')
}

const failures = []

for (const [, fields] of videoVisuals) {
  const src = fields.match(/src:\s*'([^']+)'/)?.[1]
  const poster = fields.match(/poster:\s*'([^']+)'/)?.[1]

  if (!src) {
    failures.push('A video visual is missing src.')
    continue
  }

  const videoPath = join(root, 'public', src)
  if (!existsSync(videoPath)) {
    failures.push(`${src}: video file does not exist.`)
  } else if (statSync(videoPath).size > maxVideoBytes) {
    failures.push(`${src}: video is ${(statSync(videoPath).size / 1024 / 1024).toFixed(1)} MB (limit: 5 MB).`)
  }

  if (!poster) {
    failures.push(`${src}: poster is missing.`)
    continue
  }

  const posterPath = join(root, 'public', poster)
  if (!existsSync(posterPath)) {
    failures.push(`${src}: poster file ${poster} does not exist.`)
  } else {
    if (extname(posterPath) !== '.webp') {
      failures.push(`${src}: poster must be WebP for fast delivery.`)
    }
    if (statSync(posterPath).size > maxPosterBytes) {
      failures.push(`${poster}: poster is ${(statSync(posterPath).size / 1024).toFixed(0)} KB (limit: 200 KB).`)
    }
  }
}

const player = readFileSync(playerPath, 'utf8')
if (!player.includes('poster={first.poster}')) {
  failures.push('The builds thumbnail video does not render its poster.')
}
if (!player.includes('poster={visual.poster}')) {
  failures.push('The builds lightbox video does not render its poster.')
}

if (failures.length > 0) {
  console.error(`Build media check failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Build media check passed: ${videoVisuals.length} videos have lightweight posters and mobile-safe payloads.`)
