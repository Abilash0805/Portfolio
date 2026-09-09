"use client";

import { create } from "zustand";

/**
 * High-frequency values deliberately live OUTSIDE React.
 * Scroll progress, velocity and pointer update every frame; routing them
 * through setState would re-render the tree 60x/sec. useFrame reads this
 * mutable object directly instead.
 */
export const flux = {
  /** 0..1 across the whole document. */
  progress: 0,
  /** Signed, normalised scroll velocity. Drives shear + aberration. */
  velocity: 0,
  /** Smoothed |velocity|, 0..1. */
  energy: 0,
  /** Continuous chapter position, 0..(CHAPTERS-1). Fractional = mid-morph. */
  chapter: 0,
  /** Where the current section wants the construct to be. `chapter` chases
   *  this, which is what stops overlapping section triggers from fighting. */
  chapterTarget: 0,
  /** Pointer in -1..1 NDC, smoothed. */
  pointer: { x: 0, y: 0 },
  /** Raw pointer, unsmoothed. */
  pointerRaw: { x: 0, y: 0 },
  /** Set while the pointer is over a magnetic element. */
  hovering: false,
};

/** Set by SmoothScroll. The mobile menu stops it while open — hiding body
 *  overflow does not stop a wheel-driven smooth scroller. */
export const lenisRef: { current: { stop: () => void; start: () => void } | null } =
  { current: null };

export const CHAPTERS = ["core", "grid", "trace", "fan"] as const;
export type Chapter = (typeof CHAPTERS)[number];

/** Discrete, low-frequency state. Safe to drive React with. */
type UIState = {
  /** Preloader has finished and the reveal has run. */
  entered: boolean;
  /** 0..1 real asset + font load progress. */
  loadProgress: number;
  /** Index of the chapter currently dominant. */
  activeChapter: number;
  /** Which skill group the visitor is reading, drives the 3D character. */
  activeSkill: number;
  enter: () => void;
  setLoadProgress: (p: number) => void;
  setActiveChapter: (c: number) => void;
  setActiveSkill: (s: number) => void;
};

export const useUI = create<UIState>((set) => ({
  entered: false,
  loadProgress: 0,
  activeChapter: 0,
  activeSkill: 0,
  enter: () => set({ entered: true }),
  setLoadProgress: (loadProgress) => set({ loadProgress }),
  setActiveChapter: (activeChapter) =>
    set((s) => (s.activeChapter === activeChapter ? s : { activeChapter })),
  setActiveSkill: (activeSkill) =>
    set((s) => (s.activeSkill === activeSkill ? s : { activeSkill })),
}));
