// src/app/writes/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Badge } from "@/components/ui/badge";
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import ScrollbarsActivator from '@/components/layout/ScrollbarsActivator';
import ReadingProgress from "@/components/blog/ReadingProgress";

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
      <ReadingProgress />
      <ScrollbarsActivator rootId="writes-post-root" />
      <BreadcrumbNav
        items={[
          { href: "/", label: "home" },
          { href: "/writes", label: "writes" },
          { label: post.title, current: true }
        ]}
      />
      {/* Post Header */}
      <header className="mt-10 mb-8">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {post.categories.map((category: string) => (
              <Badge key={category} variant="secondary" className="text-[10px] px-1.5 py-0">
                {category.toLowerCase()}
              </Badge>
            ))}
          </div>
          <time 
            dateTime={post.date}
            className="shrink-0 text-[10px] text-foreground/70 leading-6 tracking-tight"
          >
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{post.title}</h1>
        <p className="mt-3 text-sm text-foreground/70">
          {post.preview}
        </p>
      </header>

      {/* Post Content */}
      <div 
        className="prose prose-neutral dark:prose-invert max-w-none 
          prose-p:text-[15px] prose-p:leading-loose prose-p:tracking-normal prose-p:text-foreground/95 prose-p:mb-4
          prose-headings:font-bold prose-headings:tracking-normal prose-headings:mt-8 prose-headings:mb-4
          prose-h2:text-xl prose-h3:text-base
          prose-pre:bg-secondary/50 prose-pre:border-0
          prose-code:text-sm prose-code:text-foreground prose-code:bg-secondary/50 prose-code:px-1 prose-code:rounded
          prose-strong:font-bold
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
