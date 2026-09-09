"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

import { flux, lenisRef, useUI } from "@/lib/store";

/**
 * Lenis is the spine of this site.
 *
 * It owns the scroll position, drives GSAP's ticker, feeds ScrollTrigger,
 * handles every in-page anchor with its own easing, and publishes velocity to
 * both the 3D layer and CSS. One scroller, one clock — nothing drifts against
 * anything else.
 */
export function ScrollProvider({ reducedMotion }: { reducedMotion: boolean }) {
  const setActiveChapter = useUI((s) => s.setActiveChapter);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    let rafId = 0;
    let cleanupTicker = () => {};
    let lastCharge = -1;

    const onScrollNative = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      flux.progress = max > 0 ? window.scrollY / max : 0;
    };

    if (!reducedMotion) {
      lenis = new Lenis({
        // Low lerp = long glide. This is the single value that most decides
        // whether the site feels expensive or cheap.
        lerp: 0.075,
        wheelMultiplier: 1,
        smoothWheel: true,
        // Touch devices have their own inertia; doubling it feels laggy.
        syncTouch: false,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", (e: { velocity: number; progress: number }) => {
        ScrollTrigger.update();
        // ~40px/frame is a hard flick; normalise against that.
        flux.velocity = gsap.utils.clamp(-1, 1, e.velocity / 40);
      });

      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();

      cleanupTicker = () => gsap.ticker.remove(tick);
    } else {
      window.addEventListener("scroll", onScrollNative, { passive: true });
      onScrollNative();
      cleanupTicker = () =>
        window.removeEventListener("scroll", onScrollNative);
    }

    // --- every in-page anchor goes through Lenis ------------------------
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, {
          offset: -8,
          duration: 1.5,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        (target as HTMLElement).scrollIntoView();
      }
      // Keyboard users must land on the section, not just see it move.
      (target as HTMLElement).setAttribute("tabindex", "-1");
      (target as HTMLElement).focus({ preventScroll: true });
    };
    document.addEventListener("click", onAnchorClick);

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
      flux.pointer.x += (flux.pointerRaw.x - flux.pointer.x) * 0.08;
      flux.pointer.y += (flux.pointerRaw.y - flux.pointer.y) * 0.08;
      flux.velocity *= 0.92;
      flux.energy += (Math.abs(flux.velocity) - flux.energy) * 0.09;
      flux.chapter += (flux.chapterTarget - flux.chapter) * 0.075;

      // Publish to CSS, but only when it actually changes — this var is read
      // by every hairline on the page.
      const charge = Math.round(flux.energy * 50) / 50;
      if (charge !== lastCharge) {
        lastCharge = charge;
        document.documentElement.style.setProperty("--charge", String(charge));
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("click", onAnchorClick);
      cleanupTicker();
      trigger?.kill();
      lenisRef.current = null;
      lenis?.destroy();
    };
  }, [reducedMotion, setActiveChapter]);

  return null;
}
