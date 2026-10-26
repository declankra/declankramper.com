import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import HomeTabs from '@/components/shell/HomeTabs'
import NowTab from '@/components/now/NowTab'
import BuildsTab from '@/components/builds/BuildsTab'
import WritesTab from '@/components/writes/WritesTab'

const siteUrl = 'https://www.declankramper.com'
const previewTitle = 'Declan Kramper | Personal Portfolio'
const previewDescription = 'A place on the internet for some of my thoughts and projects'
const previewImage = `${siteUrl}/og/builds-v4.jpg`
const previewVideo = `${siteUrl}/og/builds-v5.mp4`

export const metadata: Metadata = {
  openGraph: {
    title: previewTitle,
    description: previewDescription,
    url: siteUrl,
    siteName: 'Declan Kramper',
    locale: 'en_US',
    type: 'website',
    images: [{ url: previewImage, width: 1200, height: 630, alt: 'Declan Kramper — selected builds' }],
    videos: [{
      url: previewVideo,
      secureUrl: previewVideo,
      type: 'video/mp4',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: previewTitle,
    description: previewDescription,
    images: [previewImage],
  },
}

export default async function Home() {
  const posts = await getAllPosts()
  return (
    <HomeTabs
      now={<NowTab />}
      builds={<BuildsTab />}
      writes={<WritesTab posts={posts} />}
    />
  )
}
