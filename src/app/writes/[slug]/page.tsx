// src/app/writes/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Badge } from "@/components/ui/badge";
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';

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
    title: `${post.title} | Declan Kramper`,
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
    <article className="max-w-3xl mx-auto px-4 py-8">
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
        className="text-[10px] text-muted-foreground block tracking-tight"
      >
        {new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </time>
    </header>

    {/* Post Preview */}
    <div className="text-xs text-muted-foreground mb-6 italic tracking-tight">
      {post.preview}
    </div>

    {/* Post Content */}
    <div 
      className="prose prose-neutral dark:prose-invert max-w-none 
          prose-p:text-sm prose-p:leading-relaxed prose-p:tracking-tight prose-p:text-foreground/90
          prose-headings:font-medium prose-headings:tracking-tight
          prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
          prose-pre:bg-secondary/50 prose-pre:border-0
          prose-code:text-sm prose-code:text-foreground prose-code:bg-secondary/50 prose-code:px-1 prose-code:rounded
          prose-strong:font-medium
          prose-a:text-foreground prose-a:underline-offset-4
          marker:text-muted-foreground
          prose-li:text-sm prose-li:tracking-tight prose-li:mt-0.5 prose-li:mb-0.5
          prose-ol:mt-0 prose-ol:mb-1.5
          prose-ul:mt-0 prose-ul:mb-1.5
          [&>*:first-child]:mt-0
          [&>ol]:space-y-1
          [&_ol_ol]:mt-1
          [&_li>p]:my-0
          [&_p:has(+ol)]:mb-1
          [&_p:has(+ul)]:mb-1
          [&_li]:text-foreground/90
          [&_li>ol]:mt-1
          [&_p+ol]:mt-1"
        dangerouslySetInnerHTML={{ __html: post.content }} 
        />
    </article>
  );
}