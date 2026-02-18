// src/types/blog.ts
export type BlogCategory = 'Life' | 'Career' | 'Tech' | 'Business' | 'Product' | 'AI';

export interface BlogPostSummary {
  title: string;
  date: string;
  categories: BlogCategory[]; // Changed from single category to array
  preview: string;
  slug: string;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
}
