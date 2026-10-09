/** Curated links. Every URL was checked to load on the date in RESOURCES_CHECKED. */
export const RESOURCES_CHECKED = "2026-10-08";

export type Resource = { title: string; url: string; note: string };
export type ResourceGroup = { id: string; title: string; lead: string; items: Resource[] };

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: "official",
    title: "Official",
    lead: "Start with the source. These come from the team that makes Grok Bot.",
    items: [
      { title: "Introducing Grok Bot", url: "https://x.ai/news/introducing-grok-bot", note: "The launch post: what Grok Bot is and how it works." },
      { title: "Grok Bot 101", url: "https://x.ai/bot/guides/grok-bot-101", note: "Standing up a bot, chaining specialists, and real workflows." },
      { title: "Getting started playbooks", url: "https://x.ai/bot/guides/getting-started", note: "How Grok Bot works and how to share a bot as a template." },
      { title: "All official guides", url: "https://x.ai/bot/guides", note: "Playbooks by role: engineering, sales, marketing, support and more." },
      { title: "Templates for Grok Bot", url: "https://x.ai/bot/guides/templates-for-grok-bot", note: "What a template includes, what it leaves out, and how to install one." },
      { title: "Bot marketplace", url: "https://x.ai/bot/marketplace", note: "The official catalog of bot templates you can add." },
      { title: "Use cases", url: "https://x.ai/bot/use-cases", note: "Examples of work to hand off, sorted by team." },
      { title: "Changelog", url: "https://x.ai/changelog/bot", note: "What changed in each release. Check it when something behaves differently." },
    ],
  },
  {
    id: "community",
    title: "Community-built",
    lead: "Unofficial projects worth knowing. Read anything before you install it.",
    items: [
      { title: "Grok Bot Wiki: marketplace templates", url: "https://www.grokbotwiki.com/guides/grok-bot-marketplace-templates", note: "A community explainer on finding and adding templates." },
      { title: "Grok Bot Wiki: bot directory", url: "https://www.grokbotwiki.com/bots", note: "A community-run directory of shared bots." },
      { title: "Cursor plugin marketplace", url: "https://cursor.com/marketplace", note: "Plugins (MCP servers plus skills) you can connect to agents." },
      { title: "pstack plugin", url: "https://github.com/cursor/plugins/tree/main/pstack", note: "Lauren Tan’s verification-first plugin that several marketplace bots use." },
      { title: "grokbot-field-notes", url: "https://github.com/unicodef1wn/grokbot-field-notes", note: "Agent roles, rules and playbooks. A security review called it low risk." },
    ],
  },
  {
    id: "accounts",
    title: "Accounts on X",
    lead: "People whose posts have been worth reading. We’ll add to this as the issues go out.",
    items: [
      { title: "@bot", url: "https://x.com/bot", note: "The official Grok Bot account. Feature launches land here first." },
      { title: "@poteto", url: "https://x.com/poteto", note: "Lauren Tan. Builds bots and plugins, including dr eggbot and pstack." },
      { title: "@Michael_Fenech_", url: "https://x.com/Michael_Fenech_", note: "Practical routine and agent-reliability advice." },
      { title: "@ludoonchart", url: "https://x.com/ludoonchart", note: "Prompt structure for research agents." },
      { title: "@FarVisionNetwks", url: "https://x.com/FarVisionNetwks", note: "Security reviews of popular community tools." },
    ],
  },
];
