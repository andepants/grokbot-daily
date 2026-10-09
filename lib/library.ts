/**
 * The workflow library: curated, source-linked setups people shared publicly.
 * Rules (see /about): every entry links its original source, quotes stay under
 * 15 words and are copied verbatim, summaries are our own words, and claims the
 * author makes that we have not tested are labeled as theirs.
 */
export type Kind = "Routine" | "Skill" | "Harness" | "Prompting" | "Safety" | "Template";

export type Workflow = {
  slug: string;
  title: string;
  kind: Kind;
  /** Our summary, in our words. */
  summary: string;
  /** Verbatim, under 15 words. */
  quote?: string;
  author: string;
  /** X handle without @, when the source is an X post. */
  handle?: string;
  source: { label: string; url: string };
  /** Date the source was published (YYYY-MM-DD). */
  date?: string;
  /** For living pages (marketplace templates): date we last checked it. */
  checked?: string;
  /** One concrete step to try. */
  tryIt: string;
  /** Issue slug that first featured it. */
  issue?: string;
  /** Our caveat, when the source makes claims we have not verified. */
  note?: string;
};

export const KINDS: Kind[] = ["Routine", "Skill", "Harness", "Prompting", "Safety", "Template"];

export const WORKFLOWS: Workflow[] = [
  {
    slug: "test-before-routine",
    title: "Run a job by hand before it becomes a routine",
    kind: "Routine",
    summary:
      "A six-step gate for recurring work: do the task once with your bot, fix the steps, save the method as a skill, try it on different input, spell out what failure looks like, then do a test run before you schedule it.",
    quote: "Your automation should be the final step of a reliable process",
    author: "Michael | AI + Agents",
    handle: "Michael_Fenech_",
    source: { label: "Post on X", url: "https://x.com/Michael_Fenech_/status/2106352565528977469" },
    date: "2026-10-03",
    tryIt: "Pick one weekly chore. Run it once while you watch, then save it as a skill before adding a schedule.",
    issue: "2026-10-08",
  },
  {
    slug: "research-finish-line",
    title: "Give research prompts a finish line",
    kind: "Prompting",
    summary:
      "“Research this deeply” has no end state. Spell out one measurable outcome, primary sources first, evidence next to each claim, bounded retries and an explicit stop condition.",
    quote: "give it a contract for when the job is actually finished.",
    author: "ludoonchart",
    handle: "ludoonchart",
    source: { label: "Post on X", url: "https://x.com/ludoonchart/status/2107191775433543884" },
    date: "2026-10-05",
    tryIt: "Add a “Done when:” line to your next research prompt, with the exact output you expect.",
    issue: "2026-10-08",
  },
  {
    slug: "teach-a-task",
    title: "Show the task once and save it as a skill",
    kind: "Skill",
    summary:
      "Teach a Task records you doing a job while your bot watches, then saves the demo as a reusable skill. It suits browser flows that are tedious to describe in words.",
    quote: "Don't write instructions. Just show it",
    author: "Robauto.ai",
    handle: "RobautoAI",
    source: { label: "Post on X", url: "https://x.com/RobautoAI/status/2107547570666934427" },
    date: "2026-10-06",
    tryIt: "Record one short browser task you repeat every week and check the skill it saves.",
    issue: "2026-10-08",
  },
  {
    slug: "founder-harness",
    title: "A harness for a one-person company",
    kind: "Harness",
    summary:
      "An X article that lays out a copyable Grok Bot setup for solo founders, aimed at handing routine work to bots instead of contractors.",
    quote: "Reduce routine outsourcing and reclaim founder time",
    author: "beamnxw",
    handle: "beamnxw",
    source: { label: "X article", url: "https://x.com/beamnxw/status/2107143806546002398" },
    date: "2026-10-05",
    tryIt: "Copy one piece of it, not the whole thing, and run that piece supervised for a week.",
    issue: "2026-10-08",
    note: "Treat it as a starting template. We haven’t run the full setup.",
  },
  {
    slug: "routed-agent-stack",
    title: "Put a router in front of your bot, shadow mode first",
    kind: "Harness",
    summary:
      "A seven-step setup that adds a usage router (Jev) ahead of costly actions like browsing and research. The key move is starting in shadow mode, reading the logs, and keeping a kill switch.",
    quote: "stay shadow first, read logs, then active when you trust it",
    author: "maestro",
    handle: "maestrooth",
    source: { label: "Post on X", url: "https://x.com/maestrooth/status/2107887351338774581" },
    date: "2026-10-07",
    tryIt: "Whatever you add between you and your bot, run it in a log-only mode for a few days first.",
    issue: "2026-10-08",
    note: "The speed and cost claims are the author’s. We haven’t benchmarked them.",
  },
  {
    slug: "x-feedback-loop",
    title: "Route X feedback to your tracker and your coding agent",
    kind: "Routine",
    summary:
      "Have your bot monitor X for feedback on your product, file feature requests in your issue tracker, and hand bug reports to a cloud coding agent to triage and fix.",
    quote: "the loop is complete",
    author: "Lauren Tan",
    handle: "poteto",
    source: { label: "Post on X", url: "https://x.com/poteto/status/2107963437154435182" },
    date: "2026-10-07",
    tryIt: "Start with a daily digest of mentions. Add automatic filing only after a week of reviewing it by hand.",
  },
  {
    slug: "audit-repo-lists",
    title: "Audit viral repo lists before you install anything",
    kind: "Safety",
    summary:
      "A security firm did a read-only review of a viral “20 GitHub repos” list. It found no malware, but several tools asked for session tokens, keychain access or admin rights.",
    quote: "Save fewer link lists. Audit more of them.",
    author: "FarVision Cybersecurity",
    handle: "FarVisionNetwks",
    source: { label: "Post on X", url: "https://x.com/FarVisionNetwks/status/2105697621629137285" },
    date: "2026-10-01",
    tryIt: "Before running any one-line installer, open it and read what it downloads and where it writes.",
    issue: "2026-10-08",
  },
  {
    slug: "dr-eggbot",
    title: "dr eggbot: a bot that designs your other bots",
    kind: "Template",
    summary:
      "A marketplace template that asks a few questions, then builds a bot with one job, one voice and explicit anti-jobs. It also ships routines that check your existing bots for friction and wasted runs.",
    author: "Lauren Tan",
    handle: "poteto",
    source: { label: "Marketplace page", url: "https://x.ai/bot/marketplace/bots/dr-eggbot-v2" },
    checked: "2026-10-07",
    tryIt: "Before adding a new bot, write down its one job and two things it must never do.",
  },
  {
    slug: "engineering-lead",
    title: "Engineering Lead: a bot that owns the PR loop",
    kind: "Template",
    summary:
      "Breaks work into cloud agent tasks, chases CI and reviews on a weekday cadence, and only pings you when something is blocked, ready to merge or done.",
    author: "Lauren Tan",
    handle: "poteto",
    source: { label: "Marketplace page", url: "https://x.ai/bot/marketplace/bots/engineering-lead" },
    checked: "2026-10-07",
    tryIt: "Define “done” as merged, not “agent started”, and have your bot report against that.",
  },
  {
    slug: "overheard",
    title: "Overheard: a quiet mentions digest",
    kind: "Template",
    summary:
      "Watches Reddit, Hacker News, news sites and X for mentions of your name, brand or URLs and sends a short weekday digest. It stays silent on dead days and never posts for you.",
    author: "Lenny Rachitsky",
    handle: "lennysan",
    source: { label: "Marketplace page", url: "https://x.ai/bot/marketplace/bots/overheard" },
    checked: "2026-10-07",
    tryIt: "Give any digest routine a rule to stay quiet when there’s nothing worth sending.",
  },
  {
    slug: "qa-bot",
    title: "QA bot: pass or fail on the live deploy",
    kind: "Template",
    summary:
      "Runs your acceptance checklist against the deployed site and reports pass or fail before you ship, so review covers what users see, not only the code.",
    author: "Ulysses Ng",
    source: { label: "Marketplace page", url: "https://x.ai/bot/marketplace/bots/qa-bot" },
    checked: "2026-10-07",
    tryIt: "Write five checks a real user would notice and have your bot run them after every deploy.",
  },
];

export function workflowsByKind(kind: Kind) {
  return WORKFLOWS.filter((w) => w.kind === kind);
}

/** The newest entries first, for teasers. */
export function latestWorkflows(n: number) {
  return WORKFLOWS.filter((w) => w.date)
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1))
    .slice(0, n);
}

export function quoteWordCount(quote: string) {
  return quote.trim().split(/\s+/).length;
}
