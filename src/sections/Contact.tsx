"use client";

import { useRef } from "react";

import { GutterIndex } from "@/components/ui/Drawing";
import { RevealText, Rise } from "@/components/ui/RevealText";
import { CONTACT_LINKS, EMAIL } from "@/data/work";
import { useChapterRange } from "@/lib/useChapterRange";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useChapterRange(ref, 3, 3, { start: "top 80%", end: "bottom bottom" });

  const links = EMAIL
    ? [
        ...CONTACT_LINKS,
        { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
      ]
    : CONTACT_LINKS;

  return (
    <section
      ref={ref}
      id="contact"
      className="relative z-10 page-x py-32 md:py-48"
    >
      <div className="drawing-grid mx-auto max-w-[88rem]">
        <GutterIndex n="04" label="Contact" />

        <div className="md:col-span-8 md:col-start-3">
          <h2 className="type-display text-display-l">
            <RevealText as="span" stagger={0.045}>
              Got something that needs building?
            </RevealText>
          </h2>
          <Rise delay={0.15}>
            <p className="mt-8 max-w-[42ch] text-[1.0625rem] leading-[1.65] text-on-ink/72">
              Client work runs through Orixen Digital — sites, brand, video,
              or the whole set. For anything else, a collaboration, a
              competition build, or a question about how something here was
              made, just say so.
            </p>
          </Rise>
        </div>

        <div className="md:col-span-4 md:col-start-3 lg:col-span-4 lg:col-start-9">
          <ul className="mt-16 md:mt-0">
            {links.map((link) => (
              <li key={link.href} className="rule-t">
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  data-magnetic
                  className="group flex items-baseline justify-between gap-6 py-5"
                >
                  <span className="type-mono text-mist">{link.label}</span>
                  <span className="text-[1rem] text-on-ink transition-colors duration-200 group-hover:text-brass">
                    {link.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-32 flex max-w-[88rem] items-end justify-between gap-6 md:mt-48">
        <span className="type-mono text-mist">Abilash V</span>
        <span className="type-mono text-mist">Built from scratch, 2026</span>
      </div>
    </section>
  );
}
