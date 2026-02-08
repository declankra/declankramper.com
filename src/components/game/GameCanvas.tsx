// src/components/game/GameCanvas.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useGame } from '@/components/game/GameContext';

type TrailPoint = { x: number; y: number };

function drawTrail(ctx: CanvasRenderingContext2D, trail: TrailPoint[], color: string) {
  if (trail.length < 2) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y);

  for (let i = 1; i < trail.length - 1; i++) {
    const xc = (trail[i].x + trail[i + 1].x) / 2;
    const yc = (trail[i].y + trail[i + 1].y) / 2;
    ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
  }

  const lastPoint = trail[trail.length - 1];
  ctx.lineTo(lastPoint.x, lastPoint.y);
  ctx.stroke();
}

export default function GameCanvas() {
  const { gameState, playerCursor, computerCursors, updatePlayerPosition } = useGame();
  const isGameActive = gameState === 'active';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playerCursorRef = useRef(playerCursor);
  const computerCursorsRef = useRef(computerCursors);
  const isGameActiveRef = useRef(isGameActive);

  useEffect(() => {
    playerCursorRef.current = playerCursor;
  }, [playerCursor]);

  useEffect(() => {
    computerCursorsRef.current = computerCursors;
  }, [computerCursors]);

  useEffect(() => {
    isGameActiveRef.current = isGameActive;
  }, [isGameActive]);

  useEffect(() => {
    if (!isGameActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      updatePlayerPosition(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isGameActive, updatePlayerPosition]);

  useEffect(() => {
    if (!isGameActive) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const setCanvasSize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    const draw = () => {
      if (!isGameActiveRef.current) return;

      const currentCanvas = canvasRef.current;
      const ctx = currentCanvas?.getContext('2d');
      if (!currentCanvas || !ctx) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);

      const currentPlayer = playerCursorRef.current;
      if (currentPlayer) {
        if (currentPlayer.trail.length > 1) {
          drawTrail(ctx, currentPlayer.trail, currentPlayer.color);
        }

        if (currentPlayer.x && currentPlayer.y) {
          ctx.beginPath();
          ctx.arc(currentPlayer.x, currentPlayer.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(currentPlayer.x, currentPlayer.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = currentPlayer.color;
          ctx.fill();
        }
      }

      computerCursorsRef.current.forEach((cursor) => {
        if (cursor.trail.length > 1) {
          drawTrail(ctx, cursor.trail, cursor.color);
        }

        if (cursor.x && cursor.y) {
          ctx.beginPath();
          ctx.arc(cursor.x, cursor.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(cursor.x, cursor.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = cursor.color;
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize, { passive: true });
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isGameActive]);

  if (!isGameActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}
