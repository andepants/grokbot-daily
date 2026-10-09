import { ImageResponse } from "next/og";
import { BotSvg } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Full-bleed tile; iOS applies its own corner mask. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0a" }}>
        <BotSvg size={180} tile={false} />
      </div>
    ),
    size,
  );
}
