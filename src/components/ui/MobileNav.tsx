"use client";

import { ArrowUpRight, MenuIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CONTACT_LINKS } from "@/data/work";
import { lenisRef } from "@/lib/store";

const SECTIONS = [
  { id: "about", label: "About", n: "01" },
  { id: "skills", label: "Skills", n: "02" },
  { id: "work", label: "Work", n: "03" },
  { id: "contact", label: "Contact", n: "04" },
];

/**
 * The whole route through the site on a phone. Radix handles the focus trap
 * and escape; Lenis has to be stopped separately, because hiding body overflow
 * does not stop a wheel-driven smooth scroller.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    lenisRef.current?.stop();
    return () => lenisRef.current?.start();
  }, [open]);

  return (
    <div className="lg:hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-65 h-24 bg-gradient-to-b from-bg via-bg/85 to-transparent"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="fixed inset-x-0 top-0 z-70 flex items-center justify-between px-5 py-4">
          <a href="#hero" className="type-mono text-fg">
            Abilash V
          </a>
          <DialogTrigger asChild>
            <button
              type="button"
              className="glass flex h-11 items-center gap-2.5 rounded-full px-4 text-fg"
            >
              <span className="type-mono">Menu</span>
              <MenuIcon aria-hidden className="size-4 text-signal" />
            </button>
          </DialogTrigger>
        </div>

        <DialogContent className="px-5 pt-4 pb-10">
          <DialogTitle className="sr-only">Site navigation</DialogTitle>
          <DialogDescription className="sr-only">
            Jump to a section, or contact Abilash directly.
          </DialogDescription>

          <div className="flex items-center justify-between py-1">
            <span className="type-mono text-fg">Abilash V</span>
            <DialogClose asChild>
              <button
                type="button"
                className="glass flex h-11 items-center gap-2.5 rounded-full px-4 text-fg"
              >
                <span className="type-mono">Close</span>
                <XIcon aria-hidden className="size-4 text-signal" />
              </button>
            </DialogClose>
          </div>

          <nav aria-label="Sections" className="mt-10 flex-1">
            <ul>
              {SECTIONS.map((section) => (
                <li key={section.id} className="rule-t">
                  <a
                    href={`#${section.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-5 py-6"
                  >
                    <span className="type-mono text-signal">{section.n}</span>
                    <span className="type-display text-[2rem]">
                      {section.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="space-y-2.5">
            {CONTACT_LINKS.slice(0, 3).map((link) => (
              <li key={link.href} className="flex items-center justify-between gap-4">
                <span className="type-mono text-muted">{link.label}</span>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[0.9375rem] text-fg"
                >
                  {link.value}
                  <ArrowUpRight aria-hidden className="size-3.5 text-signal" />
                </a>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
