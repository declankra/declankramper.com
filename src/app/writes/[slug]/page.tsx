// src/app/writes/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Badge } from "@/components/ui/badge";

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
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Post Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category: string) => (
            <Badge key={category} variant="secondary" className="text-xs px-2 py-0">
              {category.toLowerCase()}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <time 
          dateTime={post.date}
          className="text-xs text-muted-foreground block"
        >
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </header>

      {/* Post Preview */}
      <div className="text-md text-muted-foreground mb-8 italic">
        {post.preview}
      </div>

      {/* Post Content */}
      <div 
        className="prose prose-neutral dark:prose-invert max-w-none 
            prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground/90
            prose-headings:font-medium prose-headings:tracking-tight
            prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            prose-pre:bg-secondary/50 prose-pre:border-0
            prose-code:text-foreground prose-code:bg-secondary/50 prose-code:px-1 prose-code:rounded
            prose-strong:font-medium
            prose-a:text-foreground prose-a:underline-offset-4
            marker:text-muted-foreground
            prose-li:mt-0.5 prose-li:mb-0.5
            prose-ol:mt-0 prose-ol:mb-2
            prose-ul:mt-0 prose-ul:mb-2
            [&>*:first-child]:mt-0
            [&>ol]:space-y-0
            [&_ol_ol]:mt-0
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