# Swetrix hosted pilot

This runbook describes the smallest useful hosted pilot for the Swetrix MCP
servers. It deliberately starts with one Statistics deployment for one
customer or internal account.

## Pilot scope

- Package: `@kieksme/swetrix-statistics-mcp`
- Transport: Streamable HTTP at `/mcp`
- Health check: unauthenticated `GET /health`
- Authentication: one randomly generated `MCP_HTTP_AUTH_TOKEN`
- Swetrix access: one least-privilege `SWETRIX_API_KEY`
- Billing: manual pilot invoicing or a private beta; no billing logic is in
  this repository yet

The Events and Admin packages already support the same HTTP and Docker model,
but should remain separate deployments. Do not put an Admin API key behind a
shared public endpoint until customer isolation and audit logging exist.

## Deploy

Use the Statistics Railway template or build the Docker image from the
repository root:

```bash
docker build -f packages/swetrix-statistics-mcp-server/Dockerfile \
  -t swetrix-statistics-mcp:pilot .
```

Configure these runtime secrets in the hosting provider, never in the image or
repository:

| Variable | Value |
|---|---|
| `SWETRIX_API_KEY` | A dedicated, least-privilege Swetrix API key |
| `MCP_HTTP_AUTH_TOKEN` | A long random bearer token |
| `MCP_TRANSPORT` | `http` |
| `PORT` | Provider-provided port, normally `3000` |
| `MCP_HTTP_ENDPOINT` | `/mcp` |
| `SWETRIX_API_BASE_URL` | Omit for Swetrix Cloud; set for self-hosted Swetrix |

Configure the provider probe as:

```text
Path: /health
Method: GET
Expected status: 200
```

The health endpoint returns `{"status":"ok"}` without authentication. The
MCP endpoint still requires `Authorization: Bearer <MCP_HTTP_AUTH_TOKEN>`.

## Customer smoke test

Before inviting a customer, verify the deployment from outside the provider's
network:

```bash
curl -fsS https://mcp.example.com/health

curl -sS https://mcp.example.com/mcp \
  -H "Authorization: Bearer $MCP_HTTP_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"pilot-check","version":"0.0.0"}}}'
```

## Before charging multiple customers

The current HTTP token is deployment-wide. A production multi-tenant service
needs a control plane that maps each customer account to its own Swetrix API
key, authenticates marketplace purchases, applies quotas, and records audit
events without logging secrets or analytics responses. Add that layer before
sharing one endpoint across unrelated customers.
