# syntax=docker/dockerfile:1
#
# Build context must be the repository root, e.g.:
#   docker build -f packages/swetrix-statistics-mcp-server/Dockerfile -t swetrix-statistics-mcp:http .
#
# Starts the @kieksme/swetrix-statistics-mcp server in Streamable HTTP mode
# (endpoint /mcp, port 3000). Requires SWETRIX_API_KEY and MCP_HTTP_AUTH_TOKEN
# to be provided at runtime (see the package README).

FROM node:24-alpine AS builder
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @kieksme/swetrix-statistics-mcp build
RUN pnpm --filter @kieksme/swetrix-statistics-mcp deploy --prod --legacy /app

FROM node:24-alpine AS runtime
ENV NODE_ENV=production \
    MCP_TRANSPORT=http \
    PORT=3000 \
    MCP_HTTP_ENDPOINT=/mcp

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
