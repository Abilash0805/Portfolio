"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

import { GutterIndex, SpecTable } from "@/components/ui/Drawing";
import { RevealText, Rise } from "@/components/ui/RevealText";
import { PROJECTS } from "@/data/work";
import { useEnv } from "@/lib/useEnv";
import { useChapterRange } from "@/lib/useChapterRange";

const ProjectPreview = dynamic(
  () => import("@/components/canvas/ProjectPreview"),
  { ssr: false },
);

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const env = useEnv();
  // Until the environment resolves, assume the cheap path.
  const simple = env.tier === "low" || env.reducedMotion !== false;

  // Projects holds the construct in its final formation.
  useChapterRange(ref, 3, 3, { start: "top 80%", end: "bottom bottom" });

  return (
    <section
      ref={ref}
      id="work"
      className="chapter-light relative z-10 page-x py-28 md:py-40"
    >
      <div className="drawing-grid mx-auto max-w-[88rem]">
        <GutterIndex n="03" label="Work" />
        <div className="md:col-span-11 md:col-start-3">
          <h2 className="type-display max-w-[16ch] text-display-l">
            <RevealText as="span" stagger={0.04}>
              Three things I actually run.
            </RevealText>
          </h2>
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-[88rem] space-y-28 md:mt-36 md:space-y-44">
        {PROJECTS.map((project, i) => (
          <article key={project.id} className="drawing-grid">
            <div className="md:col-span-1">
              <span className="type-mono text-oxide">{project.index}</span>
            </div>

            <div
              className={`md:sticky md:top-28 md:col-span-6 md:self-start ${
                i % 2 === 1 ? "md:col-start-8 md:row-start-1" : "md:col-start-2"
              }`}
            >
              <Rise>
                <ProjectPreview
                  src={project.image}
                  alt={project.alt}
                  simple={simple}
                />
              </Rise>
            </div>

            <div
              className={`md:col-span-5 ${
                i % 2 === 1 ? "md:col-start-2 md:row-start-1" : "md:col-start-9"
              }`}
            >
              <h3 className="type-display text-display-m">{project.name}</h3>
              <p className="type-mono mt-3 text-oxide">{project.role}</p>

              <p className="mt-8 max-w-[36ch] text-quote leading-[1.35] text-on-bone">
                {project.hook}
              </p>

              <div className="mt-8 space-y-5 text-[1rem] leading-[1.65] text-on-bone/78">
                {project.body.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>

              <SpecTable className="mt-10" rows={project.specs} />

              {project.links.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-magnetic
                        className="type-mono inline-block border-b border-current/30 pb-1 text-oxide transition-colors duration-200 hover:border-current"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
