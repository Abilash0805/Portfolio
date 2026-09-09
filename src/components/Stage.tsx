"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { ScrollProvider } from "@/components/ScrollProvider";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/ui/Preloader";
import { useEnv } from "@/lib/useEnv";

// The whole WebGL layer is a separate chunk, fetched only when it will run.
const SceneRoot = dynamic(() => import("@/components/canvas/SceneRoot"), {
  ssr: false,
});

/**
 * Static stand-in for the construct under prefers-reduced-motion: the same
 * geometry, none of the movement.
 */
function StaticConstruct() {
  return (
    <div className="absolute inset-0 grid place-items-center md:translate-x-[14%]">
      <svg
        width="420"
        height="420"
        viewBox="-110 -110 220 220"
        className="max-w-[70vw] opacity-45"
        aria-hidden
      >
        <g fill="none" stroke="var(--color-glow)" strokeWidth="0.75">
          <rect x="-62" y="-62" width="124" height="124" opacity=".55" />
          <rect
            x="-62"
            y="-62"
            width="124"
            height="124"
            transform="rotate(45)"
            opacity=".3"
          />
          <circle r="88" opacity=".22" />
        </g>
        <g fill="var(--color-accent-fg)">
          {[
            [-62, -62], [62, -62], [62, 62], [-62, 62],
            [0, -88], [88, 0], [0, 88], [-88, 0],
          ].map(([x, y]) => (
            <circle key={`${x},${y}`} cx={x} cy={y} r="2.4" />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function Stage() {
  const env = useEnv();
  const [canvasReady, setCanvasReady] = useState(false);

  // Mounting the canvas immediately blocks the first paint: WebGL context
  // creation and shader compilation run on the main thread, and on a slow GPU
  // that delayed first paint by ~700ms. Wait for a painted frame first, then
  // bring the field in.
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setCanvasReady(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // Nothing renders until the environment is known, so the first paint is
  // never the wrong version.
  if (env.reducedMotion === null) return null;

  return (
    <>
      <ScrollProvider reducedMotion={env.reducedMotion} />
      {!env.reducedMotion && <Cursor />}

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        // The construct is decoration; every fact it carries is also in the DOM.
      >
        {env.reducedMotion ? (
          <StaticConstruct />
        ) : canvasReady ? (
          <SceneRoot tier={env.tier} />
        ) : null}
      </div>

      <Preloader />
    </>
  );
}
