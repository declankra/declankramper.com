// src/app/page.tsx
'use client'

import Link from 'next/link';
import { ReadmeLink } from '@/components/readme/ReadmeLink';
import CursorTrail from '@/components/game/CursorTrail';
import FusionFrenzyGame from '@/components/game/FusionFrenzyGame';
import BuildIcon from '@/components/home/BuildIcon';
import RunIcon from '@/components/home/RunIcon';
import WriteIcon from '@/components/home/WriteIcon';

export default function Home() {
  return (
    <>
      {/* Cursor trail effect */}
      <CursorTrail />

      {/* Fusion Frenzy Game */}
      <FusionFrenzyGame />

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
          className="build-link transition-opacity hover:opacity-70 cursor-pointer flex items-center"
        >
          <BuildIcon />
          build
        </Link>

        {/* Run - with hover card */}
        <Link
          href="/runs"
          className="run-link transition-opacity hover:opacity-70 cursor-pointer flex items-center"
        >
          <RunIcon />
          run
        </Link>

        {/* Write - with link */}
        <Link
          href="/writes"
          className="write-link transition-opacity hover:opacity-70 flex items-center"
        >
          <WriteIcon />
          write
        </Link>
      </main>
    </>
  );
}