# mcp-swetrix

MCP (Model Context Protocol) servers for the [Swetrix](https://swetrix.com) analytics platform. Lets AI assistants like Claude query analytics data, track events, and manage projects directly via the Swetrix API.

## Packages

| Package | Version | Description |
|---|---|---|
| [`@kieksme/swetrix-statistics-mcp`](packages/swetrix-statistics-mcp-server) | [![npm](https://img.shields.io/npm/v/@kieksme/swetrix-statistics-mcp)](https://www.npmjs.com/package/@kieksme/swetrix-statistics-mcp) | 34 read-only tools for traffic, performance, errors, funnels, goals and more |
| [`@kieksme/swetrix-events-mcp`](packages/swetrix-events-mcp-server) | [![npm](https://img.shields.io/npm/v/@kieksme/swetrix-events-mcp)](https://www.npmjs.com/package/@kieksme/swetrix-events-mcp) | 5 tools for tracking pageviews, custom events, heartbeats, errors and revenue |
| [`@kieksme/swetrix-admin-mcp`](packages/swetrix-admin-mcp-server) | [![npm](https://img.shields.io/npm/v/@kieksme/swetrix-admin-mcp)](https://www.npmjs.com/package/@kieksme/swetrix-admin-mcp) | 34 tools for managing projects, funnels, annotations, views and organisations |

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
        "SWETRIX_API_KEY": "your-api-key"
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
        "SWETRIX_API_KEY": "your-api-key"
      }
    }
  }
}
```

Get your API key at [swetrix.com](https://swetrix.com) → Account Settings → API keys.

### Claude Code

```bash
claude mcp add swetrix-statistics -e SWETRIX_API_KEY=your-key -- npx -y @kieksme/swetrix-statistics-mcp
claude mcp add swetrix-events -- npx -y @kieksme/swetrix-events-mcp
claude mcp add swetrix-admin -e SWETRIX_API_KEY=your-key -- npx -y @kieksme/swetrix-admin-mcp
```

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

Requires Node ≥ 20 and pnpm 10.

## Contributing

This project uses **trunk-based development** with [Release Please](https://github.com/googleapis/release-please) for automated versioning. See [AGENTS.md](AGENTS.md) for contribution guidelines and commit conventions.

## License

GPL-3.0-only — see [LICENSE](LICENSE)
