// app/page.tsx
'use client'

import Link from 'next/link';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-sm space-y-1">
      {/* Name - bold and non-interactive */}
      <p className="font-bold">
        Declan Kramper
      </p>

       {/* Build - with hover card */}
       {/* Build - with hover card */}
       <HoverCard>
        <HoverCardTrigger asChild>
        <Link 
            href="/builds"
            className="transition-opacity hover:opacity-70 cursor-pointer"
          >
            build
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="w-64 text-center">
          <p className="text-sm text-muted-foreground">
            A collection of projects and products I've built.
            <br />
            Coming soon.
          </p>
        </HoverCardContent>
      </HoverCard>
      
      {/* Run - with hover card */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <p className="transition-opacity hover:opacity-70 cursor-pointer">
            run
          </p>
        </HoverCardTrigger>
        <HoverCardContent className="w-64 text-center">
          <p className="text-sm text-muted-foreground">
            My running journey in words and numbers.
            <br />
            Coming soon.
          </p>
        </HoverCardContent>
      </HoverCard>
      
      {/* Write - with link */}
      <Link 
        href="/writes"
        className="transition-opacity hover:opacity-70"
      >
        write
      </Link>
    </main>
  );
}