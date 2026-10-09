import Link from "next/link";
import { REPO_URL, SITE_NAME } from "@/lib/site";
import { GrokBot } from "./GrokBot";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
          <GrokBot size={26} />
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <Link href="/archive">Archive</Link>
          <Link href="/#subscribe" className="nav-cta">
            Subscribe
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <p>© {new Date().getFullYear()} The Heim Life LLC · Open source, MIT</p>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/archive">Archive</Link>
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
