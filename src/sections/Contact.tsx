"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Rise } from "@/components/ui/RevealText";
import { SectionHead } from "@/components/ui/SectionHead";
import { CONTACT_LINKS, PHONE_HREF } from "@/data/work";
import { useChapterRange } from "@/lib/useChapterRange";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useChapterRange(ref, 3, 3, { start: "top 80%", end: "bottom bottom" });

  return (
    <section
      ref={ref}
      id="contact"
      className="relative z-10 overflow-hidden page-x py-28 md:py-40"
    >
      {/* The climax: the field is at its brightest here. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(65%_60%_at_50%_100%,color-mix(in_oklab,var(--color-glow)_16%,transparent),transparent_72%)]"
      />

      <div className="relative mx-auto max-w-[80rem]">
        <SectionHead index="04" label="Contact" />

        <div className="mt-12 grid gap-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <h2 className="type-display max-w-[16ch] text-display-l">
              Got something that needs building?
            </h2>
            <Rise delay={0.1}>
              <p className="mt-8 max-w-[44ch] text-lede leading-[1.55] text-muted">
                Client work runs through Orixen Digital — sites, brand, video,
                or the whole set. For anything else, a collaboration, a
                competition build, or a question about how something here was
                made, just say so.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild size="lg" data-magnetic>
                  <a href={PHONE_HREF}>Call me</a>
                </Button>
                <Button asChild size="lg" variant="glass" data-magnetic>
                  <a
                    href="https://instagram.com/orixen_digital.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message the studio
                  </a>
                </Button>
              </div>
            </Rise>
          </div>

          {/* Left half: the construct owns the right, so nothing sits on it. */}
          <ul className="md:col-span-6 md:col-start-1">
            {CONTACT_LINKS.map((link) => (
              <li key={link.href} className="rule-t">
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  data-magnetic
                  className="group flex items-center justify-between gap-6 py-5"
                >
                  <span className="type-mono text-muted">{link.label}</span>
                  <span className="flex items-center gap-2 text-[0.9375rem] text-fg transition-colors duration-300 group-hover:text-signal">
                    {link.value}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rule-t mt-24 flex flex-wrap items-end justify-between gap-4 pt-8 md:mt-32">
          <span className="type-mono text-muted">Abilash V</span>
          <span className="type-mono text-muted">Built from scratch, 2026</span>
        </div>
      </div>
    </section>
  );
}
