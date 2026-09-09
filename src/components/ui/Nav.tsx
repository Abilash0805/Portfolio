"use client";

import { useEffect, useRef, useState } from "react";

import { flux } from "@/lib/store";

const SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

/**
 * A marginal chapter index down the right edge, doubling as the progress rail.
 * It tracks the sections directly — the store's chapter index counts the 3D
 * construct's formations, which is a different thing entirely.
 */
export function Nav() {
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (bar.current) {
        bar.current.style.transform = `scaleX(${flux.progress})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (index >= 0) setActive(index);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-110 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-on-accent"
      >
        Skip to content
      </a>

      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-glow"
        ref={bar}
        style={{ transform: "scaleX(0)" }}
      />

      <nav
        aria-label="Sections"
        className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 lg:block"
      >
        <ul className="space-y-1">
          {SECTIONS.map((section, i) => (
            <li key={section.id} className="flex items-center justify-end gap-3">
              <span
                className="type-mono text-[0.625rem] text-muted transition-opacity duration-300"
                style={{ opacity: i === active ? 1 : 0 }}
                aria-hidden
              >
                {section.label}
              </span>
              <a
                href={`#${section.id}`}
                aria-current={i === active ? "page" : undefined}
                data-magnetic
                className="flex h-8 w-10 items-center justify-end rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-fg"
              >
                <span
                  aria-hidden
                  className="block h-px bg-current transition-all duration-300"
                  style={{
                    opacity: i === active ? 1 : 0.35,
                    width: i === active ? "2rem" : "1rem",
                    color: i === active
                      ? "var(--color-accent-fg)"
                      : "var(--color-muted)",
                  }}
                />
                <span className="sr-only">{section.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
