"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RevealText } from "@/components/ui/RevealText";
import { useChapterRange } from "@/lib/useChapterRange";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();

  useChapterRange(ref, 0, 0.4, { start: "top top", end: "bottom top" });

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-svh flex-col justify-end page-x pt-28 pb-10 md:justify-center md:pb-24"
    >
      {/* The field is brightest where the story starts. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_50%_at_50%_10%,color-mix(in_oklab,var(--color-glow)_11%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-bg via-bg/92 to-transparent md:hidden"
      />

      <div className="relative mx-auto w-full max-w-[80rem]">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent">
            <span aria-hidden className="size-1.5 rounded-full bg-current" />
            Available for work
          </Badge>
          <Badge>Class 12</Badge>
          <Badge>Founder, Orixen Digital</Badge>
        </div>

        <h1 className="type-display mt-9 text-display-xl">
          <RevealText as="span" stagger={0.08}>
            Abilash V
          </RevealText>
          <span className="sr-only"> — developer, designer and founder</span>
        </h1>

        <p className="mt-8 max-w-[46ch] text-lede leading-[1.55] text-muted">
          I build the software, design the brand around it, and solder the board
          it runs on. Three practices that keep feeding each other — currently
          in Class 12, currently taking clients.
        </p>

        <div className="mt-11 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" data-magnetic>
            <a href="#work">See the work</a>
          </Button>
          <Button asChild size="lg" variant="glass" data-magnetic>
            <a href="#contact">Start a project</a>
          </Button>
        </div>
      </div>

      <div className="relative mx-auto mt-16 hidden w-full max-w-[80rem] items-end justify-between gap-6 md:flex">
        <span className="type-mono text-muted">Scroll to explore</span>
        <div className="h-14 w-px overflow-hidden bg-hairline">
          {!reduced && (
            <motion.div
              className="h-1/2 w-full bg-glow"
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
    </section>
  );
}
