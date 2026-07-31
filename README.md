# mcp-swetrix

MCP (Model Context Protocol) servers for the [Swetrix](https://swetrix.com) analytics platform. Lets AI assistants like Claude query analytics data, track events, and manage projects directly via the Swetrix API.

[![CI](https://github.com/kieksme/mcp-swetrix/actions/workflows/ci.yml/badge.svg)](https://github.com/kieksme/mcp-swetrix/actions/workflows/ci.yml)

## Packages

| Package | Version | Security | Description |
|---|---|---|---|
| [`@kieksme/swetrix-statistics-mcp`](packages/swetrix-statistics-mcp-server) | [![npm](https://img.shields.io/npm/v/@kieksme/swetrix-statistics-mcp)](https://www.npmjs.com/package/@kieksme/swetrix-statistics-mcp) | [![Socket](https://socket.dev/api/badge/npm/package/@kieksme/swetrix-statistics-mcp)](https://socket.dev/npm/package/@kieksme/swetrix-statistics-mcp) | 34 read-only tools for traffic, performance, errors, funnels, goals and more |
| [`@kieksme/swetrix-events-mcp`](packages/swetrix-events-mcp-server) | [![npm](https://img.shields.io/npm/v/@kieksme/swetrix-events-mcp)](https://www.npmjs.com/package/@kieksme/swetrix-events-mcp) | [![Socket](https://socket.dev/api/badge/npm/package/@kieksme/swetrix-events-mcp)](https://socket.dev/npm/package/@kieksme/swetrix-events-mcp) | 5 tools for tracking pageviews, custom events, heartbeats, errors and revenue |
| [`@kieksme/swetrix-admin-mcp`](packages/swetrix-admin-mcp-server) | [![npm](https://img.shields.io/npm/v/@kieksme/swetrix-admin-mcp)](https://www.npmjs.com/package/@kieksme/swetrix-admin-mcp) | [![Socket](https://socket.dev/api/badge/npm/package/@kieksme/swetrix-admin-mcp)](https://socket.dev/npm/package/@kieksme/swetrix-admin-mcp) | 34 tools for managing projects, funnels, annotations, views and organisations |

## Quick start

Each package can be used standalone. Pick the one(s) you need.

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "swetrix-statistics": {
      "command": "npx",
      "args": ["-y", "@kieksme/swetrix-statistics-mcp"],
      "env": {
        "SWETRIX_API_KEY": "your-api-key",
        "SWETRIX_API_BASE_URL": "https://analytics.example.com"
      }
    },
    "swetrix-events": {
      "command": "npx",
      "args": ["-y", "@kieksme/swetrix-events-mcp"]
    },
    "swetrix-admin": {
      "command": "npx",
      "args": ["-y", "@kieksme/swetrix-admin-mcp"],
      "env": {
        "SWETRIX_API_KEY": "your-api-key",
        "SWETRIX_API_BASE_URL": "https://analytics.example.com"
      }
    }
  }
}
```

Get your API key at [swetrix.com](https://swetrix.com) → Account Settings → API keys.

### Claude Code

```bash
claude mcp add swetrix-statistics -e SWETRIX_API_KEY=your-key -e SWETRIX_API_BASE_URL=https://analytics.example.com -- npx -y @kieksme/swetrix-statistics-mcp
claude mcp add swetrix-events -e SWETRIX_API_BASE_URL=https://analytics.example.com -- npx -y @kieksme/swetrix-events-mcp
claude mcp add swetrix-admin -e SWETRIX_API_KEY=your-key -e SWETRIX_API_BASE_URL=https://analytics.example.com -- npx -y @kieksme/swetrix-admin-mcp
```

## Self-hosted Swetrix / custom API URL

All packages support an optional `SWETRIX_API_BASE_URL` environment variable.

- Default: `https://api.swetrix.com`
- Self-hosted: set it to your Swetrix API origin, for example `https://analytics.example.com`

When omitted, the servers continue using the public Swetrix Cloud API.

## Remote MCP via Docker

Each package can also run as a standalone **remote MCP server** instead of a local `stdio` process spawned by `npx`. In this mode the server speaks the MCP [Streamable HTTP](https://modelcontextprotocol.io/docs/concepts/transports#streamable-http) transport over a plain HTTP endpoint (`/mcp` by default) — this is exactly what the `Dockerfile` shipped with each package builds and runs. Use it when you want to:

- host one server centrally so multiple clients/teammates can connect to it,
- run the MCP server in your own infrastructure (Kubernetes, ECS, Cloud Run, a VM, …) instead of on every developer machine,
- keep `SWETRIX_API_KEY` on the server side instead of distributing it to every client.

### Build and run a single package

```bash
# Build context is the repository root (this is a pnpm workspace)
docker build -f packages/swetrix-statistics-mcp-server/Dockerfile -t swetrix-statistics-mcp:http .

docker run -d --name swetrix-statistics-mcp \
  -p 3000:3000 \
  -e SWETRIX_API_KEY=your-key \
  -e SWETRIX_API_BASE_URL=https://analytics.example.com \
  -e MCP_HTTP_AUTH_TOKEN="$(openssl rand -hex 32)" \
  swetrix-statistics-mcp:http
```

The same pattern applies to `swetrix-events-mcp-server` and `swetrix-admin-mcp-server` — swap the `-f`/`-t` paths. See each package's README for package-specific env vars: [statistics](packages/swetrix-statistics-mcp-server/README.md#docker), [events](packages/swetrix-events-mcp-server/README.md#docker), [admin](packages/swetrix-admin-mcp-server/README.md#docker).

### One-click deploy (Railway)

| Package | Deploy |
|---|---|
| Statistics | [![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/imqlm6?referralCode=2_sIT9&utm_medium=integration&utm_source=template&utm_campaign=generic) |
| Events | [![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/-iWk9J?referralCode=2_sIT9&utm_medium=integration&utm_source=template&utm_campaign=generic) |
| Admin | [![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/Eu1l6d?referralCode=2_sIT9&utm_medium=integration&utm_source=template&utm_campaign=generic) |

Each button provisions a Railway service from this repo's Dockerfile in HTTP mode. You'll be prompted for `SWETRIX_API_KEY` where required; `MCP_HTTP_AUTH_TOKEN` is generated automatically. Set `SWETRIX_API_BASE_URL` on the service afterwards if you're using a self-hosted Swetrix instance.

### Pre-built images

Images are published to the GitHub Container Registry on every release, tagged with the released package version and `latest`:

```bash
docker pull ghcr.io/kieksme/swetrix-statistics-mcp:latest
docker pull ghcr.io/kieksme/swetrix-events-mcp:latest
docker pull ghcr.io/kieksme/swetrix-admin-mcp:latest
```

### Running all three together with Docker Compose

```yaml
services:
  swetrix-statistics:
    image: ghcr.io/kieksme/swetrix-statistics-mcp:latest
    ports: ["3001:3000"]
    environment:
      SWETRIX_API_KEY: ${SWETRIX_API_KEY}
      SWETRIX_API_BASE_URL: ${SWETRIX_API_BASE_URL}
      MCP_HTTP_AUTH_TOKEN: ${MCP_HTTP_AUTH_TOKEN}
    restart: unless-stopped

  swetrix-events:
    image: ghcr.io/kieksme/swetrix-events-mcp:latest
    ports: ["3002:3000"]
    environment:
      MCP_HTTP_AUTH_TOKEN: ${MCP_HTTP_AUTH_TOKEN}
    restart: unless-stopped

  swetrix-admin:
    image: ghcr.io/kieksme/swetrix-admin-mcp:latest
    ports: ["3003:3000"]
    environment:
      SWETRIX_API_KEY: ${SWETRIX_API_KEY}
      SWETRIX_API_BASE_URL: ${SWETRIX_API_BASE_URL}
      MCP_HTTP_AUTH_TOKEN: ${MCP_HTTP_AUTH_TOKEN}
    restart: unless-stopped
```

Provide `SWETRIX_API_KEY`, `SWETRIX_API_BASE_URL` and `MCP_HTTP_AUTH_TOKEN` via a local, git-ignored `.env` file or your secrets manager — never commit real values.

### Connecting a client to the remote server

Once the container is reachable at a URL (behind your own TLS-terminating reverse proxy — see security notes below), point a client at it instead of using `command`/`args`:

**Claude Code CLI:**

```bash
claude mcp add --transport http swetrix-statistics https://mcp.example.com/mcp \
  --header "Authorization: Bearer <MCP_HTTP_AUTH_TOKEN>"
```

**Claude Desktop / `.mcp.json`:**

```json
{
  "mcpServers": {
    "swetrix-statistics": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "headers": {
        "Authorization": "Bearer <MCP_HTTP_AUTH_TOKEN>"
      }
    }
  }
}
```

### Security notes

- The container listens on plain HTTP — always terminate TLS in front of it (reverse proxy, load balancer, or ingress) before exposing it beyond `localhost`.
- `MCP_HTTP_AUTH_TOKEN` is the only thing standing between the internet and your Swetrix data/API key. Generate it with `openssl rand -hex 32` (or your secrets manager's generator), and rotate it if it is ever leaked.
- Keep `SWETRIX_API_KEY` and `MCP_HTTP_AUTH_TOKEN` out of image layers and shell history — inject them at runtime via `--env-file`, orchestrator secrets, or a secrets manager (e.g. AWS Secrets Manager, GCP Secret Manager, Kubernetes `Secret`).
- Apply least privilege: scope the Swetrix API key to only what each server needs, especially for `swetrix-admin-mcp`, which performs write operations.

## Contributing

For development setup and contribution workflow, see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

GPL-3.0-only — see [LICENSE](LICENSE)
