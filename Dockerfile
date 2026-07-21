# syntax=docker/dockerfile:1
#
# Shared build for all three MCP server packages in this pnpm workspace.
# Select the package to build via --build-arg PACKAGE_NAME:
#
#   docker build --build-arg PACKAGE_NAME=@kieksme/swetrix-statistics-mcp \
#     -t ghcr.io/kieksme/swetrix-statistics-mcp:latest .
#
# Runs the built server via its "start" script. Set MCP_HTTP_AUTH_TOKEN to
# switch the entrypoint from stdio to a bearer-authed streamable-HTTP server
# on $PORT (default 3000) — see packages/*/src/index.ts.

FROM node:20-alpine AS build
ARG PACKAGE_NAME
WORKDIR /app
# Root package.json has no "packageManager" field (only the workspace packages
# do), so a bare `corepack enable` would resolve to latest pnpm instead of the
# version this workspace is tested against — pin it explicitly.
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY packages/swetrix-statistics-mcp-server/package.json packages/swetrix-statistics-mcp-server/package.json
COPY packages/swetrix-events-mcp-server/package.json packages/swetrix-events-mcp-server/package.json
COPY packages/swetrix-admin-mcp-server/package.json packages/swetrix-admin-mcp-server/package.json
RUN pnpm install --frozen-lockfile

COPY packages ./packages
RUN pnpm --filter "${PACKAGE_NAME}" build
# --legacy: none of these packages depend on sibling workspace packages, so
# pnpm's workspace-package-injection deploy mode (the v10 default) isn't
# needed here.
RUN pnpm --filter "${PACKAGE_NAME}" deploy --prod --legacy /deploy

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /deploy .
EXPOSE 3000
CMD ["node", "dist/index.js"]
