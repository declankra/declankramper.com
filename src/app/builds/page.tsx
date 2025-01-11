// src/app/builds/page.tsx
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { BuildsTimeline } from '@/components/builds/BuildsTimeline';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';

export default function BuildsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.25], [0, 100]);

  const handleScrollToTimeline = () => {
    timelineRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4">
        {/* Breadcrumb at the top */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4">
          <BreadcrumbNav
            items={[
              { href: "/", label: "home" },
              { href: "/builds", label: "builds", current: true }
            ]}
          />
        </div>

        <motion.div
          className="text-center space-y-6"
          style={{ opacity, y }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            I build stuff.
          </motion.h1>
          
          <motion.p
            className="text-lg text-muted-foreground max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            A collection of projects and products I've built.
            Keep scrolling to see my work through time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="pt-8"
          >
            <button
              onClick={handleScrollToTimeline}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowDown className="w-6 h-6 animate-bounce" />
              <span className="sr-only">Scroll to timeline</span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <div ref={timelineRef}>
        <BuildsTimeline />
      </div>
    </div>
  );
}