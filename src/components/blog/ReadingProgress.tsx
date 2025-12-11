"use client";

import { useEffect, useRef, useState } from "react";

export default function ReadingProgress() {
  const frame = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = Math.max(window.scrollY, 0);
      const next = scrollable > 0 ? (scrolled / scrollable) * 100 : 0;

      setProgress(next);
      setVisible(scrolled > 12 || next > 0);
    };

    const requestTick = () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
      frame.current = requestAnimationFrame(calculateProgress);
    };

    requestTick();

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);

    return () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div
        className={`w-full transition-all duration-300 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
        }`}
      >
        <div className="h-1 bg-transparent overflow-hidden">
          <div
            className="h-full w-full origin-left bg-neutral-300 transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}
