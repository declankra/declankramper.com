import Link from 'next/link'

import type { BlogPostSummary } from '@/types/blog'
import { formatDateUTC } from '@/lib/date'

export default function WritesTab({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <div>
      <div className="mb-6 mt-1 max-w-[640px]">
        <h2 className="mb-1.5 text-[15px] font-semibold text-[#0A0A0B]">writes</h2>
        <p className="text-[13.5px] leading-[1.5] text-[#999]">
          written thoughts on a few things to think deeper. applied AI, products, and life.
        </p>
      </div>
      <div className="max-w-[680px]">
        {posts.map((post) => (
          <article key={post.slug} className="py-[18px]">
            <div className="mb-1.5">
              <time className="text-[11px] tabular-nums text-[#999]" dateTime={post.date}>
                {formatDateUTC(post.date, { year: 'numeric', month: 'short' })}
              </time>
            </div>
            <h3 className="mb-1 text-base font-semibold">
              <Link
                href={`/writes/${post.slug}`}
                className="text-[#0A0A0B] no-underline hover:underline hover:underline-offset-[3px]"
              >
                {post.title}
              </Link>
            </h3>
            <p className="text-[13.5px] leading-[1.55] text-[#666]">{post.preview}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
