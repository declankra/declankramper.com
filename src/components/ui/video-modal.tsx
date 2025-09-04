'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X size={32} />
        </button>
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
    </div>
  );
}