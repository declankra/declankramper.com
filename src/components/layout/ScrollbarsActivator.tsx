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

    const onScroll = (event: Event) => {
      const target = event.currentTarget as HTMLElement | null;
      if (!target) return;

      target.classList.add("scrolling");

      const previous = timers.get(target);
      if (previous) window.clearTimeout(previous);

      const next = window.setTimeout(() => {
        target.classList.remove("scrolling");
        timers.delete(target);
      }, 700);

      timers.set(target, next);
    };

    nodes.forEach((element) => {
      element.addEventListener("scroll", onScroll, { passive: true });
    });

    return () => {
      nodes.forEach((element) => {
        element.removeEventListener("scroll", onScroll as EventListener);
        const timer = timers.get(element);
        if (timer) window.clearTimeout(timer);
      });
    };
  }, [rootId]);

  return null;
}
