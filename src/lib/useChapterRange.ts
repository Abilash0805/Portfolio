"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type RefObject } from "react";

import { flux } from "@/lib/store";

/**
 * Hands a section authority over where the construct sits while that section
 * owns the viewport. Ranges are disjoint, so no two sections write in the
 * same frame.
 */
export function useChapterRange(
  ref: RefObject<HTMLElement | null>,
  from: number,
  to: number,
  options?: { start?: string; end?: string; onProgress?: (p: number) => void },
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: options?.start ?? "top 70%",
      end: options?.end ?? "bottom 30%",
      onUpdate: (self) => {
        flux.chapterTarget = gsap.utils.interpolate(from, to, self.progress);
        options?.onProgress?.(self.progress);
      },
    });

    return () => trigger.kill();
    // The option callbacks are intentionally read at trigger time only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, from, to]);
}
