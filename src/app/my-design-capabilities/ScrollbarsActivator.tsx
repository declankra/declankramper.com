"use client";

import { useEffect } from "react";

type Props = {
  rootId: string;
};

export default function ScrollbarsActivator({ rootId }: Props) {
  useEffect(() => {
    const root = document.getElementById(rootId) ?? document;
    const selectors = [".media-row", ".media-section"].join(",");
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(selectors));

    const timers = new WeakMap<EventTarget, number>();

    const onScroll = (e: Event) => {
      const target = e.currentTarget as HTMLElement | null;
      if (!target) return;
      target.classList.add("scrolling");
      const prev = timers.get(target);
      if (prev) window.clearTimeout(prev);
      const t = window.setTimeout(() => {
        target.classList.remove("scrolling");
        timers.delete(target);
      }, 700);
      timers.set(target, t);
    };

    nodes.forEach((el) => {
      el.addEventListener("scroll", onScroll, { passive: true });
    });

    return () => {
      nodes.forEach((el) => {
        el.removeEventListener("scroll", onScroll as EventListener);
        const t = timers.get(el);
        if (t) window.clearTimeout(t);
      });
    };
  }, [rootId]);

  return null;
}

