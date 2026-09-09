"use client";

import { useEffect, type RefObject } from "react";

/**
 * Lenis-driven layer parallax. Reads the element's position once per frame
 * and writes a transform — no scroll listener, no layout thrash beyond the
 * single rect read, and it stays in step with the smooth scroller because it
 * samples the same frame Lenis renders.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  speed = 0.12,
  enabled = true,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let raf = 0;
    let current = 0;

    const loop = () => {
      const rect = el.getBoundingClientRect();
      // Distance of the element's centre from the viewport centre.
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const target = -offset * speed;
      current += (target - current) * 0.1;
      el.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [ref, speed, enabled]);
}
