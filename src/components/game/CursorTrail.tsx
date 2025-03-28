// src/components/game/CursorTrail.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

const MAX_POINTS = 30; // Adjust for longer/shorter trail
const LINE_WIDTH = 2; // Adjust for thinner/thicker trail
const GLOW_BLUR = 20; // Adjust for more/less glow
const GLOW_COLOR = 'rgba(0, 0, 0, 0.8)'; // Black glow
const SHRINK_INTERVAL = 35; // ms between removing points (adjust for shrink speed)

const CursorTrail: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const shrinkIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for the continuous shrink interval

  // Mouse move handler - Adds points to the end
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Add new point, respecting MAX_POINTS
    setPoints((prevPoints) =>
      [...prevPoints, { x: e.clientX, y: e.clientY }].slice(-MAX_POINTS)
    );
  }, []); // No longer depends on isIdle

  // Drawing logic (with smoothing)
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      animationFrameId.current = requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length >= 3) { // Need at least 3 points for quadratic curve approach
      ctx.strokeStyle = 'black';
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = GLOW_COLOR;
      ctx.shadowBlur = GLOW_BLUR;

      ctx.beginPath();
      // Start at the first point
      ctx.moveTo(points[0].x, points[0].y);

      // Draw curves through midpoints
      for (let i = 1; i < points.length - 1; i++) {
        // Calculate midpoint between point i and i+1
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;

        // Draw quadratic curve from previous point to midpoint, using current point as control
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }

      // Optional: Draw a line to the last point to ensure the trail reaches the cursor
      // If you want the curve to end smoothly before the very last point, comment this out.
      // ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

      ctx.stroke();
    }

    animationFrameId.current = requestAnimationFrame(draw);

  }, [points]);

  // Effect for continuous shrinking
  useEffect(() => {
    shrinkIntervalRef.current = setInterval(() => {
      setPoints(prevPoints => {
        if (prevPoints.length === 0) {
          return []; // Nothing to shrink
        }
        return prevPoints.slice(1); // Remove the oldest point
      });
    }, SHRINK_INTERVAL);

    // Cleanup: Clear interval when component unmounts
    return () => {
      if (shrinkIntervalRef.current) {
        clearInterval(shrinkIntervalRef.current);
      }
    };
  }, []); // Run only once on mount

  // Setup canvas, main animation loop, and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    const setCanvasSize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };

    setCanvasSize(); // Initial size
    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('mousemove', handleMouseMove);

    // Start drawing loop
    if (!animationFrameId.current) { // Start loop only once
        animationFrameId.current = requestAnimationFrame(draw);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = undefined; // Reset ref
      }
    };
  }, [draw, handleMouseMove]); // Dependencies remain draw and handleMouseMove

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none', // Allow clicks to pass through
        zIndex: 9999, // Keep on top
      }}
    />
  );
};

export default CursorTrail; 