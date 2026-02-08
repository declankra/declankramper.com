// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import type { BlogCategory, BlogPost, BlogPostSummary } from '@/types/blog';
import { normalizeDateString } from '@/lib/date';

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

// Define the directory where blog posts are stored
const postsDirectory = path.join(process.cwd(), 'content/posts');

const getAllMarkdownSlugs = cache(async (): Promise<string[]> => {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md') && !fileName.startsWith('.'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
});

function toBlogPostSummary(slug: string, data: Record<string, unknown>): BlogPostSummary {
  const title = typeof data.title === 'string' ? data.title : slug;
  const preview = typeof data.preview === 'string' ? data.preview : '';
  const dateValue = typeof data.date === 'string' ? data.date : '';
  const rawCategories = Array.isArray(data.categories) ? data.categories : [];

  const categories = rawCategories
    .filter((category): category is string => typeof category === 'string')
    .map((category) => category.trim())
    .filter(Boolean) as BlogCategory[];

  return {
    slug,
    title,
    preview,
    categories,
    date: normalizeDateString(dateValue),
  };
}

const getPostSummaryBySlugCached = cache(async (slug: string): Promise<BlogPostSummary | null> => {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return toBlogPostSummary(slug, data as Record<string, unknown>);
  } catch (error) {
    console.error(`Error loading post metadata ${slug}:`, error);
    return null;
  }
});

function sortByDateDesc(posts: BlogPostSummary[]): BlogPostSummary[] {
  return posts.sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));
}

// Get all post summaries (used for listing/search/navigation).
export async function getAllPosts(): Promise<BlogPostSummary[]> {
  const slugs = await getAllMarkdownSlugs();
  const allPosts = await Promise.all(slugs.map((slug) => getPostSummaryBySlugCached(slug)));

  return sortByDateDesc(allPosts.filter((post): post is BlogPostSummary => post !== null));
}

export async function getRecentPosts(limit = 3): Promise<Pick<BlogPostSummary, 'slug' | 'title' | 'date'>[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit).map(({ slug, title, date }) => ({ slug, title, date }));
}

// Get adjacent posts (previous and next) for navigation
// Posts are sorted newest first, so "next" = older post, "previous" = newer post
export async function getAdjacentPosts(currentSlug: string): Promise<{
  previous: Pick<BlogPostSummary, 'slug' | 'title'> | null;
  next: Pick<BlogPostSummary, 'slug' | 'title'> | null;
}> {
  const posts = await getAllPosts();
  const currentIndex = posts.findIndex(post => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  // Previous = newer post (lower index), Next = older post (higher index)
  const previous = currentIndex > 0
    ? { slug: posts[currentIndex - 1].slug, title: posts[currentIndex - 1].title }
    : null;
  const next = currentIndex < posts.length - 1
    ? { slug: posts[currentIndex + 1].slug, title: posts[currentIndex + 1].title }
    : null;

  return { previous, next };
}

const getPostBySlugCached = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);
    const processedContent = await markdownToHtml(content);
    const summary = toBlogPostSummary(slug, data as Record<string, unknown>);

    return {
      ...summary,
      content: processedContent,
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
});

// Get a single post by its slug (used for individual blog post pages)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return getPostBySlugCached(slug);
}

// Helper function to convert markdown to HTML with enhanced features
async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm) // Enable GitHub-flavored markdown (tables, strikethrough, etc.)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeEnhanceMedia)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return result.toString();
}

// Lightweight rehype plugin to normalize media elements that appear in blog posts
function rehypeEnhanceMedia() {
  return (tree: HastNode) => {
    const visit = (node?: HastNode) => {
      if (!node || typeof node !== 'object') {
        return;
      }

      if (node.type === 'element' && typeof node.tagName === 'string') {
        const tag = node.tagName.toLowerCase();
        if (tag === 'img' || tag === 'video') {
          const properties = (node.properties ??= {});
          const classList = normalizeClassList(properties.className);

          if (!classList.includes('blog-media')) {
            classList.push('blog-media');
          }

          if (tag === 'img') {
            const src = typeof properties.src === 'string' ? properties.src : '';
            if (!properties.loading) {
              properties.loading = 'lazy';
            }
            if (!properties.decoding) {
              properties.decoding = 'async';
            }
            if (src.endsWith('.gif')) {
              properties['data-media-type'] = properties['data-media-type'] ?? 'gif';
            }
          }

          properties.className = classList;
        }
      }

      if (Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    };

    visit(tree);
  };
}

function normalizeClassList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === 'string') {
    return value
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}
