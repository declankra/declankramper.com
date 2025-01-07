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
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <time 
          dateTime={post.date}
          className="text-muted-foreground"
        >
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </header>

      {/* Post Preview */}
      <div className="text-lg text-muted-foreground mb-8 italic">
        {post.preview}
      </div>

      {/* Post Content */}

      <div 
        className="prose prose-neutral dark:prose-invert max-w-none 
          prose-p:text-base prose-p:leading-relaxed 
          prose-headings:font-medium prose-headings:tracking-tight
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          prose-pre:bg-secondary/50 prose-pre:border-0
          prose-code:text-foreground prose-code:bg-secondary/50 prose-code:px-1 prose-code:rounded
          prose-strong:font-medium
          prose-a:text-foreground prose-a:underline-offset-4
          marker:text-muted-foreground
          [&>*:first-child]:mt-0"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </article>
  );
}