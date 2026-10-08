"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function MagneticButton({
  children,
  className,
  type = "button",
  disabled,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      data-magnetic="true"
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      whileHover={reduce ? undefined : { scale: 1.015 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      {children}
    </motion.button>
  );
}
