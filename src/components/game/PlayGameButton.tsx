// src/components/game/PlayGameButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/components/game/GameContext';

export default function PlayGameButton() {
  const { setGameState } = useGame();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device is mobile based on screen width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Consider devices below 768px as mobile
    };
    
    // Initial check
    checkIfMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkIfMobile);
    
    // Show button after 1 second
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleClick = () => {
    // If on mobile, we still set to 'instructions' state, but MobileMessage will handle it
    setGameState('instructions');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-4 right-4 z-20"
    >
      <button
        onClick={handleClick}
        className="px-3 py-1.5 text-xs bg-primary/90 text-primary-foreground rounded-md hover:bg-primary transition-colors"
      >
        Play Game
      </button>
    </motion.div>
  );
}