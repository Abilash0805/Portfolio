"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

import { flux, useUI } from "@/lib/store";

/**
 * Lenis drives the scroll; GSAP's ticker drives Lenis; ScrollTrigger updates
 * off Lenis. One clock, so nothing drifts against anything else.
 *
 * The whole journey (hero -> projects) is a single ScrollTrigger. Chapters are
 * points along it rather than separate triggers, which is why the construct
 * morphs continuously instead of popping between states.
 */
export function SmoothScroll({ reducedMotion }: { reducedMotion: boolean }) {
  const setActiveChapter = useUI((s) => s.setActiveChapter);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    let rafId = 0;
    let cleanupTicker = () => {};

    const onScrollNative = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      flux.progress = max > 0 ? window.scrollY / max : 0;
    };

    if (!reducedMotion) {
      lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 1,
        smoothWheel: true,
        // Touch devices already have native inertia; doubling it feels laggy.
        syncTouch: false,
      });

      lenis.on("scroll", (e: { velocity: number }) => {
        ScrollTrigger.update();
        // ~40px/frame is a hard flick; normalise against that.
        flux.velocity = gsap.utils.clamp(-1, 1, e.velocity / 40);
      });

      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // ScrollTrigger must measure after Lenis is in control.
      ScrollTrigger.refresh();

      cleanupTicker = () => gsap.ticker.remove(tick);
    } else {
      window.addEventListener("scroll", onScrollNative, { passive: true });
      onScrollNative();
      cleanupTicker = () =>
        window.removeEventListener("scroll", onScrollNative);
    }

    // --- the journey timeline -------------------------------------------
    const journey = document.querySelector("#journey");
    const trigger = journey
      ? ScrollTrigger.create({
          trigger: journey,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            flux.progress = self.progress;
            setActiveChapter(Math.round(flux.chapter));
          },
        })
      : null;

    // --- pointer + energy decay ------------------------------------------
    const onPointer = (e: PointerEvent) => {
      flux.pointerRaw.x = (e.clientX / window.innerWidth) * 2 - 1;
      flux.pointerRaw.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const loop = () => {
      // Smoothing the pointer here (not in useFrame) means the custom cursor
      // and the 3D read the exact same value.
      flux.pointer.x += (flux.pointerRaw.x - flux.pointer.x) * 0.08;
      flux.pointer.y += (flux.pointerRaw.y - flux.pointer.y) * 0.08;
      flux.velocity *= 0.92;
      flux.energy += (Math.abs(flux.velocity) - flux.energy) * 0.09;
      // Chapter chases its target rather than being written directly, so the
      // construct keeps momentum through a section boundary.
      flux.chapter += (flux.chapterTarget - flux.chapter) * 0.075;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    // Fonts change layout height; re-measure once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointer);
      cleanupTicker();
      trigger?.kill();
      lenis?.destroy();
    };
  }, [reducedMotion, setActiveChapter]);

  return null;
}
