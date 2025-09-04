'use client';

import React, { useEffect } from 'react';
import { X, Monitor } from 'lucide-react';
import Link from 'next/link';

interface MobileWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileWarningModal({ isOpen, onClose }: MobileWarningModalProps) {
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg p-6 mx-4 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        <div className="text-center">
          <div className="mb-4">
            <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Desktop Only
            </h3>
            <p className="text-gray-600 text-sm">
              This page is only compatible with desktop devices for the best viewing experience.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Go to Homepage
            </Link>
            <button
              onClick={onClose}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Continue anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}