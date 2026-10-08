import Link from "next/link";
import { ArrowRight, Lightning, ShieldCheck, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { StatsStrip } from "@/components/StatsStrip";
import { SubscribeForm } from "@/components/SubscribeForm";
import { listIssues } from "@/lib/issues";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function HomePage() {
  const latest = listIssues()[0];
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Weekday digest · open source</p>
            <h1>See what people are actually shipping with Grok Bot</h1>
            <p className="lead">{SITE_DESCRIPTION}</p>
            <div className="hero-actions">
              <a href="#subscribe" className="btn btn-primary">
                Get the digest <ArrowRight size={18} weight="bold" aria-hidden />
              </a>
              <Link href={latest ? `/issues/${latest.slug}` : "/archive"} className="btn btn-secondary">
                Read issue #1
              </Link>
            </div>
            <p className="muted" style={{ marginTop: "0.75rem", fontSize: "0.92rem" }}>
              Sourced from public X posts. Short quotes. Practical &ldquo;try this&rdquo; tips. No
              hype dumps.
            </p>
          </div>
          <Reveal>
            <div className="glass subscribe" id="subscribe-hero">
              <h2 style={{ fontSize: "1.35rem" }}>Join the list</h2>
              <p className="muted" style={{ margin: 0 }}>
                One email on weekdays when there&apos;s something worth your time. Double opt-in.
              </p>
              <SubscribeForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
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
            Grok Bot fleets move fast. This digest keeps the signal: routines that stick, skills
            worth copying, and honest warnings when viral lists look sketchy.
          </p>
          <div className="card-grid">
            <Reveal className="card glass">
              <Lightning size={28} weight="duotone" color="var(--accent)" />
              <h3>Workflow-first</h3>
              <p>We highlight runnable setups — routines, harnesses, teach-by-demo skills — not vague vibes.</p>
            </Reveal>
            <Reveal className="card glass">
              <ShieldCheck size={28} weight="duotone" color="var(--accent-2)" />
              <h3>Consent-first email</h3>
              <p>Double opt-in, one-click unsubscribe, List-Unsubscribe headers. Broadcasts never auto-send.</p>
            </Reveal>
            <Reveal className="card glass">
              <Sparkle size={28} weight="duotone" color="var(--success)" />
              <h3>Open archive</h3>
              <p>Every issue lives as Markdown in the repo and on the site. Fork it. Improve it. Self-host it.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" id="subscribe">
        <div className="container" style={{ display: "grid", gap: "1rem", maxWidth: 560 }}>
          <h2>Subscribe</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Free. Weekdays. Cancel anytime. We suggest one concrete way to improve your own bot
            workflow in every issue.
          </p>
          <div className="glass subscribe">
            <SubscribeForm />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end" }}>
            <div>
              <h2 className="section-title">Latest issue</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Also available as RSS and in the public GitHub repo.
              </p>
            </div>
            <Link href="/archive">Full archive →</Link>
          </div>
          <div className="issue-list" style={{ marginTop: "1.25rem" }}>
            {latest ? (
              <Link className="issue-row glass" href={`/issues/${latest.slug}`}>
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
    </main>
  );
}
