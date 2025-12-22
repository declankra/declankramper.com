import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-dynamic'

export async function GET() {
  const posts = await getAllPosts()
  const recent = posts.slice(0, 3).map((post) => ({
    title: post.title,
    slug: post.slug,
    date: post.date
  }))

  return NextResponse.json(recent)
}
