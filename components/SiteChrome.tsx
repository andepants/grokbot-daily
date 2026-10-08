import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden />
          {SITE_NAME}
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <Link href="/#why">Why</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/#subscribe" className="nav-cta">
            Subscribe
          </Link>
          <Link href="/privacy">Privacy</Link>
          <a href="https://github.com/andepants/grokbot-daily" rel="noreferrer" target="_blank">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <p>
          Open source · MIT · Published by The Heim Life LLC · Built for people running Grok Bot
          fleets.
        </p>
        <p>
          <a href="/feed.xml">RSS</a>
          {" · "}
          <Link href="/privacy">Privacy</Link>
          {" · "}
          <a href="https://github.com/andepants/grokbot-daily">Repo</a>
        </p>
      </div>
    </footer>
  );
}
