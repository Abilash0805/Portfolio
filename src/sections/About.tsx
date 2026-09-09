"use client";

import { useRef } from "react";

import { GutterIndex, SpecTable } from "@/components/ui/Drawing";
import { RevealText, Rise } from "@/components/ui/RevealText";
import { useChapterRange } from "@/lib/useChapterRange";

export function About() {
  const ref = useRef<HTMLElement>(null);

  // About carries the construct from its core out into the component grid.
  useChapterRange(ref, 0.4, 1, { start: "top 80%", end: "bottom 60%" });

  return (
    <section
      ref={ref}
      id="about"
      data-chapter="light"
      className="chapter-light relative z-10 page-x py-28 md:py-40"
    >
      <div className="drawing-grid mx-auto max-w-[88rem]">
        <GutterIndex n="01" label="About" />

        <div className="md:col-span-7 md:col-start-3">
          <h2 className="type-display text-display-l">
            <RevealText as="span" stagger={0.035}>
              Student, builder, founder. All three are true at the same time.
            </RevealText>
          </h2>
        </div>

        <div className="md:col-span-5 md:col-start-3 md:mt-24">
          <Rise delay={0.1}>
            <SpecTable
              rows={[
                { label: "Currently", value: "Class 12" },
                { label: "Studio", value: "Orixen Digital — founder" },
                { label: "Building", value: "StudyDesk / Study Vault" },
                { label: "Also", value: "Robotics, under competition rules" },
              ]}
            />
          </Rise>
        </div>

        <div className="md:col-span-5 md:col-start-9 md:row-start-2">
          <Rise className="space-y-6 text-[1.0625rem] leading-[1.65] text-on-bone/80">
            <p>
              I&rsquo;m in Class 12. People tend to lead with that, so it can go
              first and get out of the way.
            </p>
            <p>
              The rest: I run{" "}
              <span className="text-oxide">Orixen Digital</span>, a digital
              services studio with actual clients and actual invoices. I&rsquo;m
              building <span className="text-oxide">StudyDesk</span>, the study
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
      </div>
    </section>
  );
}
