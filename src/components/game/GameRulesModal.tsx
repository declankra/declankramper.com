// src/components/game/GameRulesModal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/components/game/GameContext';
import { useState, useEffect } from 'react';
import Leaderboard from './Leaderboard';

export default function GameRulesModal() {
  const { gameState, startGame, topScores, setGameState } = useGame();
  const isOpen = gameState === 'instructions';
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // Format time to minutes:seconds.milliseconds
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 100);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };
  
  // Get top player info
  const topPlayer = topScores.length > 0 ? topScores[0] : null;

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
            <div className="w-full max-w-md bg-gradient-to-br from-card to-card/90 border rounded-xl shadow-xl p-8 relative">
              {/* Exit Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setGameState('inactive')}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10 p-1 rounded-full hover:bg-muted/50"
                aria-label="Close rules"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <div className="space-y-6">
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-center"
                >
                  {showLeaderboard ? "Leaderboard" : "Welcome to Fusion Frenzy Trail!"}
                </motion.h2>
                
                {!showLeaderboard ? (
                  <div className="space-y-5">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm text-muted-foreground text-center"
                    >
                      Test your reaction skills in this challenging cursor game and see how your score compares to other players.
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-base font-medium mb-3">Rules:</h3>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        <li>Move your cursor to avoid running into the colored trails</li>
                        <li>You must keep moving at all times</li>
                        <li>Colored trails increase speed by 20% every pi seconds</li>
                        <li>The game ends if your pointer hits any trail or if your trail disappears completely</li>
                      </ul>
                    </motion.div>

                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm font-medium text-muted-foreground text-center italic"
                    >
                      Try to survive as long as possible!
                    </motion.p>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-col items-center gap-4 mt-8"
                    >
                      <button
                        onClick={startGame}
                        className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 motion-safe:hover:scale-105 transition-[transform,background-color,color,border-color,box-shadow] duration-200 shadow-md"
                      >
                        Start Game
                      </button>
                      
                      <button
                        onClick={() => setShowLeaderboard(true)}
                        className="text-sm text-primary hover:text-primary/90 transition-colors underline"
                      >
                        {topPlayer ? 
                          <span className="font-medium">{topPlayer.player_name} has current high score of {formatTime(topPlayer.time_survived)}!</span> :
                          "See Leaderboard"
                        }
                      </button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <Leaderboard />
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-center mt-4"
                    >
                      <button
                        onClick={() => setShowLeaderboard(false)}
                        className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/90 transition-[background-color,color,border-color,box-shadow] duration-200"
                      >
                        Back to Rules
                      </button>
                    </motion.div>
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
