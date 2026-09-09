"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { PROJECTS } from "@/data/work";
import { useUI } from "@/lib/store";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * Progress is real: it tracks font readiness and the actual project textures
 * decoding. It is not a timed bar pretending to measure something.
 */
export function Preloader() {
  const enter = useUI((s) => s.enter);
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotionSafe();
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    const sources = PROJECTS.map((p) => p.image);
    const total = sources.length + 1; // textures + the font set
    let loaded = 0;
    let cancelled = false;

    const bump = () => {
      if (cancelled) return;
      loaded += 1;
      setProgress(Math.min(1, loaded / total));
    };

    document.fonts?.ready.then(bump).catch(bump);
    for (const src of sources) {
      const img = new window.Image();
      img.onload = bump;
      img.onerror = bump; // a missing texture must not wedge the door shut
      img.src = src;
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Ease the displayed number toward the real one so it counts rather than jumps.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setShown((s) => {
        const next = s + (progress - s) * 0.12;
        return progress - next < 0.001 ? progress : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  useEffect(() => {
    if (progress < 1) return;
    // A minimum dwell keeps a warm cache from flashing the panel.
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, (reduced ? 200 : 900) - elapsed);
    const t = setTimeout(() => {
      setDone(true);
      enter();
    }, wait);
    return () => clearTimeout(t);
  }, [progress, enter, reduced]);

  const pct = Math.round(shown * 100);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-100 flex flex-col justify-between bg-bg px-6 py-8 md:px-10 md:py-10"
          initial={{ opacity: 1 }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.25 } }
              : {
                  // Wipes up off the hero rather than fading — the panel
                  // behaves like a shutter on the construct behind it.
                  clipPath: "inset(0% 0% 100% 0%)",
                  transition: { duration: 0.95, ease: [0.83, 0, 0.17, 1] },
                }
          }
          style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          role="status"
          aria-live="polite"
          aria-label={`Loading, ${pct} percent`}
        >
          <div className="type-mono text-muted">Abilash V</div>

          <div>
            <div className="flex items-end justify-between gap-6">
              <span className="type-mono text-muted">Assembling</span>
              <span
                className="type-display tabular-nums text-[clamp(3.5rem,12vw,9rem)] leading-none"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(pct).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-6 h-px w-full bg-hairline">
              <motion.div
                className="h-full bg-accent"
                style={{ transformOrigin: "left" }}
                animate={{ scaleX: shown }}
                initial={{ scaleX: 0 }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
