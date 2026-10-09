"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Progressive enhancement reveal.
 * Default / SSR / no-JS / failed observers: fully visible (never opacity 0).
 * With motion: a short spring when the node enters view — polish only.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      data-reveal="true"
      initial={false}
      whileInView={
        reduce
          ? undefined
          : {
              y: 0,
              opacity: 1,
              transition: { type: "spring", stiffness: 260, damping: 28 },
            }
      }
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
