"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHead } from "@/components/ui/SectionHead";
import { SKILLS } from "@/data/work";
import { useUI } from "@/lib/store";
import { useChapterRange } from "@/lib/useChapterRange";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * Two presentations, chosen in CSS so there is no hydration branch.
 *
 * Desktop pins the panel and swaps one category at a time, which is what
 * drives the construct through its three working formations. A phone gets an
 * accordion instead — 300vh of pinned scroll to read nine words is hostile.
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
      setActiveSkill(Math.min(SKILLS.length - 1, Math.floor(p * SKILLS.length)));
    },
  });

  const group = SKILLS[active] ?? SKILLS[0];

  return (
    <section ref={ref} id="skills" className="relative z-10">
      {/* ---- phones: an accordion, nothing pinned ---- */}
      <div className="relative page-x py-24 md:hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-bg/85" />
        <div className="relative mx-auto max-w-[80rem]">
          <SectionHead index="02" label="Skills" />
          <h2 className="type-display mt-8 text-display-m">
            Three practices, one workflow.
          </h2>
          <Accordion type="single" collapsible defaultValue={SKILLS[0].id} className="mt-6">
            {SKILLS.map((s) => (
              <AccordionItem key={s.id} value={s.id}>
                <AccordionTrigger>
                  <span className="flex items-baseline gap-4">
                    <span className="type-mono text-signal">{s.index}</span>
                    <span className="type-display text-[1.5rem]">{s.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-[0.9375rem] leading-[1.65] text-muted">
                    {s.line}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {s.items.map((item) => (
                      <li
                        key={item}
                        className="glass rounded-full px-3.5 py-1.5 text-[0.8125rem] text-fg/85"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* ---- md and up: pinned, one category at a time ---- */}
      <div className="hidden md:block md:h-[300vh]">
        <div className="sticky top-0 flex h-svh items-center overflow-hidden page-x">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-bg/72" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_60%_at_75%_50%,color-mix(in_oklab,var(--color-glow)_9%,transparent),transparent_70%)]"
          />

          <div className="relative mx-auto w-full max-w-[80rem]">
            <SectionHead index="02" label="Skills" />
            <h2 className="type-display mt-8 max-w-[20ch] text-display-m">
              Three practices, one workflow.
            </h2>

            <div className="mt-12 grid gap-16 md:grid-cols-12">
              <ul className="md:col-span-6">
                {SKILLS.map((s, i) => (
                  <li key={s.id} className="rule-t">
                    <button
                      type="button"
                      onClick={() => setActiveSkill(i)}
                      aria-current={i === active}
                      className="flex w-full items-baseline gap-5 py-7 text-left transition-opacity duration-300"
                      style={{ opacity: i === active ? 1 : 0.32 }}
                    >
                      <span
                        className="type-mono shrink-0"
                        style={{
                          color: i === active
                            ? "var(--color-accent-fg)"
                            : "inherit",
                        }}
                      >
                        {s.index}
                      </span>
                      <span className="type-display text-display-m">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="md:col-span-5 md:col-start-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={group.id}
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="max-w-[34ch] text-[1.0625rem] leading-[1.65] text-muted">
                      {group.line}
                    </p>
                    <ul className="mt-9 flex flex-wrap gap-2.5">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="glass rounded-full px-4 py-2 text-[0.875rem] text-fg/85"
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
      </div>
    </section>
  );
}
