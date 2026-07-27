// src/app/(portfolio-shell)/writes/[slug]/page.tsx
import { getPostBySlug, getAllPosts, getAdjacentPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ArticleTransition from '@/components/writes/ArticleTransition';
import ReadingProgress from "@/components/blog/ReadingProgress";
import PostNavigation from "@/components/blog/PostNavigation";
import { formatDateUTC } from '@/lib/date';

// Generate all possible paths at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.preview,
    openGraph: {
      title: post.title,
      description: post.preview,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, adjacentPosts] = await Promise.all([
    getPostBySlug(slug),
    getAdjacentPosts(slug),
  ]);

  if (!post) {
    notFound();
  }

  const words = post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(words / 220));

  return (
    <ArticleTransition>
      {/* The desktop shell reserves 200px for the rail, so centering only within
          the remaining pane makes the reading measure look too far right.
          Offset by roughly half the rail width (accounting for pane gutters)
          once there is enough room to keep the article clear of the rail. */}
      <article
        id="writes-post-root"
        className="mx-auto max-w-[620px] pb-16 lg:-translate-x-[90px]"
      >
        <ReadingProgress />
        <h1 className="mb-2 text-[clamp(22px,2.6vw,30px)] font-medium leading-[1.2] tracking-[-0.02em] text-[#0A0A0B]">
          {post.title}
        </h1>
        <div className="mb-[26px] text-xs text-[#999]">
          {formatDateUTC(post.date, { year: 'numeric', month: 'long', day: 'numeric' })} · {readMinutes} min read
        </div>
        {/* globals.css blog media styles target .prose — keep that hook */}
        <div
          className="prose prose-neutral max-w-none
            prose-p:text-[15px] prose-p:leading-[1.75] prose-p:tracking-normal prose-p:text-[#333] prose-p:mb-4
            prose-headings:font-semibold prose-headings:tracking-normal prose-headings:mt-8 prose-headings:mb-4
            prose-h2:text-xl prose-h3:text-base
            prose-pre:bg-secondary/50 prose-pre:border-0
            prose-code:text-sm prose-code:text-foreground prose-code:bg-secondary/50 prose-code:px-1 prose-code:rounded
            prose-strong:font-bold
            prose-a:text-foreground prose-a:underline-offset-4
            marker:text-foreground/70
            prose-li:text-[15px] prose-li:tracking-normal prose-li:mt-1 prose-li:mb-2
            prose-ol:mt-2 prose-ol:mb-2
            prose-ul:mt-2 prose-ul:mb-2
            prose-table:text-sm prose-table:mt-6 prose-table:mb-6
            prose-thead:border-b prose-thead:border-border
            prose-th:text-left prose-th:font-medium prose-th:px-3 prose-th:py-2 prose-th:text-sm
            prose-td:px-3 prose-td:py-2 prose-td:text-sm prose-td:border-t prose-td:border-border
            prose-tr:border-b prose-tr:border-border
            [&>*:first-child]:mt-0
            [&>ol]:space-y-2
            [&_ol_ol]:mt-2
            [&_li>p]:my-0
            [&_p:has(+ol)]:mb-2
            [&_p:has(+ul)]:mb-2
            [&_li]:text-[#333]
            [&_li>ol]:mt-2
            [&_p+ol]:mt-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <PostNavigation previous={adjacentPosts.previous} next={adjacentPosts.next} />
      </article>
    </ArticleTransition>
  );
}
