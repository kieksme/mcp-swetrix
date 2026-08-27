# @kieksme/swetrix-events-mcp

MCP server for the [Swetrix Events API](https://swetrix.com/docs/events-api) — 5 tools for tracking pageviews, custom events, heartbeats, errors, and revenue from AI assistants.

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=swetrix-events&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBraWVrc21lL3N3ZXRyaXgtZXZlbnRzLW1jcCJdLCJlbnYiOnsiU1dFVFJJWF9BUElfQkFTRV9VUkwiOiJodHRwczovL2FuYWx5dGljcy5leGFtcGxlLmNvbSJ9fQ%3D%3D)
[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:mcp/install?%7B%22name%22%3A%22swetrix-events%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40kieksme%2Fswetrix-events-mcp%22%5D%2C%22env%22%3A%7B%22SWETRIX_API_BASE_URL%22%3A%22https%3A%2F%2Fanalytics.example.com%22%7D%7D)

## Installation

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "swetrix-events": {
      "command": "npx",
      "args": ["-y", "@kieksme/swetrix-events-mcp"],
      "env": {
        "SWETRIX_API_BASE_URL": "https://analytics.example.com"
      }
    }
  }
}
```

For revenue tracking, add your API key:

```json
{
  "mcpServers": {
    "swetrix-events": {
      "command": "npx",
      "args": ["-y", "@kieksme/swetrix-events-mcp"],
      "env": {
        "SWETRIX_API_KEY": "your-api-key",
        "SWETRIX_API_BASE_URL": "https://analytics.example.com"
      }
    }
  }
}
```

### Claude Code

```bash
# Without revenue tracking
claude mcp add swetrix-events -e SWETRIX_API_BASE_URL=https://analytics.example.com -- npx -y @kieksme/swetrix-events-mcp

# With revenue tracking
claude mcp add swetrix-events -e SWETRIX_API_KEY=your-key -e SWETRIX_API_BASE_URL=https://analytics.example.com -- npx -y @kieksme/swetrix-events-mcp
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `SWETRIX_API_KEY` | Only for `swetrix_track_revenue` | Your Swetrix API key |
| `SWETRIX_API_BASE_URL` | No | Custom API base URL for self-hosted Swetrix (default: `https://api.swetrix.com`) |

Most tools only need the project ID (`pid`), not an API key.

## HTTP transport

By default the server communicates over stdio, as used above. It can instead
be run as a standalone HTTP server speaking the MCP [Streamable HTTP](https://modelcontextprotocol.io/docs/concepts/transports#streamable-http)
transport — useful for remote/containerized deployments.

| Variable | Required | Description |
|---|---|---|
| `MCP_TRANSPORT` | No | Set to `http` to enable the HTTP transport (default: `stdio`) |
| `PORT` | No | Port to listen on in HTTP mode (default: `3000`) |
| `MCP_HTTP_ENDPOINT` | No | Path the server listens on in HTTP mode (default: `/mcp`) |
| `MCP_HTTP_AUTH_TOKEN` | Yes, in HTTP mode | Bearer token clients must send; the server refuses to start without it |

```bash
MCP_TRANSPORT=http PORT=3000 MCP_HTTP_AUTH_TOKEN=change-me node dist/index.js
```

Every request must include `Authorization: Bearer <MCP_HTTP_AUTH_TOKEN>`; requests without a valid token receive `401 Unauthorized`.

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Authorization: Bearer change-me" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"0.0.0"}}}'
```

### Docker

```bash
docker build -f packages/swetrix-events-mcp-server/Dockerfile -t swetrix-events-mcp:http .
docker run --rm -p 3000:3000 \
  -e MCP_HTTP_AUTH_TOKEN=change-me \
  swetrix-events-mcp:http
```

Note: the build context is the repository root (this is a pnpm workspace).

Pre-built images are also published to the GitHub Container Registry on every
release, tagged with the released package version and `latest`:

```bash
docker pull ghcr.io/kieksme/swetrix-events-mcp:latest
```

### Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/swetrix-events-mcp?referralCode=2_sIT9&utm_medium=integration&utm_source=template&utm_campaign=generic)

Deploys this package as a Streamable HTTP server. `MCP_HTTP_AUTH_TOKEN` is generated automatically; `SWETRIX_API_KEY` is optional and only needed for the revenue-tracking tool.

## Tools

| Tool | Auth required | Description |
|---|---|---|
| `swetrix_track_pageview` | No | Record a pageview with URL, referrer, user agent, and geo data |
| `swetrix_track_custom_event` | No | Track a named custom event with optional metadata properties |
| `swetrix_track_heartbeat` | No | Send a heartbeat to keep a session alive |
| `swetrix_track_error` | No | Report a JavaScript or application error with optional stack trace |
| `swetrix_track_revenue` | Yes (`SWETRIX_API_KEY`) | Track a revenue event with amount and currency |

## Example prompts

- "Track a pageview for project `abc123` on the `/checkout` page."
- "Send a custom event `signup_completed` with plan=`pro` to project `abc123`."
- "Log an error: `TypeError: Cannot read property 'id' of undefined` from `/app/cart.js`."
- "Record a revenue event of 49.99 USD for project `abc123`."

## License

GPL-3.0-only — see [LICENSE](../../LICENSE)
