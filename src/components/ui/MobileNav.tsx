"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { CONTACT_LINKS } from "@/data/work";
import { lenisRef } from "@/lib/store";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

const SECTIONS = [
  { id: "about", label: "About", n: "01" },
  { id: "skills", label: "Skills", n: "02" },
  { id: "work", label: "Work", n: "03" },
  { id: "contact", label: "Contact", n: "04" },
];

/**
 * Small screens previously had no navigation at all — the marginal index is
 * desktop only. This is the whole route through the site on a phone.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const reduced = useReducedMotionSafe();

  // The bar floats over both chapters. Rather than laying a dark scrim over
  // the light ones — which reads as a muddy band — it senses what is beneath
  // it and inverts.
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("section[id]")];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setOnLight(
              (entry.target as HTMLElement).dataset.chapter === "light",
            );
          }
        }
      },
      // Only the sliver of page directly under the bar counts.
      { rootMargin: "0px 0px -94% 0px", threshold: 0 },
    );
    for (const el of sections) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Lenis keeps scrolling on wheel/touch even with body overflow hidden, so
  // the scroller itself has to be stopped.
  useEffect(() => {
    if (!open) return;
    lenisRef.current?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenisRef.current?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 z-65 h-24 bg-gradient-to-b to-transparent transition-colors duration-500 ${
          onLight ? "from-bone via-bone/80" : "from-ink via-ink/80"
        }`}
      />
      <div className="fixed top-0 right-0 left-0 z-70 flex items-center justify-between px-6 py-5">
        <a
          href="#hero"
          className={`type-mono py-1 transition-colors duration-500 ${
            onLight ? "text-on-bone" : "text-on-ink"
          }`}
        >
          Abilash V
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className={`type-mono flex h-11 items-center gap-3 px-1 transition-colors duration-500 ${
            onLight ? "text-on-bone" : "text-on-ink"
          }`}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden className="flex w-5 flex-col gap-[5px]">
            <motion.span
              className={`block h-px w-full ${open || !onLight ? "bg-brass" : "bg-oxide"}`}
              animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            />
            <motion.span
              className={`block h-px w-full ${open || !onLight ? "bg-brass" : "bg-oxide"}`}
              animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-60 flex flex-col justify-between bg-ink px-6 pt-24 pb-10"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            animate={
              reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }
            }
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduced ? 0.15 : 0.6, ease: [0.83, 0, 0.17, 1] }}
          >
            <nav aria-label="Sections">
              <ul>
                {SECTIONS.map((section, i) => (
                  <li key={section.id} className="rule-t">
                    <motion.a
                      href={`#${section.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-5 py-6"
                      initial={reduced ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduced ? 0 : 0.18 + i * 0.06,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <span className="type-mono text-brass">{section.n}</span>
                      <span className="type-display text-display-m">
                        {section.label}
                      </span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="space-y-3">
              {CONTACT_LINKS.slice(0, 3).map((link) => (
                <li key={link.href} className="flex justify-between gap-4">
                  <span className="type-mono text-mist">{link.label}</span>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-[0.9375rem] text-on-ink"
                  >
                    {link.value}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
