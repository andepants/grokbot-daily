import Link from "next/link";
import { ArrowRight, Lightning, ShieldCheck, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { HeroLottie } from "@/components/HeroLottie";
import { Reveal } from "@/components/Reveal";
import { StatsStrip } from "@/components/StatsStrip";
import { SubscribeBlock } from "@/components/SubscribeBlock";
import { listIssues } from "@/lib/issues";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function HomePage() {
  const latest = listIssues()[0];
  return (
    <main>
      <section className="hero">
        <div className="container hero-stack">
          <aside className="hero-aside">
            <SubscribeBlock id="subscribe" formId="hero-subscribe" />
          </aside>
          <div className="hero-main">
            <div className="hero-lottie-wrap">
              <HeroLottie />
            </div>
            <h1>See what people are actually shipping with Grok Bot</h1>
            <p className="lead">{SITE_DESCRIPTION}</p>
            <div className="hero-actions">
              <a href="#subscribe" className="btn btn-primary">
                Get the digest <ArrowRight size={18} weight="bold" aria-hidden />
              </a>
              <Link href={latest ? `/issues/${latest.slug}` : "/archive"} className="btn btn-secondary">
                Read latest issue
              </Link>
            </div>
            <p className="muted" style={{ marginTop: "0.75rem", fontSize: "0.95rem", maxWidth: "36rem" }}>
              Sourced from public X posts. Short quotes. Practical &ldquo;try this&rdquo; tips. No hype dumps.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-compact">
        <div className="container">
          <StatsStrip
            stats={[
              { label: "Minutes to skim", value: 5, suffix: " min", staticDisplay: "~5 min" },
              { label: "Issues so far", value: listIssues().length },
              { label: "Ads in the email", value: 0 },
              { label: "Source", value: 100, suffix: "% X", staticDisplay: "100% X" },
            ]}
          />
        </div>
      </section>

      <section className="section" id="why">
        <div className="container">
          <h2 className="section-title">Why {SITE_NAME}</h2>
          <p className="section-sub">
            Grok Bot fleets move fast. This digest keeps the signal: routines that stick, skills worth copying,
            and honest warnings when viral lists look sketchy.
          </p>
          <div className="card-grid">
            <Reveal className="card surface">
              <Lightning size={28} weight="duotone" color="var(--accent)" />
              <h3>Workflow-first</h3>
              <p>We highlight runnable setups — routines, harnesses, teach-by-demo skills — not vague vibes.</p>
            </Reveal>
            <Reveal className="card surface">
              <ShieldCheck size={28} weight="duotone" color="var(--accent-2)" />
              <h3>Consent-first email</h3>
              <p>
                Double opt-in with a confirm button (no GET side effects), topic-scoped one-click unsubscribe, and
                List-Unsubscribe headers. Broadcasts are draft-only until you send them.
              </p>
            </Reveal>
            <Reveal className="card surface">
              <Sparkle size={28} weight="duotone" color="var(--success)" />
              <h3>Open archive</h3>
              <p>Every issue lives as Markdown in the repo and on the site. Fork it. Improve it. Self-host it.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="archive-header">
            <div>
              <h2 className="section-title">Latest issue</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Also available as RSS and in the public GitHub repo.
              </p>
            </div>
            <Link href="/archive" className="archive-link">
              Full archive →
            </Link>
          </div>
          <div className="issue-list" style={{ marginTop: "1.25rem" }}>
            {latest ? (
              <Link className="issue-row surface" href={`/issues/${latest.slug}`}>
                <div>
                  <strong>{latest.title}</strong>
                  <div className="issue-meta">{latest.description}</div>
                </div>
                <div className="issue-meta">{latest.date}</div>
              </Link>
            ) : (
              <p className="muted">No issues yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section section-compact" aria-labelledby="subscribe-footer-heading">
        <div className="container" style={{ maxWidth: 560 }}>
          <SubscribeBlock
            id="subscribe-footer"
            formId="footer-subscribe"
            title="Subscribe"
            lead="Free on weekdays. Cancel anytime. Every issue includes one concrete way to improve your bot workflow."
          />
        </div>
      </section>
    </main>
  );
}
