import type { Metadata } from "next";
import { alternatesFor } from "@/lib/meta";
import { formatIssueDate } from "@/lib/issues";
import { RESOURCE_GROUPS, RESOURCES_CHECKED } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources",
  description: "Official Grok Bot docs, community projects and accounts on X worth following.",
  alternates: alternatesFor("/resources"),
};

export default function ResourcesPage() {
  return (
    <main id="main" className="container page">
      <div className="page-head">
        <h1>Resources</h1>
        <p className="lead">
          The links we keep open. Official sources first, then community projects and the accounts behind the best posts.
          Links checked <time dateTime={RESOURCES_CHECKED}>{formatIssueDate(RESOURCES_CHECKED)}</time>.
        </p>
      </div>
      {RESOURCE_GROUPS.map((g) => (
        <section key={g.id} className="section" aria-labelledby={`${g.id}-title`}>
          <div className="section-head">
            <h2 id={`${g.id}-title`}>{g.title}</h2>
            <p className="muted">{g.lead}</p>
          </div>
          <ul className="link-list section-body">
            {g.items.map((r) => (
              <li key={r.url}>
                <a href={r.url} rel="noreferrer">
                  {r.title}
                  <span aria-hidden> ↗</span>
                </a>
                <span className="muted">{r.note}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
