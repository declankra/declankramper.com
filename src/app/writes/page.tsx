// src/app/writes/page.tsx
import { getAllPosts } from '@/lib/blog';
import BlogList from '@/components/blog/BlogList';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';

export default async function WritesPage() {
  const posts = await getAllPosts();

  return (
    <div className="relative pt-16">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4">
        <BreadcrumbNav
          items={[
            { href: "/", label: "home" },
            { href: "/writes", label: "writes", current: true }
          ]}
        />
      </div>
      <BlogList initialPosts={posts} />
    </div>
  );
}