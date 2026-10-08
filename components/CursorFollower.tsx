"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export function CursorFollower() {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setOn(true);
    document.documentElement.classList.add("custom-cursor");
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [reduce]);

  if (!on) return null;
  return (
    <motion.div
      className="cursor-dot"
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.4 }}
      aria-hidden
    />
  );
}
