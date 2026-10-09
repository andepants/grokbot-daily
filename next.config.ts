import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
/** Vercel preview deployments inject the toolbar from vercel.live; production never does. */
const isPreview = process.env.VERCEL_ENV === "preview";
const live = isPreview ? " https://vercel.live" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/archive", destination: "/issues", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${live}`,
              `style-src 'self' 'unsafe-inline'${live}`,
              `img-src 'self' data: blob:${isPreview ? " https://vercel.live https://vercel.com" : ""}`,
              `font-src 'self' data:${isPreview ? " https://vercel.live https://assets.vercel.com" : ""}`,
              `connect-src 'self'${isPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
              ...(isPreview ? ["frame-src https://vercel.live"] : []),
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
