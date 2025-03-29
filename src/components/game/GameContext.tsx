// src/components/game/GameContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Types
export type GameState = 'inactive' | 'instructions' | 'active' | 'gameOver';
export type Cursor = {
  id: string;
  color: string;
  x: number;
  y: number;
  trail: { x: number; y: number }[];
  speed: number;
  direction: { x: number; y: number };
};

export type Score = {
  id: string;
  player_name: string;
  time_survived: number;
  date_achieved: string;
};

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  startGame: () => void;
  endGame: () => void;
  playerCursor: Cursor | null;
  computerCursors: Cursor[];
  updatePlayerPosition: (x: number, y: number) => void;
  survivalTime: number;
  resetGame: () => void;
  saveScore: (playerName: string) => Promise<void>;
  topScores: Score[];
  fetchTopScores: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Utility function for random movement
const getRandomDirection = () => {
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };
};

// Maximum trail length to prevent performance issues for COMPUTER cursors
const MAX_TRAIL_LENGTH = 100; 
// Interval for shrinking the PLAYER trail (matches CursorTrail.tsx)
const PLAYER_TRAIL_SHRINK_INTERVAL = 35; // ms

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('inactive');
  const [playerCursor, setPlayerCursor] = useState<Cursor | null>(null);
  const [computerCursors, setComputerCursors] = useState<Cursor[]>([]);
  const [survivalTime, setSurvivalTime] = useState<number>(0);
  const [topScores, setTopScores] = useState<Score[]>([]);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const speedIncreaseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerTrailShrinkIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for player trail shrink interval
  const supabaseSubscriptionRef = useRef<any>(null); // For real-time subscription

  // Initialize player cursor
  useEffect(() => {
    if (gameState === 'inactive' || gameState === 'instructions') {
      setPlayerCursor({
        id: 'player',
        color: 'rgba(0, 0, 0, 0.8)',
        x: 0,
        y: 0,
        trail: [],
        speed: 0,
        direction: { x: 0, y: 0 }
      });
    }
  }, [gameState]);

  // Initialize computer cursors when game starts
  const initializeComputerCursors = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    console.log('Initializing computer cursors, screen size:', screenWidth, screenHeight);
    
    // Create 3 computer cursors with different colors
    const cursors: Cursor[] = [
      {
        id: 'computer1',
        color: 'rgba(255, 0, 0, 0.8)', // Red
        x: Math.random() * screenWidth,
        y: Math.random() * screenHeight,
        trail: [],
        speed: 2,
        direction: getRandomDirection()
      },
      {
        id: 'computer2',
        color: 'rgba(0, 0, 255, 0.8)', // Blue
        x: Math.random() * screenWidth,
        y: Math.random() * screenHeight,
        trail: [],
        speed: 2,
        direction: getRandomDirection()
      },
      {
        id: 'computer3',
        color: 'rgba(0, 255, 0, 0.8)', // Green
        x: Math.random() * screenWidth,
        y: Math.random() * screenHeight,
        trail: [],
        speed: 2,
        direction: getRandomDirection()
      }
    ];
    
    console.log('Created computer cursors:', cursors);
    setComputerCursors(cursors);
  };

  // Update player position
  const updatePlayerPosition = (x: number, y: number) => {
    if (playerCursor && gameState === 'active') {
      setPlayerCursor(prev => {
        if (!prev) return null;
        
        // Add current position to trail
        // The shrinking interval will handle removing old points.
        const newTrail = [...prev.trail, { x, y }]; 
        
        // REMOVED: Trail length limit logic is now handled by the shrinking interval
        // if (newTrail.length > MAX_TRAIL_LENGTH) {
        //   newTrail.shift();
        // }
        
        return {
          ...prev,
          x,
          y,
          trail: newTrail
        };
      });
    }
  };

  // Game loop
  const gameLoop = (currentTime: number) => {
    console.log("Game loop start");
    if (gameState !== 'active') {
      console.log("Game loop exit: gameState not active");
      return;
    }
    
    // Calculate time delta for smooth animation
    const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0.016;
    lastTimeRef.current = currentTime;
    
    // Update survival time
    setSurvivalTime(prev => prev + deltaTime);
    
    // Update computer cursors
    console.log("Game loop: Before setComputerCursors");
    setComputerCursors(prev => {
      return prev.map(cursor => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Calculate new position
        let newX = cursor.x + cursor.direction.x * cursor.speed;
        let newY = cursor.y + cursor.direction.y * cursor.speed;
        
        // Log calculation details
        console.log(`Cursor ${cursor.id}: speed=${cursor.speed.toFixed(2)}, dir=(${cursor.direction.x.toFixed(2)}, ${cursor.direction.y.toFixed(2)}), old=(${cursor.x.toFixed(0)}, ${cursor.y.toFixed(0)}), new=(${newX.toFixed(0)}, ${newY.toFixed(0)})`);
        
        // Bounce off walls
        let newDirectionX = cursor.direction.x;
        let newDirectionY = cursor.direction.y;
        
        if (newX < 0 || newX > screenWidth) {
          newDirectionX = -newDirectionX;
          newX = Math.max(0, Math.min(newX, screenWidth));
        }
        
        if (newY < 0 || newY > screenHeight) {
          newDirectionY = -newDirectionY;
          newY = Math.max(0, Math.min(newY, screenHeight));
        }
        
        // Randomly change direction occasionally
        if (Math.random() < 0.01) {
          const newDir = getRandomDirection();
          newDirectionX = newDir.x;
          newDirectionY = newDir.y;
        }
        
        // Update trail
        const newTrail = [...cursor.trail, { x: newX, y: newY }];
        if (newTrail.length > MAX_TRAIL_LENGTH) { // Keep MAX_TRAIL_LENGTH for computer cursors
          newTrail.shift();
        }
        
        return {
          ...cursor,
          x: newX,
          y: newY,
          direction: { x: newDirectionX, y: newDirectionY },
          trail: newTrail
        };
      });
    });
    console.log("Game loop: After setComputerCursors");
    
    // Check for collisions
    console.log("Game loop: Before checkCollisions");
    const collisionDetected = checkCollisions();
    console.log(`Game loop: After checkCollisions (collisionDetected: ${collisionDetected})`);
    if (playerCursor && collisionDetected) {
      console.log("Game loop exit: Collision detected");
      endGame();
      return;
    }
    
    // Continue game loop
    console.log("Game loop: Requesting next frame");
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // Check for collisions between player and computer trails
  const checkCollisions = () => {
    if (!playerCursor) return false;
    
    // Collision detection threshold
    const threshold = 10;
    
    // Check collisions with each computer cursor trail
    for (const computer of computerCursors) {
      for (const point of computer.trail) {
        const distance = Math.sqrt(
          Math.pow(playerCursor.x - point.x, 2) + 
          Math.pow(playerCursor.y - point.y, 2)
        );
        
        if (distance < threshold) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Start game function
  const startGame = () => {
    console.log('Starting game...');
    setGameState('active');
    setSurvivalTime(0);
    initializeComputerCursors();
    lastTimeRef.current = performance.now();
    
    // Increase computer speed every 3.14 seconds
    speedIncreaseIntervalRef.current = setInterval(() => {
      setComputerCursors(prev => {
        console.log('Increasing computer cursor speeds');
        return prev.map(cursor => ({
          ...cursor,
          speed: cursor.speed * 1.1 // Increase speed by 10%
        }));
      });
    }, 3140);
  };

  // End game function
  const endGame = () => {
    setGameState('gameOver');
    
    // Stop game loop and intervals
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    if (speedIncreaseIntervalRef.current) {
      clearInterval(speedIncreaseIntervalRef.current);
      speedIncreaseIntervalRef.current = null;
    }
    // Also stop player trail shrinking interval
    if (playerTrailShrinkIntervalRef.current) {
        clearInterval(playerTrailShrinkIntervalRef.current);
        playerTrailShrinkIntervalRef.current = null;
    }
  };

  // Reset game function
  const resetGame = () => {
    setGameState('instructions');
    setPlayerCursor({
      id: 'player',
      color: 'rgba(0, 0, 0, 0.8)',
      x: 0,
      y: 0,
      trail: [],
      speed: 0,
      direction: { x: 0, y: 0 }
    });
    setComputerCursors([]);
    setSurvivalTime(0);
  };

  // Save score to Supabase
  const saveScore = async (playerName: string) => {
    try {
      const { error } = await supabase
        .from('dk_fusion_frenzy_scores')
        .insert([
          {
            player_name: playerName,
            time_survived: survivalTime,
            date_achieved: new Date().toISOString()
          }
        ]);
      
      if (error) {
        console.error('Error saving score:', error);
      } else {
        // Explicitly fetch scores after saving to ensure the UI updates immediately
        // This handles cases where the real-time subscription might be delayed
        await fetchTopScores();
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  // Fetch top scores from Supabase - used for initial load and as a fallback
  const fetchTopScores = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('dk_fusion_frenzy_scores')
        .select('*')
        .order('time_survived', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching scores:', error);
      } else {
        setTopScores(data || []);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  }, []);

  // Set up real-time subscription for scores
  useEffect(() => {
    // Fetch initial scores
    fetchTopScores();
    
    // Set up real-time subscription to the scores table
    const setupSubscription = async () => {
      // Clean up any existing subscription
      if (supabaseSubscriptionRef.current) {
        supabaseSubscriptionRef.current.unsubscribe();
      }
      
      // Create new subscription
      supabaseSubscriptionRef.current = supabase
        .channel('dk_fusion_frenzy_scores_channel')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'dk_fusion_frenzy_scores' 
          }, 
          (payload) => {
            // When any change happens to the scores table, fetch the latest scores
            console.log('Received real-time update:', payload.eventType, payload);
            fetchTopScores();
          }
        )
        .subscribe((status) => {
          console.log('Supabase subscription status:', status);
        });
      
      console.log('Supabase real-time subscription initialized');
    };
    
    setupSubscription();
    
    // Cleanup subscription on unmount
    return () => {
      if (supabaseSubscriptionRef.current) {
        console.log('Cleaning up Supabase subscription');
        supabaseSubscriptionRef.current.unsubscribe();
      }
    };
  }, [fetchTopScores]);

  // Effect to start/stop the game loop based on gameState
  useEffect(() => {
    if (gameState === 'active' && !gameLoopRef.current) {
      console.log("useEffect: Starting game loop because gameState is active.");
      // Ensure lastTimeRef is set before starting the first frame
      lastTimeRef.current = performance.now(); 
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameState !== 'active' && gameLoopRef.current) {
      console.log("useEffect: Stopping game loop because gameState is no longer active.");
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    // Cleanup function for unmounting
    return () => {
      if (gameLoopRef.current) {
        console.log("useEffect cleanup: Stopping game loop on unmount.");
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, gameLoop]); // Depend on gameState and gameLoop

  // Effect to manage the player trail shrinking interval
  useEffect(() => {
    if (gameState === 'active') {
      // Start shrinking interval if not already running
      if (!playerTrailShrinkIntervalRef.current) {
          playerTrailShrinkIntervalRef.current = setInterval(() => {
          setPlayerCursor(prev => {
            if (!prev || prev.trail.length === 0) {
              return prev; // No cursor or no trail to shrink
            }
            // Remove points based on current trail length: remove ~10%, minimum 1
            const pointsToRemove = Math.max(1, Math.floor(prev.trail.length * 0.1));
            const newTrail = prev.trail.slice(pointsToRemove); 
            return {
              ...prev,
              trail: newTrail
            };
          });
        }, PLAYER_TRAIL_SHRINK_INTERVAL);
      }
    } else {
      // Clear interval if game is not active and interval exists
      if (playerTrailShrinkIntervalRef.current) {
        clearInterval(playerTrailShrinkIntervalRef.current);
        playerTrailShrinkIntervalRef.current = null;
      }
    }

    // Cleanup function for unmounting or gameState change
    return () => {
      if (playerTrailShrinkIntervalRef.current) {
        clearInterval(playerTrailShrinkIntervalRef.current);
        playerTrailShrinkIntervalRef.current = null;
      }
    };
  }, [gameState]); // Depend only on gameState

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        startGame,
        endGame,
        playerCursor,
        computerCursors,
        updatePlayerPosition,
        survivalTime,
        resetGame,
        saveScore,
        topScores,
        fetchTopScores
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};