'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Download, Share } from 'lucide-react';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import { toast } from 'sonner';

export default function ResumePage() {
  const [pdfExists, setPdfExists] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the PDF exists
    fetch('/DeclanKramper_ResumeGeneric.pdf')
      .then(response => {
        setPdfExists(response.ok);
      })
      .catch(() => {
        setPdfExists(false);
      });
  }, []);
  const handleEmailClick = () => {
    window.location.href = 'mailto:declankramper@gmail.com';
  };

  const handleDownload = () => {
    if (pdfExists) {
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'DeclanKramper_Resume.pdf';
      link.click();
      toast.success('Resume download started!');
    } else {
      toast.error('Resume PDF not found. Please add resume.pdf to the public folder.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Declan Kramper - Resume',
          text: 'Check out Declan Kramper\'s resume',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to copying URL
        copyToClipboard();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="pt-8 px-4 max-w-6xl mx-auto">
        <BreadcrumbNav
          items={[
            { href: "/", label: "home" },
            { href: "/resume", label: "resume", current: true }
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Declan Kramper
          </h1>
          
          {/* Contact Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <button
              onClick={handleDownload}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground"
            >
              <Download className="w-3.5 h-3.5" />
              download resume
            </button>

            <button
              onClick={handleEmailClick}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground"
            >
              <Mail className="w-3.5 h-3.5" />
              email me
            </button>
            
            <button
              onClick={handleShare}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground"
            >
              <Share className="w-3.5 h-3.5" />
              share this page
            </button>
          </div>
        </motion.div>

        {/* Resume Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          {/* PDF Preview Container */}
          <div className="w-full rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-[8.5/11] w-full">
                  {pdfExists === true ? (
                    // Show actual PDF with zoom and navigation controls
                    <iframe
                      src="/DeclanKramper_ResumeGeneric.pdf#navpanes=0&zoom=page-width"
                      className="w-full h-full border-0"
                      title="Resume Preview"
                      style={{ minHeight: '1000px' }}
                    />
                  ) : (
                    // Show placeholder
                    <div className="w-full h-full flex items-center justify-center bg-white text-muted-foreground">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium mb-2">Resume Preview</p>
                        <p className="text-xs text-muted-foreground mb-4">
                          {pdfExists === null ? 'Loading...' : 'Add your resume.pdf to the public folder to display it here'}
                        </p>
                        {pdfExists === false && (
                          <button 
                            onClick={handleDownload}
                            className="text-muted-foreground hover:text-foreground transition-colors text-sm underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground"
                          >
                            download pdf
                          </button>
                        )}
                      </div>
                    </div>
                  )}
            </div>
          </div>
        </motion.div>

        {/* Additional Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Want to talk about product, building cool stuff, or just say hi? I'd love to hear from you.
          </p>
          <button 
            onClick={handleEmailClick}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground"
          >
            contact@dkbuilds.co
          </button>
        </motion.div>
      </div>
    </div>
  );
}
