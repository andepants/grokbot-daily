---
title: "Safe defaults: secrets, sends and installers"
description: "Three habits that keep an always-on bot from doing something you can’t undo."
order: 3
updated: "2026-10-08"
minutes: 3
sources:
  - label: "FarVision Cybersecurity: audit of a viral 20-repo list"
    url: "https://x.com/FarVisionNetwks/status/2105697621629137285"
  - label: "maestro: shadow mode first, with a kill switch"
    url: "https://x.com/maestrooth/status/2107887351338774581"
---

A bot that runs while you sleep needs the same guardrails you’d give a new hire with your laptop. Three habits cover most of the risk.

## 1. Secrets never go in chat

API keys, passwords and codes belong in a secure field or a password manager, not pasted into a message. Chat history is easy to share, search and forget about.

## 2. Draft first, send second

For anything other people will see (email, posts, messages, tickets), have the bot write a draft and stop. You approve the send. The same goes for anything that costs money or deletes something.

If you add a new layer between you and your bot, such as a router, a proxy or a new tool, run it in a **log-only “shadow” mode** first, read what it would have done, and keep an off switch.

## 3. Read installers before you run them

When FarVision audited a viral “20 repos” list, they found no hidden malware, but several tools asked for session tokens, keychain access or admin rights. Before you run a one-line installer:

- open the script and see what it downloads and where it writes
- prefer pinned versions over “latest from main”
- try new tools on a spare machine or account, with a spending-capped key
