import { useId } from "react";

type Mood = "idle" | "happy" | "lost";

type Props = {
  size?: number;
  /** Sunrise + blink + antenna ping. Static when prefers-reduced-motion. */
  live?: boolean;
  mood?: Mood;
  className?: string;
  title?: string;
};

/**
 * Grok Bot Daily mark, "sunrise bot": a bot head rising over the day's page
 * (horizon bar + text line) inside a solid tile. Original artwork; not derived
 * from any third-party logo. Geometry is mirrored in lib/brand.tsx (OG / icons).
 */
export function GrokBot({ size = 28, live = false, mood = "idle", className, title }: Props) {
  const clipId = `bot-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const classes = ["bot", live ? "bot--live" : "", `bot--${mood}`, className ?? ""].filter(Boolean).join(" ");
  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="48" height="32.5" />
        </clipPath>
      </defs>
      <rect className="bot-tile" width="48" height="48" rx="11" fill="currentColor" />
      <g clipPath={`url(#${clipId})`}>
        <g className="bot-rise">
          <rect x="22.6" y="8" width="2.8" height="8" fill="#fff" />
          <circle className="bot-antenna" cx="24" cy="7" r="3" fill="#fff" />
          <path d="M8 31a16 16 0 0 1 32 0z" fill="#fff" />
          <g className="bot-eyes">
            {mood === "happy" ? (
              <>
                <path d="M15 25.5a3 3 0 0 1 6 0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                <path d="M27 25.5a3 3 0 0 1 6 0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </>
            ) : mood === "lost" ? (
              <>
                <circle cx="18" cy="25" r="2.2" fill="currentColor" />
                <circle cx="30" cy="25" r="2.2" fill="currentColor" />
              </>
            ) : (
              <>
                <circle className="bot-eye" cx="18" cy="23.5" r="3.3" fill="currentColor" />
                <circle className="bot-eye" cx="30" cy="23.5" r="3.3" fill="currentColor" />
              </>
            )}
          </g>
        </g>
      </g>
      <rect className="bot-line bot-line-1" x="6" y="34" width="36" height="4" rx="2" fill="#fff" />
      <rect className="bot-line bot-line-2" x="12" y="40.5" width="24" height="3" rx="1.5" fill="#fff" />
    </svg>
  );
}
