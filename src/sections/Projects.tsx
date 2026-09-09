"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import { SpecTable } from "@/components/ui/Drawing";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { Rise } from "@/components/ui/RevealText";
import { SectionHead } from "@/components/ui/SectionHead";
import { PROJECTS } from "@/data/work";
import { useEnv } from "@/lib/useEnv";
import { useChapterRange } from "@/lib/useChapterRange";

// Only fetched when it will actually render, which keeps three.js out of the
// bundle for reduced-motion and low-tier visitors entirely.
const ProjectPreview = dynamic(
  () => import("@/components/canvas/ProjectPreview"),
  { ssr: false },
);

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const env = useEnv();
  const simple = env.tier === "low" || env.reducedMotion !== false;

  useChapterRange(ref, 3, 3, { start: "top 80%", end: "bottom bottom" });

  return (
    <section ref={ref} id="work" className="relative z-10 bg-bg page-x py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="mx-auto max-w-[80rem]">
        <SectionHead index="03" label="Selected work" />

        <h2 className="type-display mt-12 max-w-[18ch] text-display-l">
          Three things I actually run.
        </h2>

        <div className="mt-20 space-y-24 md:mt-28 md:space-y-36">
          {PROJECTS.map((project, i) => (
            <article key={project.id} className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-14 right-0 hidden text-[10rem] leading-none font-semibold tracking-tighter text-transparent select-none lg:block"
                style={{ WebkitTextStroke: "1px var(--color-hairline)" }}
              >
                {project.index}
              </span>

              <div className="grid gap-10 md:grid-cols-12 md:gap-14">
                <div
                  className={`md:col-span-7 ${
                    i % 2 === 1 ? "md:order-2 md:col-start-6" : ""
                  }`}
                >
                  <Rise>
                    <div className="glass overflow-hidden rounded-2xl p-2">
                      <div className="overflow-hidden rounded-xl">
                        {simple ? (
                          <ProjectImage
                            src={project.image}
                            alt={project.alt}
                            priority={i === 0}
                          />
                        ) : (
                          <ProjectPreview src={project.image} alt={project.alt} />
                        )}
                      </div>
                    </div>
                  </Rise>
                </div>

                <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  <div className="flex items-baseline gap-4">
                    <span className="type-mono text-signal">{project.index}</span>
                    <span className="type-mono text-muted">{project.role}</span>
                  </div>

                  <h3 className="type-display mt-5 text-display-m">
                    {project.name}
                  </h3>

                  <p className="mt-6 max-w-[36ch] text-lede leading-[1.45] text-fg">
                    {project.hook}
                  </p>

                  <div className="mt-7 space-y-5 text-[1rem] leading-[1.7] text-muted">
                    {project.body.map((para) => (
                      <p key={para.slice(0, 24)}>{para}</p>
                    ))}
                  </div>

                  <SpecTable className="mt-10" rows={project.specs} />

                  {project.links.length > 0 && (
                    <ul className="mt-8 flex flex-wrap gap-3">
                      {project.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-magnetic
                            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.875rem] text-fg transition-colors duration-300 hover:border-accent-fg/50 hover:text-signal"
                          >
                            {link.label}
                            <ArrowUpRight aria-hidden className="size-4" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
