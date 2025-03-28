// src/components/game/GameCanvas.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useGame } from '@/components/game/GameContext';

export default function GameCanvas() {
  const { 
    gameState, 
    playerCursor, 
    computerCursors, 
    updatePlayerPosition 
  } = useGame();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null); // Ref to store animation frame ID
  const isGameActive = gameState === 'active';

  // Handle mouse movement
  useEffect(() => {
    if (!isGameActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      updatePlayerPosition(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isGameActive, updatePlayerPosition]);

  // Set up canvas and draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    console.log('Canvas setup initialized, game state:', isGameActive);

    // Set canvas size
    const setCanvasSize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        console.log('Canvas resized to:', window.innerWidth, window.innerHeight);
      }
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Draw function
    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player cursor trail and dot
      if (playerCursor) {
        // Draw trail only if there are enough points
        if (playerCursor.trail.length > 1) {
          drawTrail(ctx, playerCursor.trail, playerCursor.color);
        }
        
        // Draw the player cursor point as a circle regardless of trail length
        if (playerCursor.x && playerCursor.y) {
          // Draw a white border around the cursor for better visibility
          ctx.beginPath();
          ctx.arc(playerCursor.x, playerCursor.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
          
          // Draw the player's black cursor
          ctx.beginPath();
          ctx.arc(playerCursor.x, playerCursor.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = playerCursor.color;
          ctx.fill();
        }
      }

      // Draw computer cursor trails
      computerCursors.forEach(cursor => {
        // Only log occasionally to avoid console spam
        if (Math.random() < 0.01) {
          console.log(`Drawing cursor ${cursor.id} at position:`, cursor.x, cursor.y);
        }
        
        if (cursor.trail.length > 1) {
          drawTrail(ctx, cursor.trail, cursor.color);
        }
        
        // Draw the actual cursor point as a circle
        if (cursor.x && cursor.y) {
          // Draw a white border around the cursor for better visibility
          ctx.beginPath();
          ctx.arc(cursor.x, cursor.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
          
          // Draw the colored cursor
          ctx.beginPath();
          ctx.arc(cursor.x, cursor.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = cursor.color;
          ctx.fill();
        }
      });

      // Continue animation ONLY if game is STILL active
      if (gameState === 'active') { // Re-check gameState directly here for safety
        animationFrameRef.current = requestAnimationFrame(draw);
      }
    };

    // Draw a trail with smooth curves
    const drawTrail = (ctx: CanvasRenderingContext2D, trail: {x: number, y: number}[], color: string) => {
      if (trail.length < 2) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      // Draw curves through midpoints for smoother trail
      for (let i = 1; i < trail.length - 1; i++) {
        const xc = (trail[i].x + trail[i + 1].x) / 2;
        const yc = (trail[i].y + trail[i + 1].y) / 2;
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      }

      // Draw to the last point
      if (trail.length > 1) {
        const lastPoint = trail[trail.length - 1];
        ctx.lineTo(lastPoint.x, lastPoint.y);
      }

      ctx.stroke();
    };

    // Start drawing if game is active
    if (isGameActive) {
      // Initial call to start the loop
      animationFrameRef.current = requestAnimationFrame(draw);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      // Cancel the animation frame when the effect cleans up
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null; // Reset the ref
      }
    };
  }, [isGameActive, playerCursor, computerCursors, gameState]);

  if (!isGameActive) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
      
      {/* Debug information - remove in production */}
      <div className="fixed bottom-4 left-4 bg-black/70 text-white text-xs p-2 rounded z-50 font-mono">
        <div>Computer Cursors: {computerCursors.length}</div>
        {computerCursors.map((cursor, i) => (
          <div key={cursor.id}>
            {cursor.id}: x={Math.round(cursor.x)}, y={Math.round(cursor.y)}, trail={cursor.trail.length}
          </div>
        ))}
      </div>
    </>
  );
}