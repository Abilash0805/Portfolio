"use client";

import { useRef } from "react";

import { SectionHead } from "@/components/ui/SectionHead";
import { Rise } from "@/components/ui/RevealText";
import { useChapterRange } from "@/lib/useChapterRange";

const FACTS = [
  { value: "9", label: "Services running through Orixen Digital" },
  { value: "3", label: "Boards I build on: Arduino, ESP32, NodeMCU" },
  { value: "12", label: "The class I am currently in" },
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  useChapterRange(ref, 0.4, 1, { start: "top 80%", end: "bottom 60%" });

  return (
    <section
      ref={ref}
      id="about"
      className="relative z-10 bg-bg page-x py-28 md:py-40"
    >
      {/* Fades the field out rather than cutting it off at a hard edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="mx-auto max-w-[80rem]">
        <SectionHead index="01" label="About" />

        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-16">
          <h2 className="type-display text-display-l md:col-span-7">
            Student, builder, founder. All three are true at the same time.
          </h2>

          <Rise className="space-y-6 text-[1.0625rem] leading-[1.7] text-muted md:col-span-5">
            <p>
              I&rsquo;m in Class 12. People tend to lead with that, so it can go
              first and get out of the way.
            </p>
            <p>
              The rest: I run{" "}
              <span className="text-signal">Orixen Digital</span>, a digital
              services studio with actual clients and actual invoices. I&rsquo;m
              building <span className="text-signal">StudyDesk</span>, the study
              dashboard I wanted to exist while I was revising. And I build
              robots — usually against a clock, in a room, with judges waiting.
            </p>
            <p>
              None of it is coursework. Software taught me structure. Hardware
              taught me that a plan is only a theory until it survives contact
              with the floor. Design taught me that neither one counts for much
              if the result looks like nobody cared.
            </p>
          </Rise>
        </div>

        <ul className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-3">
          {FACTS.map((fact) => (
            <li key={fact.label} className="bg-bg p-8">
              <div className="type-display text-[3.25rem] leading-none text-signal">
                {fact.value}
              </div>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                {fact.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
