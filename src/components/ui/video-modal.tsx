'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

// Snappy ease-out per Emil Kowalski: "starts fast and slows down at the end"
const snappyEaseOut = [0.22, 1, 0.36, 1] as const;

export function VideoModal({ 
  isOpen, 
  onClose, 
  videoSrc, 
  autoPlay = true,
  muted = false,
  loop = false
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && videoRef.current && autoPlay) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [isOpen, autoPlay]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with fade animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: snappyEaseOut }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal content with scale + fade animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              duration: 0.25, // Per Emil: <300ms for snappy feel
              ease: snappyEaseOut 
            }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div 
              className="relative max-w-[90vw] max-h-[90vh] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                onClick={onClose}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                aria-label="Close modal"
              >
                <X size={32} />
              </motion.button>
              <video
                ref={videoRef}
                src={videoSrc}
                className="max-w-full max-h-[85vh] rounded-lg"
                controls
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}