import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PostNavigationProps {
  previous: { slug: string; title: string } | null; // Newer post
  next: { slug: string; title: string } | null; // Older post
}

export default function PostNavigation({ previous, next }: PostNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Post navigation"
      className="mt-16 pt-8 border-t border-border"
    >
      <div className="flex justify-between items-stretch gap-4">
        {/* Newer post (left) */}
        {previous ? (
          <Link
            href={`/writes/${previous.slug}`}
            className="group flex items-center gap-2 max-w-[45%] py-2 text-foreground/60 hover:text-foreground transition-colors"
          >
            <ChevronLeft
              className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span className="text-sm truncate">{previous.title}</span>
          </Link>
        ) : (
          <div aria-hidden="true" />
        )}

        {/* Older post (right) */}
        {next ? (
          <Link
            href={`/writes/${next.slug}`}
            className="group flex items-center gap-2 max-w-[45%] py-2 ml-auto text-right text-foreground/60 hover:text-foreground transition-colors"
          >
            <span className="text-sm truncate">{next.title}</span>
            <ChevronRight
              className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <div aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}
