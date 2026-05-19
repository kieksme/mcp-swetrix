# @kieksme/mcp-swetrix-statistics

MCP server for the [Swetrix Statistics API](https://swetrix.com/docs/statistics-api) — 34 read-only tools for querying traffic, performance, errors, funnels, goals, and more.

## Installation

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
    }
  }
}
```

### Claude Code

```bash
claude mcp add swetrix-statistics -e SWETRIX_API_KEY=your-key -- npx -y @kieksme/mcp-swetrix-statistics
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `SWETRIX_API_KEY` | Yes | Your Swetrix API key (Account Settings → API keys) |

## Tools

### Traffic

| Tool | Description |
|---|---|
| `swetrix_get_traffic` | Aggregated traffic analytics (dashboard view): visitors, pageviews, bounce rate, session duration |
| `swetrix_get_traffic_chart` | Time-series traffic chart data for a given period and interval |
| `swetrix_get_sessions` | Paginated list of individual sessions with geo and device info |
| `swetrix_get_session_detail` | Full event log for a single session |
| `swetrix_get_live_visitors` | Current live visitor count |
| `swetrix_get_birdseye` | Birdseye overview: top pages, countries, referrers, devices |

### Performance

| Tool | Description |
|---|---|
| `swetrix_get_performance` | Web Vitals and performance metrics (LCP, FID, CLS, TTFB, etc.) |
| `swetrix_get_performance_chart` | Time-series performance chart |
| `swetrix_get_performance_birdseye` | Performance breakdown by page, country, browser, device |

### Errors

| Tool | Description |
|---|---|
| `swetrix_get_errors` | Paginated list of error groups |
| `swetrix_get_error_detail` | Full detail for a specific error including stack trace |
| `swetrix_get_error_overview` | Error trend chart over time |
| `swetrix_get_error_sessions` | Sessions in which a specific error occurred |
| `swetrix_get_errors_filters` | Available filter values for error queries |

### Custom Events

| Tool | Description |
|---|---|
| `swetrix_get_event_meta` | Metadata keys and values for a specific custom event |
| `swetrix_get_property` | Aggregated stats for a custom event property |
| `swetrix_get_custom_events` | All custom events with counts and trends |
| `swetrix_get_heartbeats` | Heartbeat event data |
| `swetrix_get_keywords` | Search keyword referrals |

### Funnels

| Tool | Description |
|---|---|
| `swetrix_get_funnel` | Conversion funnel with per-step visitor and drop-off counts |
| `swetrix_get_funnel_sessions` | Sessions that entered a specific funnel |
| `swetrix_get_user_flow` | User flow / Sankey diagram data between pages |

### Goals

| Tool | Description |
|---|---|
| `swetrix_get_goal_stats` | Conversion statistics for a goal (rate, trend, total) |
| `swetrix_get_goal_chart` | Goal conversion chart over time |
| `swetrix_get_feature_flag_stats` | Feature flag exposure and conversion stats |
| `swetrix_get_feature_flag_profiles` | Visitor profiles that saw a feature flag |
| `swetrix_get_captcha` | CAPTCHA solve statistics |

### Visitor Profiles

| Tool | Description |
|---|---|
| `swetrix_get_profiles` | Paginated list of visitor profiles |
| `swetrix_get_profile_detail` | Full profile for a single visitor |
| `swetrix_get_profile_sessions` | All sessions for a specific visitor profile |

### Filters

| Tool | Description |
|---|---|
| `swetrix_get_filters` | Available values for a filter dimension (browser, country, OS, etc.) |
| `swetrix_get_filter_versions` | Browser or OS version values for a given filter column |

## Example prompts

- "Show me the traffic for project `abc123` over the last 7 days."
- "What are the top 5 error groups in my project this month?"
- "How is the checkout funnel performing — where are users dropping off?"
- "What's the current live visitor count for project `abc123`?"

## License

MIT
