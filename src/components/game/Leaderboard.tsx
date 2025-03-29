// src/components/game/Leaderboard.tsx
'use client';

import { useGame } from '@/components/game/GameContext';

export default function Leaderboard() {
  const { topScores } = useGame();
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time to minutes:seconds.milliseconds
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 100);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="text-center py-4 border-y my-2">
      <h3 className="text-lg font-medium mb-4">Leaderboard</h3>
      {topScores.length > 0 ? (
        <div className="max-h-60 overflow-y-auto scrollbar-thin px-2">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-sm font-medium">#</th>
                <th className="pb-2 text-sm font-medium">Name</th>
                <th className="pb-2 text-sm font-medium">Time</th>
                <th className="pb-2 text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {topScores.map((score, index) => (
                <tr key={score.id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                  <td className="py-1.5 text-sm">{index + 1}</td>
                  <td className="py-1.5 text-sm truncate" title={score.player_name}>{score.player_name}</td>
                  <td className="py-1.5 text-sm font-mono">{formatTime(score.time_survived)}</td>
                  <td className="py-1.5 text-sm">{formatDate(score.date_achieved)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          Loading scores or no scores yet...
        </p>
      )}
    </div>
  );
}