"use client";

import { useEffect, useState } from "react";

export type Tier = "high" | "low";

export type Env = {
  /** Resolved after mount; null during SSR so nothing renders inconsistently. */
  reducedMotion: boolean | null;
  tier: Tier;
  coarsePointer: boolean;
};

/**
 * Device capability + motion preference, resolved on the client only.
 *
 * The tier check is deliberately cheap and static rather than an fps probe:
 * downgrading mid-scroll is more jarring than starting simple. Scroll
 * smoothness outranks 3D fidelity on low-end devices.
 */
export function useEnv(): Env {
  const [env, setEnv] = useState<Env>({
    reducedMotion: null,
    tier: "high",
    coarsePointer: false,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");

    const resolveTier = (): Tier => {
      const cores = navigator.hardwareConcurrency ?? 4;
      const memory = (navigator as Navigator & { deviceMemory?: number })
        .deviceMemory;
      const smallViewport = window.innerWidth < 768;

      if (cores <= 4 || (memory !== undefined && memory <= 4)) return "low";
      // A phone-sized viewport with a coarse pointer is a phone, not a
      // narrow desktop window.
      if (smallViewport && pointerQuery.matches) return "low";
      return "high";
    };

    const sync = () =>
      setEnv({
        reducedMotion: motionQuery.matches,
        tier: resolveTier(),
        coarsePointer: pointerQuery.matches,
      });

    sync();
    motionQuery.addEventListener("change", sync);
    pointerQuery.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      pointerQuery.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return env;
}
