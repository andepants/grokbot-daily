type Mood = "idle" | "happy" | "lost";

type Props = {
  size?: number;
  /**
   * Idle "working" loop: eyes look around and dart side to side, small head
   * bob/tilt, blinks, antenna pulse. Static when prefers-reduced-motion.
   * Every keyframe starts from the resting pose, so first paint (and renders
   * where animation never runs) always show the full mark.
   */
  live?: boolean;
  mood?: Mood;
  className?: string;
  title?: string;
};

/**
 * Grok Bot Daily mark: an original monochrome bot head (round head, pill eyes,
 * antenna). Not derived from any third-party logo.
 */
export function GrokBot({ size = 28, live = false, mood = "idle", className, title }: Props) {
  const classes = ["bot", live ? "bot--live" : "", `bot--${mood}`, className ?? ""]
    .filter(Boolean)
    .join(" ");
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
      <g className="bot-body">
        <line x1="24" y1="6" x2="24" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle className="bot-antenna" cx="24" cy="5" r="3.5" fill="currentColor" />
        <circle cx="24" cy="29" r="17" fill="currentColor" />
        <g className="bot-eyes">
          <g className="bot-gaze">
            {mood === "happy" ? (
              <>
                <path d="M14.5 30.5q3.5-5.5 7 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                <path d="M26.5 30.5q3.5-5.5 7 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : mood === "lost" ? (
              <>
                <circle cx="17" cy="26" r="3" fill="#fff" />
                <circle cx="29" cy="26" r="3" fill="#fff" />
              </>
            ) : (
              <>
                <rect className="bot-eye" x="15.5" y="23" width="5" height="11" rx="2.5" fill="#fff" />
                <rect className="bot-eye" x="27.5" y="23" width="5" height="11" rx="2.5" fill="#fff" />
              </>
            )}
          </g>
        </g>
      </g>
    </svg>
  );
}
