'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';

export default function RunsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 relative">
      {/* Breadcrumb at the top */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4">
        <BreadcrumbNav
          items={[
            { href: "/", label: "home" },
            { href: "/runs", label: "runs", current: true }
          ]}
        />
      </div>
      
      {/* Main content */}
      <div className="max-w-3xl w-full mt-16 flex flex-col items-center">
        {/* Headline */}
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Running is a beautiful thing. I'm grateful I can.
        </motion.h1>
        
        {/* Video */}
        <motion.div 
          className="max-w-[300px] mx-auto mt-6 mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <video 
            src="/videos/halftone_indy_finish.mp4" 
            className="w-full h-auto object-contain rounded-lg"
            playsInline
            autoPlay
            muted
            loop
          >
            Your browser does not support the video tag.
          </video>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl text-gray-600 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          More thoughts and numbers coming soon
        </motion.p>
      </div>
    </div>
  );
}
