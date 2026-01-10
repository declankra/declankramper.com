// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import footnotes from 'remark-footnotes';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { BlogPost } from '@/types/blog';

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

// Define the directory where blog posts are stored
const postsDirectory = path.join(process.cwd(), 'content/posts');

// Get all posts (used for the blog listing page)
export async function getAllPosts(): Promise<BlogPost[]> {
  // Get file names under /content/posts
  const fileNames = fs.readdirSync(postsDirectory);
  
  // Filter out non-markdown files and system files
  const markdownFiles = fileNames.filter(fileName => {
    // Only process .md files
    const isMarkdown = fileName.endsWith('.md');
    // Exclude system files (like .DS_Store)
    const isNotSystemFile = !fileName.startsWith('.');
    return isMarkdown && isNotSystemFile;
  });
  
  // Get the data from each file
  const allPosts = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const post = await getPostBySlug(slug);
      return post;
    })
  );

  // Sort posts by date and filter out any null posts
  return allPosts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));
}

// Get adjacent posts (previous and next) for navigation
// Posts are sorted newest first, so "next" = older post, "previous" = newer post
export async function getAdjacentPosts(currentSlug: string): Promise<{
  previous: Pick<BlogPost, 'slug' | 'title'> | null;
  next: Pick<BlogPost, 'slug' | 'title'> | null;
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

// Get a single post by its slug (used for individual blog post pages)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML string
    const processedContent = await markdownToHtml(content);

    return {
      slug,
      title: data.title,
      date: data.date,
      categories: data.categories,
      preview: data.preview,
      content: processedContent,
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

// Helper function to convert markdown to HTML with enhanced features
async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm) // Enable GitHub-flavored markdown (tables, strikethrough, etc.)
    .use(footnotes, {
      inlineNotes: true, // Enable inline footnotes
      footnoteLinkBack: true // Add back-links from footnotes to references
    })
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
