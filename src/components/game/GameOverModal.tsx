// src/components/game/GameOverModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/components/game/GameContext';
import Leaderboard from '@/components/game/Leaderboard';
import ShareButton from '@/components/game/ShareButton';
import { X } from 'lucide-react'; // Import X icon from lucide-react

export default function GameOverModal() {
  const { gameState, survivalTime, resetGame, saveScore, setGameState } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const isOpen = gameState === 'gameOver';
  
  // Format survival time as minutes:seconds.milliseconds
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 100);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };
  
  const handleSaveScore = async () => {
    if (!playerName.trim()) return;
    
    setIsSaving(true);
    
    try {
      await saveScore(playerName);
      setSaved(true);
    } catch (error) {
      console.error('Error saving score:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePlayAgain = () => {
    setPlayerName('');
    setSaved(false);
    resetGame();
  };

  const handleLeave = () => {
    setPlayerName('');
    setSaved(false);
    setGameState('inactive');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50"
            onClick={() => {}} // Prevent clicks from passing through
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="w-full max-w-md bg-card border rounded-lg shadow-lg p-6 relative">
              {saved && (
                <button 
                  onClick={handleLeave}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              )}
              
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-center">Game Over</h2>
                
                <div className="text-center mb-4 py-4">
                  <p className="text-sm text-muted-foreground">Your survival time:</p>
                  <p className="text-3xl font-mono my-2">{formatTime(survivalTime)}</p>
                </div>
                
                {!saved ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="playerName" className="block text-sm font-medium mb-1">
                        Enter your name to save your score:
                      </label>
                      <input
                        type="text"
                        id="playerName"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full p-2 text-sm border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Your name"
                        maxLength={30}
                      />
                    </div>
                    
                    <div className="flex justify-between gap-4 pt-2">
                      <button
                        onClick={handlePlayAgain}
                        className="px-4 py-2 border border-input text-sm rounded-md font-medium hover:bg-accent hover:scale-105 transition-all duration-200"
                      >
                        Play Again
                      </button>
                      <button
                        onClick={handleSaveScore}
                        disabled={isSaving || !playerName.trim()}
                        className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:bg-primary/90 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {isSaving ? 'Saving...' : 'Save Score'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Display the Leaderboard component */}
                    <Leaderboard />

                    {/* Add the ShareButton component here */}
                    <ShareButton 
                      score={formatTime(survivalTime)} 
                      websiteUrl="https://declankramper.com/?utm_source=fusionfrenzytrails" 
                    />
                    
                    <button
                      onClick={handlePlayAgain}
                      className="w-full px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:bg-primary/90 hover:scale-105 transition-all duration-200 flex items-center justify-center"
                    >
                      Play Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}