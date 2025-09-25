// src/app/writes/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Badge } from "@/components/ui/badge";
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import ScrollbarsActivator from '@/components/layout/ScrollbarsActivator';

// Generate all possible paths at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
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

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article id="writes-post-root" className="max-w-2xl mx-auto px-4 py-8">
      <ScrollbarsActivator rootId="writes-post-root" />
      <BreadcrumbNav
        items={[
          { href: "/", label: "home" },
          { href: "/writes", label: "writes" },
          { label: post.title, current: true }
        ]}
      />
    {/* Post Header */}
    <header className="mb-6">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {post.categories.map((category: string) => (
          <Badge key={category} variant="secondary" className="text-[10px] px-1.5 py-0">
            {category.toLowerCase()}
          </Badge>
        ))}
      </div>
      <h1 className="text-xl font-medium tracking-tight mb-1.5">{post.title}</h1>
      <time 
        dateTime={post.date}
        className="text-[10px] text-foreground/70 block tracking-tight"
      >
        {new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </time>
    </header>

    {/* Post Preview */}
    <div className="text-xs text-foreground/70 mb-6 italic tracking-tight">
      {post.preview}
    </div>

    {/* Post Content */}
    <div 
      className="prose prose-neutral dark:prose-invert max-w-none 
          prose-p:text-sm prose-p:leading-loose prose-p:tracking-normal prose-p:text-foreground/95 prose-p:mb-4
          prose-headings:font-medium prose-headings:tracking-normal prose-headings:mt-8 prose-headings:mb-4
          prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
          prose-pre:bg-secondary/50 prose-pre:border-0
          prose-code:text-sm prose-code:text-foreground prose-code:bg-secondary/50 prose-code:px-1 prose-code:rounded
          prose-strong:font-medium
          prose-a:text-foreground prose-a:underline-offset-4
          marker:text-foreground/70
          prose-li:text-sm prose-li:tracking-normal prose-li:mt-1 prose-li:mb-2
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
          [&_li]:text-foreground/95
          [&_li>ol]:mt-2
          [&_p+ol]:mt-2"
        dangerouslySetInnerHTML={{ __html: post.content }} 
    />
    </article>
  );
}
