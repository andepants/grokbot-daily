"use client";

import NumberFlow from "@number-flow/react";
import { useReducedMotion } from "motion/react";

export function StatsStrip({
  stats,
}: {
  stats: { label: string; value: number; prefix?: string; suffix?: string; staticDisplay?: string }[];
}) {
  const reduce = useReducedMotion();
  return (
    <div className="stats">
      {stats.map((s) => (
        <div key={s.label} className="stat glass">
          <div className="stat-value">
            {reduce || s.staticDisplay ? (
              s.staticDisplay ?? `${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`
            ) : (
              <>
                {s.prefix}
                <NumberFlow value={s.value} />
                {s.suffix}
              </>
            )}
          </div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
