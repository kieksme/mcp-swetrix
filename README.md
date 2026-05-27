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

## Contributing

For development setup and contribution workflow, see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

GPL-3.0-only — see [LICENSE](LICENSE)
