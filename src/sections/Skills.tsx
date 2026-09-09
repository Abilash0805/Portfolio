"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import { GutterIndex } from "@/components/ui/Drawing";
import { SKILLS } from "@/data/work";
import { useUI } from "@/lib/store";
import { useChapterRange } from "@/lib/useChapterRange";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * Pinned with position: sticky rather than a GSAP pin — no pin-spacer to fight
 * with Lenis, and it survives a resize without a refresh.
 *
 * The three categories map onto the construct's three working formations:
 * software -> component grid, hardware -> board traces, creative -> layered
 * planes. The 3D changes character with the reading, which is the point.
 */
export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const setActiveSkill = useUI((s) => s.setActiveSkill);
  const active = useUI((s) => s.activeSkill);
  const reduced = useReducedMotionSafe();

  useChapterRange(ref, 1, 3, {
    start: "top top",
    end: "bottom bottom",
    onProgress: (p) => {
      const index = Math.min(SKILLS.length - 1, Math.floor(p * SKILLS.length));
      setActiveSkill(index);
    },
  });

  const group = SKILLS[active] ?? SKILLS[0];

  return (
    <section ref={ref} id="skills" className="relative z-10">
      <div className="h-[300vh]">
        <div className="sticky top-0 flex h-svh items-center overflow-hidden page-x">
          {/* Scrim: the copy sits on both sides of the construct here, so it
              needs a full-bleed veil, not a one-sided gradient. The construct
              still reads through it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-ink/78"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-transparent to-ink/90"
          />

          <div className="drawing-grid relative mx-auto w-full max-w-[88rem]">
            <GutterIndex n="02" label="Skills" />

            <div className="md:col-span-5 md:col-start-3">
              <ul className="space-y-0">
                {SKILLS.map((s, i) => (
                  <li key={s.id} className="rule-t">
                    <button
                      type="button"
                      onClick={() => setActiveSkill(i)}
                      aria-current={i === active}
                      className="flex w-full items-baseline gap-5 py-5 text-left transition-opacity duration-300 md:py-7"
                      style={{ opacity: i === active ? 1 : 0.34 }}
                    >
                      <span
                        className="type-mono shrink-0"
                        style={{ color: i === active ? "var(--color-brass)" : "inherit" }}
                      >
                        {s.index}
                      </span>
                      <span className="type-display text-display-m">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-5 md:col-start-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={group.id}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="max-w-[34ch] text-[1.0625rem] leading-[1.6] text-on-ink/75">
                    {group.line}
                  </p>
                  <ul className="mt-9 grid grid-cols-2 gap-x-8">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rule-t py-3 text-[0.9375rem] text-on-ink/85"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
