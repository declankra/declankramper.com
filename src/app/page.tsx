import HomePageClient from '@/components/home/HomePageClient'
import { getRecentPosts } from '@/lib/blog'

export default async function Home() {
  const recentWrites = await getRecentPosts(3)
  return <HomePageClient recentWrites={recentWrites} />
}
