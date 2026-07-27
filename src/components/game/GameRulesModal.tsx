// src/components/game/GameRulesModal.tsx
'use client';

import { useGame } from '@/components/game/GameContext';
import { useState } from 'react';
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

  if (!isOpen) return null;

  // No entrance animation: the modal is seen every time the game opens, so it
  // simply appears — animation would only slow the repeat path down.
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 opacity-70"
        onClick={() => {}} // Prevent clicks from passing through
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-gradient-to-br from-card to-card/90 border rounded-xl shadow-xl p-8 relative">
          {/* Exit Button */}
          <button
            onClick={() => setGameState('inactive')}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10 p-1 rounded-full hover:bg-muted/50"
            aria-label="Close rules"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">
              {showLeaderboard ? "Leaderboard" : "Welcome to Fusion Frenzy Trail!"}
            </h2>

            {!showLeaderboard ? (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground text-center">
                  Test your reaction skills in this challenging cursor game and see how your score compares to other players.
                </p>

                <div>
                  <h3 className="text-base font-medium mb-3">Rules:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Move your cursor to avoid running into the colored trails</li>
                    <li>You must keep moving at all times</li>
                    <li>Colored trails increase speed by 20% every pi seconds</li>
                    <li>The game ends if your pointer hits any trail or if your trail disappears completely</li>
                  </ul>
                </div>

                <p className="text-sm font-medium text-muted-foreground text-center italic">
                  Try to survive as long as possible!
                </p>

                <div className="flex flex-col items-center gap-4 mt-8">
                  <button
                    onClick={startGame}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 active:scale-[0.97] transition-[transform,background-color,color,border-color,box-shadow] duration-200 shadow-md"
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
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <Leaderboard />

                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/90 transition-[background-color,color,border-color,box-shadow] duration-200"
                  >
                    Back to Rules
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
