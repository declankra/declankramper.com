// src/components/game/GameHUD.tsx
'use client';

import { useGame } from '@/components/game/GameContext';
import { X } from 'lucide-react';

export default function GameHUD() {
  const { gameState, survivalTime, endGame } = useGame();
  
  // Only show when game is active
  if (gameState !== 'active') return null;
  
  // Format time display (minutes:seconds)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
      <div className="bg-card/80 backdrop-blur-sm rounded-full px-4 py-1 shadow-md border flex items-center gap-2">
        <div className="font-mono text-sm">
          {formatTime(survivalTime)}
        </div>
        
        <button
          onClick={() => endGame()}
          className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30"
          title="End Game"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}