// src/app/page.tsx
'use client'

import Link from 'next/link';
import { ReadmeLink } from '@/components/readme/ReadmeLink';
import CursorTrail from '@/components/game/CursorTrail';

export default function Home() {
  return (
    <>
      <CursorTrail />

      {/* README.md link appears in top left */}
      <ReadmeLink />

      <main className="flex min-h-screen flex-col items-center justify-center text-sm space-y-1">
        {/* Name - bold and non-interactive */}
        <p className="font-bold">
          Declan Kramper
        </p>

        {/* Build */}
        <Link
          href="/builds"
          className="transition-opacity hover:opacity-70 cursor-pointer"
        >
          build
        </Link>

        {/* Run - with hover card */}
        <Link
          href="/runs"
          className="transition-opacity hover:opacity-70 cursor-pointer"
        >
          run
        </Link>

        {/* Write - with link */}
        <Link
          href="/writes"
          className="transition-opacity hover:opacity-70"
        >
          write
        </Link>
      </main>
    </>
  );
}