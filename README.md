# mcp-swetrix

MCP (Model Context Protocol) servers for the [Swetrix](https://swetrix.com) analytics platform. Lets AI assistants like Claude query analytics data, track events, and manage projects directly via the Swetrix API.

## Packages

| Package | Version | Description |
|---|---|---|
| [`@kieksme/mcp-swetrix-statistics`](packages/swetrix-statistics-mcp-server) | [![npm](https://img.shields.io/npm/v/@kieksme/mcp-swetrix-statistics)](https://www.npmjs.com/package/@kieksme/mcp-swetrix-statistics) | 34 read-only tools for traffic, performance, errors, funnels, goals and more |
| [`@kieksme/mcp-swetrix-events`](packages/swetrix-events-mcp-server) | [![npm](https://img.shields.io/npm/v/@kieksme/mcp-swetrix-events)](https://www.npmjs.com/package/@kieksme/mcp-swetrix-events) | 5 tools for tracking pageviews, custom events, heartbeats, errors and revenue |
| [`@kieksme/mcp-swetrix-admin`](packages/swetrix-admin-mcp-server) | [![npm](https://img.shields.io/npm/v/@kieksme/mcp-swetrix-admin)](https://www.npmjs.com/package/@kieksme/mcp-swetrix-admin) | 34 tools for managing projects, funnels, annotations, views and organisations |

## Quick start

Each package can be used standalone. Pick the one(s) you need.

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "swetrix-statistics": {
      "command": "npx",
      "args": ["-y", "@kieksme/mcp-swetrix-statistics"],
      "env": {
        "SWETRIX_API_KEY": "your-api-key"
      }
    },
    "swetrix-events": {
      "command": "npx",
      "args": ["-y", "@kieksme/mcp-swetrix-events"]
    },
    "swetrix-admin": {
      "command": "npx",
      "args": ["-y", "@kieksme/mcp-swetrix-admin"],
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
claude mcp add swetrix-statistics -e SWETRIX_API_KEY=your-key -- npx -y @kieksme/mcp-swetrix-statistics
claude mcp add swetrix-events -- npx -y @kieksme/mcp-swetrix-events
claude mcp add swetrix-admin -e SWETRIX_API_KEY=your-key -- npx -y @kieksme/mcp-swetrix-admin
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
