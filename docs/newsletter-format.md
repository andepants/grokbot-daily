# Newsletter format (daily roundup + special issue)

Grok Bot Daily emails use the same compact link-roundup layout as ShotPup Weekly:
header links (Sign Up | Advertise | View Online), the round bot mark + "Grok Bot Daily",
3–6 scored items (one-line linked headline + read time, then a short blurb), and a minimal footer
(feedback line, "Thanks for reading, Andrew Heim", manage/unsubscribe, postal address).
Colors follow the reader's light/dark mode.

## What the site needs

- `public/email/bot-mark.png` (this PR): 96×96 round bot mark on a white rounded tile, used as the
  email header logo at 34×34. Email clients can't render inline SVG, so the email needs a hosted PNG.
- **View Online** links to `/issues/<YYYY-MM-DD>`. The builder writes `content/issues/<date>.md`
  with `title`, `date`, `description` frontmatter and a body of `## <emoji> <Section>` headings,
  each followed by `**[Headline (N minute read)](url)**` + a blurb paragraph. The existing
  ReactMarkdown issue page renders that as-is; no route changes are needed.
- Special issues use the same frontmatter, plus `variant: special`, with sections
  "The Talk" → "10 Tips" (bold numbered titles, no links) → "Go Deeper" (links back to this site).
- Optional, later: style the item headings in `.prose` so `p > strong > a` reads like an item title,
  and show a "Special" badge when `variant: special`.

Issue Markdown is only added to `content/issues/` once Andrew approves that issue.
