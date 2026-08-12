## Summary

<!-- What does this PR change, and why? -->

## Package(s) affected

- [ ] `@kieksme/swetrix-statistics-mcp` (`packages/swetrix-statistics-mcp-server`)
- [ ] `@kieksme/swetrix-events-mcp` (`packages/swetrix-events-mcp-server`)
- [ ] `@kieksme/swetrix-admin-mcp` (`packages/swetrix-admin-mcp-server`)
- [ ] Repo-wide (tooling, CI, docs)

## Type of change

<!-- Match the Conventional Commit type used in the commit message (see AGENTS.md) -->

- [ ] `feat` – new feature (minor version bump)
- [ ] `fix` / `perf` – bug fix or perf improvement (patch version bump)
- [ ] `feat!` / `BREAKING CHANGE` – breaking change (major version bump)
- [ ] `docs` / `chore` / `ci` / `test` – no release

## Checklist

- [ ] Branch is short-lived and targets `main` (trunk-based development)
- [ ] `pnpm build`, `pnpm test`, and `pnpm typecheck` pass
- [ ] Unit test added in `src/__tests__/` for new/changed tools (see [AGENTS.md](../AGENTS.md#adding-a-new-tool-to-a-package))
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) with the package scope, e.g. `feat(mcp-swetrix-statistics): ...`
- [ ] No manual edits to `package.json` versions, `CHANGELOG.md`, or `.release-please-manifest.json`
- [ ] No `console.log` debug statements left in committed code

## Related issues

<!-- e.g. Closes #123 -->
