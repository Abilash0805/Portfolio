"use client";

import { motion } from "framer-motion";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { JSX, ReactNode } from "react";

/**
 * Word-level mask reveal. Fires once on entry — repeating it every time a
 * section re-enters the viewport is the tell of animation applied by rote.
 */
export function RevealText({
  children,
  as = "span",
  className = "",
  delay = 0,
  stagger = 0.045,
}: {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotionSafe();
  const words = children.split(" ");

  // Cast to a concrete intrinsic so the polymorphic tag keeps a usable
  // children/className signature.
  const Tag = as as "span";

  if (reduced) return <Tag className={className}>{children}</Tag>;

  // The semantic tag stays plain and an inner span carries the animation,
  // so no component is constructed during render.
  return (
    <Tag className={className}>
      <motion.span
        style={{ display: "inline" }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
        aria-label={children}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            aria-hidden
            // The clip is what makes it read as a reveal rather than a fade.
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
            }}
          >
            <motion.span
              style={{ display: "inline-block", willChange: "transform" }}
              variants={{
                hidden: { y: "110%", rotate: 3 },
                show: {
                  y: "0%",
                  rotate: 0,
                  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Fade+rise for blocks that should not be split into words. */
export function Rise({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotionSafe();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
