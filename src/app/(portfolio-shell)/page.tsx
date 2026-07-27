import { getAllPosts } from '@/lib/blog'
import HomeTabs from '@/components/shell/HomeTabs'
import NowTab from '@/components/now/NowTab'
import BuildsTab from '@/components/builds/BuildsTab'
import WritesTab from '@/components/writes/WritesTab'

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
