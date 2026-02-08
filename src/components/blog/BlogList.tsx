// src/components/blog/BlogList.tsx
'use client'

import { useState } from 'react';
import type { BlogCategory, BlogPostSummary } from '@/types/blog';
import CategoryFilter from '@/components/blog/CategoryFilter';
import PostList from '@/components/blog/PostList';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BlogListProps {
  initialPosts: BlogPostSummary[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<BlogCategory[]>([]);

  // Get unique categories from all posts
  const allCategories = Array.from(
    new Set(initialPosts.flatMap(post => post.categories))
  ) as BlogCategory[];

  const filteredPosts = initialPosts.filter(post => {
    // Filter by search query across title and preview
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const postText = `${post.title} ${post.preview}`.toLowerCase();
    
    const matchesSearch = searchQuery === '' || 
      searchTerms.every(term => postText.includes(term));

    // Filter by categories (if any are selected)
    const matchesCategories = 
      selectedCategories.length === 0 || 
      selectedCategories.some(category => post.categories.includes(category));

    return matchesSearch && matchesCategories;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      {/* Simple header */}
      <header className="mb-12 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Declan Kramper</h1>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Writes</p>
          <p className="text-xs text-muted-foreground">thoughts on a few of the things i'm thinking about to think deeper.</p>
        </div>
      </header>
      
      {/* Search with minimal styling */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-sm border-0 bg-secondary/50 focus-visible:ring-0"
        />
      </div>

      {/* Category Filter - hidden by default, can be toggled */}
      <div className="mb-8">
        <CategoryFilter
          categories={allCategories}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
        />
      </div>

      {/* Posts List */}
      <PostList posts={filteredPosts} />
    </div>
  );
}
