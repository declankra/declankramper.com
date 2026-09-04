import type { Metadata } from 'next'

import WritesTab from '@/components/writes/WritesTab'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Writes',
  description: 'Written thoughts on applied AI, products, and life.',
}

export default async function WritesPage() {
  return <WritesTab posts={await getAllPosts()} />
}
