'use client'
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Type for build/work items
interface BuildItem {
  title: string;
  description: string;
  date: string;
  link?: string;
  tags: string[];
}

// Sample data - you can move this to a separate data file later
const buildItems: BuildItem[] = [
  {
    title: "Personal Portfolio",
    description: "A minimalist portfolio website built with Next.js, TailwindCSS, and Framer Motion.",
    date: "2024",
    tags: ["Next.js", "TypeScript", "TailwindCSS"]
  }
  // Add more items as they come
];

export default function BuildsPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  
  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero section with animated text */}
      <motion.section 
        className="h-screen flex flex-col items-center justify-center relative px-4"
        style={{ opacity: headerOpacity, y: headerY }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-medium text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          I build stuff.
        </motion.h1>
        
        <motion.p
          className="text-lg text-muted-foreground text-center max-w-xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Keep scrolling to view my recent work, or{' '}
          <Link href="https://dkbuilds.co" className="underline underline-offset-4 hover:text-foreground">
            click here
          </Link>
          {' '}to view my products you can use yourself right now.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="animate-bounce"
        >
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </motion.section>

      {/* Work items section */}
      <section className="max-w-4xl mx-auto px-4 py-24">
        <div className="space-y-24">
          {buildItems.map((item, index) => (
            <BuildItem key={index} item={item} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Individual build item component with animation
function BuildItem({ item, index }: { item: BuildItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  
  return (
    <motion.article
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-medium">{item.title}</h2>
          <span className="text-sm text-muted-foreground">{item.date}</span>
        </div>
        
        <p className="text-muted-foreground">{item.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {item.link && (
          <Button variant="ghost" size="sm" asChild className="mt-4">
            <Link href={item.link} target="_blank" rel="noopener noreferrer">
              View Project <ExternalLink className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>
    </motion.article>
  );
}