import type { Metadata } from "next";
import Link from "next/link";
import { SubscribeBlock } from "@/components/SubscribeBlock";
import { listGuides } from "@/lib/guides";
import { alternatesFor } from "@/lib/meta";

export const metadata: Metadata = {
  title: "Guides",
  description: "Short, practical guides for running Grok Bot safely: routines, templates, secrets and prompts.",
  alternates: alternatesFor("/guides"),
};

export default function GuidesPage() {
  const guides = listGuides();
  return (
    <main id="main" className="container narrow page">
      <h1>Guides</h1>
      <p className="lead">
        Short guides we wrote from what keeps coming up in the issues. Read them in order if you’re new, or jump to the one
        you need.
      </p>
      <ol className="guide-list guide-list--numbered">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link className="guide-row" href={`/guides/${g.slug}`}>
              <span className="guide-title">{g.title}</span>
              <span className="guide-desc">{g.description}</span>
              <span className="guide-meta">{g.minutes} min read</span>
            </Link>
          </li>
        ))}
      </ol>
      <SubscribeBlock formId="guides" />
    </main>
  );
}
