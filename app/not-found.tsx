import type { Metadata } from "next";
import Link from "next/link";
import { GrokBot } from "@/components/GrokBot";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main" className="container narrow page center-card">
      <GrokBot size={56} mood="lost" />
      <h1>This page wandered off</h1>
      <p className="lead">The link may be old or mistyped.</p>
      <p className="row-links">
        <Link className="btn btn-primary" href="/">
          Go home
        </Link>
        <Link className="btn btn-secondary" href="/issues">
          Browse issues
        </Link>
      </p>
    </main>
  );
}
