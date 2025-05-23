// src/components/readme/ReadmeLink.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileCode } from "lucide-react";
import { useOpenPanel } from "@openpanel/nextjs";
import { ReadmeDialog } from "./ReadmeDialog";

export function ReadmeLink() {
  const op = useOpenPanel();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const linkRef = useRef<HTMLDivElement>(null);
  const [linkPosition, setLinkPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Delay appearance of the link by 0.5s
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    // Track the readme button click
    op.track('readme_button_clicked', {
      location: 'top_left_corner',
      component: 'ReadmeLink'
    });

    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      setLinkPosition({ x: rect.left, y: rect.top });
    }
    setIsOpen(true);
  };

  return (
    <>
      <motion.div
        ref={linkRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-4 left-4 z-10"
      >
        <button
          onClick={handleClick}
          className="transition-opacity hover:opacity-70 cursor-pointer text-xs flex items-center gap-1.5"
        >
          <FileCode className="w-4 h-4" />
          README.md
        </button>
      </motion.div>

      <ReadmeDialog 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        origin={linkPosition}
      />
    </>
  );
}