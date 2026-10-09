---
title: "Write prompts with a finish line"
description: "Why “research this deeply” never ends, and a short template that tells your bot when it’s done."
order: 4
updated: "2026-10-08"
minutes: 3
sources:
  - label: "ludoonchart: a deep-research blueprint for Grok Bot"
    url: "https://x.com/ludoonchart/status/2107191775433543884"
---

“Research this deeply” sounds thorough. To a bot, it’s an instruction with no end. It keeps browsing, retries the same dead sources, and hands back something long instead of something useful.

Give it a contract instead.

## A template you can copy

```
Goal: one sentence, one measurable outcome.
Sources: primary sources first (official docs, the original post, the filing).
Evidence: put the link next to every important claim.
Label claims: VERIFIED, INFERRED or UNKNOWN.
Retries: at most 2 per source, then move on.
Ask me before: anything that sends, posts, buys or deletes.
Done when: <the exact thing you want back>.
Hand-off: end with what you couldn't check.
```

## Why it works

- **“Done when” gives it a stop.** Without one, more browsing always looks like progress.
- **Labels make the gaps visible.** You can see at a glance what was checked and what was a guess.
- **A hand-off note makes the next run cheaper.** Tomorrow’s run, or another bot, starts where this one stopped.

Once a prompt like this gives you two clean runs, save it as a skill. That’s when it’s ready to become a routine.
