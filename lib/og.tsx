/* Shared OG / apple-icon drawing (Satori-compatible inline SVG). Mirrors components/GrokBot.tsx. */
export function BotSvg({ size, tile = true }: { size: number; tile?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {tile ? <rect width="48" height="48" rx="11" fill="#0a0a0a" /> : <rect width="48" height="48" fill="#0a0a0a" />}
      <rect x="22.6" y="8" width="2.8" height="8" fill="#fff" />
      <circle cx="24" cy="7" r="3" fill="#fff" />
      <path d="M8 31a16 16 0 0 1 32 0z" fill="#fff" />
      <circle cx="18" cy="23.5" r="3.3" fill="#0a0a0a" />
      <circle cx="30" cy="23.5" r="3.3" fill="#0a0a0a" />
      <rect x="6" y="34" width="36" height="4" rx="2" fill="#fff" />
      <rect x="12" y="40.5" width="24" height="3" rx="1.5" fill="#fff" />
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
        background: "#ffffff",
        color: "#0a0a0a",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 56px 64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <BotSvg size={60} />
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>Grok Bot Daily</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#5c5c5c", marginBottom: 14 }}>{kicker}</div>
          <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -2, lineHeight: 1.06, maxWidth: 720 }}>{title}</div>
          <div style={{ fontSize: 26, color: "#3d3d3d", marginTop: 20, maxWidth: 700, lineHeight: 1.35 }}>{sub.length > 150 ? `${sub.slice(0, 147).trimEnd()}…` : sub}</div>
        </div>
      </div>
      <div
        style={{
          width: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <BotSvg size={300} tile={false} />
      </div>
    </div>
  );
}
