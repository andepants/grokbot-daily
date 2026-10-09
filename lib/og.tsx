/* Shared OG/apple-icon drawing (Satori-compatible inline SVG). */
export function BotSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <line x1="24" y1="6" x2="24" y2="12" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="5" r="3.5" fill="#0a0a0a" />
      <circle cx="24" cy="29" r="17" fill="#0a0a0a" />
      <rect x="15.5" y="23" width="5" height="11" rx="2.5" fill="#fff" />
      <rect x="27.5" y="23" width="5" height="11" rx="2.5" fill="#fff" />
    </svg>
  );
}

export function OgCard({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#ffffff",
        color: "#0a0a0a",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <BotSvg size={72} />
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>Grok Bot Daily</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 28, color: "#5c5c5c", marginBottom: 16 }}>{kicker}</div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2, lineHeight: 1.08, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ fontSize: 28, color: "#5c5c5c", marginTop: 20, maxWidth: 1000 }}>{sub}</div>
      </div>
    </div>
  );
}
