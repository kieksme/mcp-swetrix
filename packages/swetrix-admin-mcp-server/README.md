# @kieksme/mcp-swetrix-admin

MCP server for the [Swetrix Admin API](https://swetrix.com/docs/admin-api) — 34 tools for managing projects, funnels, annotations, views, and organisations.

> **Note:** All tools require a valid `SWETRIX_API_KEY`. This server performs write operations — use with care.

## Installation

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
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

### Claude Code

```bash
claude mcp add swetrix-admin -e SWETRIX_API_KEY=your-key -- npx -y @kieksme/mcp-swetrix-admin
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `SWETRIX_API_KEY` | Yes | Your Swetrix API key (Account Settings → API keys) |

## Tools

### Projects

| Tool | Description |
|---|---|
| `swetrix_list_projects` | List all projects for the authenticated user |
| `swetrix_get_project` | Get details for a single project |
| `swetrix_create_project` | Create a new project |
| `swetrix_update_project` | Update project name, settings, or configuration |
| `swetrix_delete_project` | Delete a project permanently |
| `swetrix_pin_project` | Pin a project to the top of the dashboard |
| `swetrix_unpin_project` | Unpin a project |
| `swetrix_assign_project_org` | Assign a project to an organisation |

### Funnels

| Tool | Description |
|---|---|
| `swetrix_list_funnels` | List all funnels for a project |
| `swetrix_create_funnel` | Create a new conversion funnel with ordered steps |
| `swetrix_update_funnel` | Update funnel name or steps |
| `swetrix_delete_funnel` | Delete a funnel |

### Annotations

| Tool | Description |
|---|---|
| `swetrix_list_annotations` | List all annotations for a project |
| `swetrix_create_annotation` | Add a dated annotation to the traffic timeline |
| `swetrix_update_annotation` | Edit an annotation's text or date |
| `swetrix_delete_annotation` | Delete an annotation |

### Views

| Tool | Description |
|---|---|
| `swetrix_list_views` | List saved dashboard views for a project |
| `swetrix_get_view` | Get a specific saved view |
| `swetrix_create_view` | Create a new saved view with filters and settings |
| `swetrix_update_view` | Update a saved view |
| `swetrix_delete_view` | Delete a saved view |

### Organisations

| Tool | Description |
|---|---|
| `swetrix_list_organisations` | List all organisations the user belongs to |
| `swetrix_get_organisation` | Get details for a specific organisation |
| `swetrix_create_organisation` | Create a new organisation |
| `swetrix_update_organisation` | Update organisation name or settings |
| `swetrix_delete_organisation` | Delete an organisation |
| `swetrix_invite_org_member` | Invite a user to an organisation by email |
| `swetrix_update_org_member` | Change a member's role within the organisation |
| `swetrix_remove_org_member` | Remove a member from an organisation |

## Example prompts

- "List all my Swetrix projects."
- "Create a new project called `Marketing Site`."
- "Add a funnel for the checkout flow: `/cart` → `/checkout` → `/thank-you`."
- "Annotate project `abc123` on 2025-01-15 with `Launched new homepage`."
- "Invite `user@example.com` to organisation `my-org` as a viewer."

## License

GPL-3.0-only — see [LICENSE](../../LICENSE)
