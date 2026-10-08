# Contributing

## Issues / tips

- Prefer concrete Grok Bot workflows with a public X link
- Keep quotes under ~15 words; paraphrase the rest
- Do not invent posts, metrics, or product claims

## Pull requests

1. Branch from `main`
2. Add or edit Markdown under `content/issues/`
3. Run `pnpm typecheck` and `pnpm build`
4. Open a PR with a clear summary

## Attribution

Commits should be authored as a real human contributor. Do not add Cursor / bot attribution trailers.

## Email / broadcasts

Never run `pnpm send:broadcast` without `--confirm`, and never from CI. Preview sends are fine for testing your own address.
