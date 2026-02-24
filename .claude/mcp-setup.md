# MCP Server Setup for POC Mandiri

This project is configured with two Model Context Protocol (MCP) servers to enhance development experience:

## PostgreSQL MCP Server

Enables direct database querying, schema inspection, and migration validation.

**When to use:**
- Inspecting table schemas and constraints
- Validating Drizzle migrations before running
- Running ad-hoc queries to verify data
- Understanding current database state

**Prerequisites:**
- `DATABASE_URL` environment variable set correctly
- PostgreSQL driver accessible via MCP server

**Usage:**
- Ask questions about tables, relationships, or data
- Request schema dumps for specific tables
- Run SELECT queries to inspect data

## Redis MCP Server

Enables Redis key inspection, cache management, and debugging.

**When to use:**
- Viewing cached data during development
- Clearing specific cache keys
- Inspecting cache structure and TTLs
- Debugging cache-related issues

**Prerequisites:**
- `REDIS_URL` environment variable set correctly
- Redis instance running and accessible

**Usage:**
- Query keys matching patterns
- Inspect cache values and expiration times
- Monitor cache hit rates

## Configuration

Both servers are defined in `.github/mcp.json` and automatically loaded by compatible Copilot/Claude sessions.

### Manual Setup (if auto-loading doesn't work)

Add to your IDE's MCP configuration:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "PG_CONNECTION_STRING": "your-database-url-here"
      }
    },
    "redis": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-redis"],
      "env": {
        "REDIS_URL": "your-redis-url-here"
      }
    }
  }
}
```

## Environment Requirements

Ensure these variables are set in `.env` or your terminal before using MCP servers:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/mandiri
REDIS_URL=redis://localhost:6379
```

Without these, the MCP servers cannot connect to their respective services.
