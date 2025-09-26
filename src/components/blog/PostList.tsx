import React from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BlogPost } from '@/types/blog';

interface PostListProps {
  posts: BlogPost[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pt-4">
      {posts.map((post) => (
        <motion.article
          key={post.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="group transition-opacity duration-200 hover:opacity-70"
        >
          <Link href={`/writes/${post.slug}`} className="block space-y-2">
            {/* Categories */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Badge 
                    key={category} 
                    variant="secondary"
                    className="text-xs px-2 py-0 bg-transparent hover:bg-transparent text-muted-foreground"
                  >
                    {category.toLowerCase()}
                  </Badge>
                ))}
              </div>
              <time className="shrink-0 text-xs text-muted-foreground leading-6 tracking-tight">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            {/* Title */}
            <h2 className="text-lg font-medium">
              {post.title}
            </h2>
            
            {/* Preview */}
            <p className="text-sm text-muted-foreground">
              {post.preview}
            </p>
            
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
