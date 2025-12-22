// src/components/game/FusionFrenzyGameContent.tsx
// Game content without the provider - used when GameProvider is higher in the tree
'use client';

import { useEffect, useState } from 'react';
import GameRulesModal from './GameRulesModal';
import GameCanvas from './GameCanvas';
import GameOverModal from './GameOverModal';
import GameHUD from './GameHUD';
import MobileMessage from './MobileMessage';

export default function FusionFrenzyGameContent() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the device is mobile based on screen width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
    <>
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
    </>
  );
}
