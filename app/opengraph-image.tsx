import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #0b0d12 0%, #171a24 50%, #1a1030 100%)",
          color: "#f4f1ea",
          fontSize: 56,
          fontWeight: 800,
        }}
      >
        <div style={{ fontSize: 28, color: "#7dd3fc", marginBottom: 18, letterSpacing: 4 }}>
          OPEN SOURCE DIGEST
        </div>
        <div>{SITE_NAME}</div>
        <div style={{ fontSize: 30, color: "#9aa3b5", marginTop: 18, fontWeight: 500 }}>
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    size,
  );
}
