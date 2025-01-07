// src/app/writes/page.tsx
import { getAllPosts } from '@/lib/blog';
import BlogList from '@/components/blog/BlogList';

export default async function WritesPage() {
  const posts = await getAllPosts();

  return <BlogList initialPosts={posts} />;
}