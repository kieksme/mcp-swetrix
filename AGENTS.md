# AGENTS.md

Guidelines for AI coding agents (Claude Code, Copilot, etc.) working in this repository.

## Repository overview

Monorepo with three MCP (Model Context Protocol) servers for the Swetrix analytics platform:

| Package | Path | npm |
|---|---|---|
| `@kieksme/swetrix-statistics-mcp` | `packages/swetrix-statistics-mcp-server` | read-only analytics queries |
| `@kieksme/swetrix-events-mcp` | `packages/swetrix-events-mcp-server` | event ingestion |
| `@kieksme/swetrix-admin-mcp` | `packages/swetrix-admin-mcp-server` | project management |

Package manager: **pnpm 10**. Node: **>=20**. Language: **TypeScript (ESM)**.

## Branching strategy: trunk-based development

- **`main` is the trunk.** It must always be releasable.
- Work in short-lived feature branches (`feat/`, `fix/`, `chore/`, `ci/`).
- Branches live **at most 1–2 days**. Keep them small and focused.
- Merge directly into `main` via fast-forward or squash — no long-lived branches.
- Never commit directly to `main`.
- Delete branches after merging.

## Versioning & releases: Release Please

Releases are fully automated. Do **not** manually edit `package.json` versions or `CHANGELOG.md`.

### How it works

1. Commits to `main` trigger the `release-please.yml` workflow.
2. Release Please reads [Conventional Commits](#commit-conventions) and opens/updates a release PR per package.
3. Merging a release PR creates a GitHub Release + git tag and publishes the package to **npm** and **GitHub Packages** automatically.

### Commit conventions

Use [Conventional Commits](https://www.conventionalcommits.org/). The scope must be the package component name:

```
feat(mcp-swetrix-statistics): add pageviews-by-country tool
fix(mcp-swetrix-events): handle 429 rate limit response
chore(mcp-swetrix-admin): update dependencies
ci: add GitHub Packages publish step
docs: update README
```

| Prefix | Version bump |
|---|---|
| `feat` | minor |
| `fix`, `perf` | patch |
| `feat!` / `BREAKING CHANGE` | major |
| `chore`, `ci`, `docs`, `test` | none (no release) |

Omit the scope for repo-wide changes (`ci:`, `chore:`, `docs:`).

## Development workflow

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Typecheck all packages
pnpm typecheck

# Work on a single package
pnpm --filter @kieksme/swetrix-statistics-mcp test
pnpm --filter @kieksme/swetrix-statistics-mcp build
```

## Adding a new tool to a package

1. Add the Zod schema in `packages/<pkg>/src/schemas/`.
2. Implement the handler in `packages/<pkg>/src/tools/`.
3. Register it in `packages/<pkg>/src/index.ts`.
4. Add a unit test in `packages/<pkg>/src/__tests__/`.
5. Commit with `feat(mcp-swetrix-<pkg>): <description>`.

## Publishing

Publishing is **fully automated** — never run `pnpm publish` manually except via the emergency `publish.yml` workflow dispatch.

Packages are published to two registries on every release:
- **npm**: `https://registry.npmjs.org` (requires `NPM_TOKEN` secret)
- **GitHub Packages**: `https://npm.pkg.github.com` (uses `GITHUB_TOKEN`, no extra secret)

## What agents should not do

- Do not bump versions in `package.json` manually.
- Do not edit `CHANGELOG.md` or `.release-please-manifest.json` manually.
- Do not push directly to `main`.
- Do not create long-lived feature branches.
- Do not add `console.log` debug statements to committed code.
- Do not use `npm` or `yarn` — this repo uses `pnpm`.
