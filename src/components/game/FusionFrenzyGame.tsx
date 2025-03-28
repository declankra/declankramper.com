// src/components/game/FusionFrenzyGame.tsx
'use client';

import { useEffect, useState } from 'react';
import { GameProvider } from '@/components/game/GameContext';
import PlayGameButton from './PlayGameButton';
import GameRulesModal from './GameRulesModal';
import GameCanvas from './GameCanvas';
import GameOverModal from './GameOverModal';
import GameHUD from './GameHUD';
import MobileMessage from './MobileMessage';

export default function FusionFrenzyGame() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if the device is mobile based on screen width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Consider devices below 768px as mobile
    };
    
    // Initial check
    checkIfMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Return null while we're determining the device type
  if (isMobile === null) return null;
  
  return (
    <GameProvider>
      <PlayGameButton />
      {isMobile ? (
        <MobileMessage />
      ) : (
        <>
          <GameRulesModal />
          <GameCanvas />
          <GameHUD />
          <GameOverModal />
        </>
      )}
    </GameProvider>
  );
}