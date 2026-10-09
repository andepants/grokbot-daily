import Link from "next/link";
import { REPO_URL, SITE_NAME } from "@/lib/site";
import { GrokBot } from "./GrokBot";
import { NavLinks } from "./NavLinks";

export const NAV = [
  { href: "/issues", label: "Issues" },
  { href: "/workflows", label: "Workflows" },
  { href: "/guides", label: "Guides" },
  { href: "/resources", label: "Resources" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
          <GrokBot size={32} />
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <NavLinks items={NAV} className="nav-item" />
          <Link href="/#subscribe" className="nav-cta">
            Subscribe
          </Link>
        </nav>
      </div>
      <nav className="container nav-sub" aria-label="Sections">
        <NavLinks items={NAV} />
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <div className="footer-brand">
          <GrokBot size={24} />
          <p>© {new Date().getFullYear()} The Heim Life LLC · Open source, MIT</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/about">About</Link>
          <a href="/feed.xml">RSS</a>
          <Link href="/privacy">Privacy</Link>
          <a href={REPO_URL} rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
