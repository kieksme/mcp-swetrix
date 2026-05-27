# Contributing

Thanks for contributing to `mcp-swetrix`.

## Development setup

Requirements:

- Node `>= 20`
- pnpm `10`

Install dependencies and run the main checks:

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

## Workflow

This repository follows trunk-based development with short-lived branches.

- Branch names: `feat/*`, `fix/*`, `chore/*`, `ci/*`
- Keep changes small and focused
- Do not commit directly to `main`

## Commit conventions

Use [Conventional Commits](https://www.conventionalcommits.org/) in English.

Examples:

- `feat(mcp-swetrix-statistics): add pageviews-by-country tool`
- `fix(mcp-swetrix-events): handle 429 rate limit response`
- `chore(mcp-swetrix-admin): update dependencies`

For full repository conventions, release workflow, and package-specific guidance, see [`AGENTS.md`](AGENTS.md).
