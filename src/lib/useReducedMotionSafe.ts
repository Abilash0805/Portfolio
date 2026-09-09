"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/**
 * prefers-reduced-motion is unknowable during SSR, so branching on it while
 * rendering makes the server and the first client render disagree — a
 * hydration mismatch wherever the branch changes the DOM (React #418).
 *
 * useSyncExternalStore is built for exactly this: React uses the server
 * snapshot for both SSR and hydration, then re-renders with the real value.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
