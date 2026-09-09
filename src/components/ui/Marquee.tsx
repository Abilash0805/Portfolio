"use client";

import { useEffect, useRef } from "react";

import { flux } from "@/lib/store";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * A band that runs on its own but takes its speed and direction from the
 * scroll: flick down and it accelerates, scroll back up and it reverses.
 * Items are separated by hairlines rather than glyphs, so it stays part of
 * the drawing.
 */
export function Marquee({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced) return;
    let x = 0;
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const direction = flux.velocity >= 0 ? 1 : -1;
      const speed = 34 + Math.abs(flux.velocity) * 420;
      x -= speed * dt * direction;

      // The track holds two copies; wrap on the width of one.
      const half = track.current ? track.current.scrollWidth / 2 : 1;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      if (track.current) {
        track.current.style.transform = `translate3d(${x}px, 0, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const run = (copy: number) =>
    items.map((item) => (
      <span key={`${copy}-${item}`} className="flex shrink-0 items-center">
        <span className="type-display px-8 text-[clamp(1.5rem,3.4vw,2.75rem)] whitespace-nowrap text-fg/80 md:px-12">
          {item}
        </span>
        <span aria-hidden className="h-8 w-px shrink-0 bg-glow/60" />
      </span>
    ));

  return (
    <div
      className="rule-t rule-b relative z-10 overflow-hidden py-7 md:py-9"
      // The band is a decorative restatement of the skills list above it.
      aria-hidden
    >
      <div ref={track} className="flex w-max will-change-transform">
        {run(0)}
        {run(1)}
      </div>
    </div>
  );
}
