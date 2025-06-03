// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import footnotes from 'remark-footnotes';
import remarkGfm from 'remark-gfm';
import { BlogPost } from '@/types/blog';

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
      .use(html, {
        sanitize: false, // Allow raw HTML
        allowDangerousHtml: true // Required for some HTML elements
      })
      .process(markdown);
    return result.toString();
  }