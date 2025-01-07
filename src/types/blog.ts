// src/types/blog.ts
export type BlogCategory = 'Life' | 'Career' | 'Tech' | 'Running' | 'Business' | 'Product' | 'Case Studies' | 'POVs' | 'dkBuilds';

export interface BlogPost {
  title: string;
  date: string;
  categories: BlogCategory[]; // Changed from single category to array
  preview: string;
  slug: string;
  content: string;
}