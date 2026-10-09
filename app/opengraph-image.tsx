import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og";
import { SITE_DESCRIPTION } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Grok Bot Daily";

export default function OgImage() {
  return new ImageResponse(
    <OgCard kicker="Free daily email" title="The best of Grok Bot, every morning." sub={SITE_DESCRIPTION} />,
    size,
  );
}
