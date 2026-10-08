"use client";

import { useEffect, useState } from "react";

/**
 * Decorative cursor accent for fine pointers only (desktop mice).
 * Disabled on touch/coarse pointers and when reduced motion is preferred.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);

    let x = 0;
    let y = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
          raf = 0;
        });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
      dot.remove();
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  if (!enabled) return null;
  return null;
}
