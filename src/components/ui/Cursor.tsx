"use client";

import { useEffect, useRef } from "react";

import { flux } from "@/lib/store";

/**
 * Custom cursor with genuine magnetic pull: the ring is drawn toward the
 * centre of any [data-magnetic] element, and the element itself leans back
 * toward the pointer. Both sides move, which is what sells the magnetism.
 *
 * Never mounted on coarse pointers, and never the only affordance — focus
 * styles carry keyboard users independently.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let rx = px;
    let ry = py;
    let scale = 1;
    let targetScale = 1;
    let magnet: HTMLElement | null = null;
    let raf = 0;

    const releaseMagnet = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
      flux.hovering = false;
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      const target = e.target as HTMLElement | null;
      const next =
        (target?.closest?.("[data-magnetic]") as HTMLElement | null) ?? null;
      if (next !== magnet) {
        if (magnet) magnet.style.transform = "";
        magnet = next;
        flux.hovering = !!next;
        targetScale = next ? 2.3 : 1;
      }
    };

    const onDown = () => (targetScale = magnet ? 1.9 : 0.7);
    const onUp = () => (targetScale = magnet ? 2.3 : 1);
    const onLeave = () => {
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dot.current) dot.current.style.opacity = "1";
      if (ring.current) ring.current.style.opacity = "1";
    };

    const loop = () => {
      let tx = px;
      let ty = py;

      if (magnet) {
        // Reading the rect each frame keeps the pull correct while the page
        // is still scrolling under the pointer.
        const r = magnet.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        tx = cx + (px - cx) * 0.34;
        ty = cy + (py - cy) * 0.34;
        magnet.style.transform = `translate3d(${(px - cx) * 0.16}px, ${
          (py - cy) * 0.22
        }px, 0)`;
      }

      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      scale += (targetScale - scale) * 0.14;

      if (dot.current) {
        dot.current.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      releaseMagnet();
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <div
        ref={ring}
        className="absolute top-0 left-0 h-8 w-8 rounded-full border border-accent-fg/70 transition-opacity duration-300"
      />
      <div
        ref={dot}
        className="absolute top-0 left-0 h-1 w-1 rounded-full bg-accent transition-opacity duration-300"
      />
    </div>
  );
}
