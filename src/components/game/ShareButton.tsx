//components/game/ShareButton.tsx
'use client';

import { useState } from 'react';
import { Check, Share } from 'lucide-react'; // Assuming you have lucide-react installed

interface ShareButtonProps {
  score: string;
  websiteUrl: string;
}

export default function ShareButton({ score, websiteUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false); // To prevent double clicks

  const handleShare = async () => {
    if (isSharing) return; // Prevent multiple clicks while processing
    setIsSharing(true);

    const shareText = `My time was ${score}! Can you beat me?`;
    const shareTitle = "DK's Fusion Frenzy Trails Score"; 

    const showCopiedMessage = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    if (navigator.share) {
      try {
        // On most platforms, the text and url parameters are displayed separately
        // with the url typically appearing after the text
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: websiteUrl
        });
      } catch (error) {
        console.error('Error sharing natively:', error);
        // Fallback to clipboard if native share fails (e.g., user cancels)
        try {
          // For clipboard, ensure text comes first, then URL
          await navigator.clipboard.writeText(`${shareText}\n\n${websiteUrl}`);
          showCopiedMessage();
        } catch (clipError) {
          console.error('Failed to copy text after share failed:', clipError);
        }
      }
    } else {
      // Fallback for browsers/devices that don't support navigator.share
      try {
        // For clipboard, ensure text comes first, then URL
        await navigator.clipboard.writeText(`${shareText}\n\n${websiteUrl}`);
        showCopiedMessage();
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }

    setIsSharing(false); // Re-enable button
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing} // Disable button while sharing/copying
      className="w-full px-4 py-2 border-2 border-black text-sm rounded-md font-medium hover:bg-accent hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
    >
      {copied ? (
        <>
          <Check size={16} /> Copied!
        </>
      ) : (
        <>
          <Share size={16} /> Share Score
        </>
      )}
    </button>
  );
}
