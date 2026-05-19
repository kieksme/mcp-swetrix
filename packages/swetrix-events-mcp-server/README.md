# @kieksme/mcp-swetrix-events

MCP server for the [Swetrix Events API](https://swetrix.com/docs/events-api) — 5 tools for tracking pageviews, custom events, heartbeats, errors, and revenue from AI assistants.

## Installation

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "swetrix-events": {
      "command": "npx",
      "args": ["-y", "@kieksme/mcp-swetrix-events"]
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
      "args": ["-y", "@kieksme/mcp-swetrix-events"],
      "env": {
        "SWETRIX_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Claude Code

```bash
# Without revenue tracking
claude mcp add swetrix-events -- npx -y @kieksme/mcp-swetrix-events

# With revenue tracking
claude mcp add swetrix-events -e SWETRIX_API_KEY=your-key -- npx -y @kieksme/mcp-swetrix-events
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `SWETRIX_API_KEY` | Only for `swetrix_track_revenue` | Your Swetrix API key |

Most tools only need the project ID (`pid`), not an API key.

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
