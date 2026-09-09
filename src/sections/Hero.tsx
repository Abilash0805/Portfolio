"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { RevealText } from "@/components/ui/RevealText";
import { useChapterRange } from "@/lib/useChapterRange";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // The hero holds the construct at its core formation and only begins to
  // let go as it scrolls away.
  useChapterRange(ref, 0, 0.4, { start: "top top", end: "bottom top" });

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-svh flex-col justify-between page-x py-8 md:py-10"
    >
      <div className="flex items-start justify-between gap-6">
        <span className="type-mono text-mist">Abilash V</span>
        <span className="type-mono max-w-[18ch] text-right text-mist sm:max-w-none">
          Class 12 / Founder, Orixen Digital
        </span>
      </div>

      <div className="max-w-[52rem]">
        <h1 className="type-display text-display-xl">
          <RevealText as="span" stagger={0.08}>
            Abilash V
          </RevealText>
          <span className="sr-only">
            {" "}
            — developer, designer and founder
          </span>
        </h1>
        <p className="type-display mt-8 max-w-[24ch] text-display-m text-mist">
          <RevealText as="span" delay={0.35} stagger={0.03}>
            Builds the software, the brand, and the board it runs on.
          </RevealText>
        </p>
      </div>

      <div className="flex items-end justify-between gap-6">
        <p className="max-w-[38ch] text-[0.9375rem] leading-relaxed text-on-ink/70">
          Three practices that keep feeding each other: shipping web products,
          designing the brand around them, and building the hardware when the
          job needs a physical answer.
        </p>

        <div className="flex shrink-0 flex-col items-center gap-3">
          <span className="type-mono text-mist">Scroll</span>
          <div className="h-14 w-px overflow-hidden bg-on-ink/15">
            {!reduced && (
              <motion.div
                className="h-1/2 w-full bg-brass"
                animate={{ y: ["-100%", "200%"] }}
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  ease: [0.83, 0, 0.17, 1],
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
