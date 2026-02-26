# MCP Integration - Quick Start

## What is MCP?

MCP (Model Context Protocol) is a protocol that allows AI tools to interact with your application through a standardized interface. This project now has an MCP server that exposes database, cache, and file operations.

## Starting the MCP Server

```bash
# Terminal 1: Start the MCP server
bun run mcp:start

# Terminal 2: Keep the API running (optional)
bun run dev
```

The MCP server will:
- Connect to PostgreSQL
- Connect to Redis
- Connect to ImageKit
- Expose 20+ tools via stdio transport

## Available Tools

All tools are documented in [MCP_SPEC.md](./MCP_SPEC.md).

### Database Tools (Read-only for now)
- `db_get_all_pegawai` - Get employees
- `db_get_all_kelompok_nelayan` - Get fisherman groups
- `db_get_all_bantuan` - Get assistance records
- And more...

### Cache Tools
- `cache_get` - Retrieve cached values
- `cache_set` - Store values in Redis
- `cache_delete` - Remove cache entries
- `cache_keys_by_pattern` - Search cache keys

### File Tools
- `file_upload` - Upload to ImageKit
- `file_delete` - Delete from ImageKit
- `file_list` - List files in folder

### Activity Logging
- `log_activity` - Log audit trail events

## Using MCP with Claude/Other AI Models

### Claude API (Python)
```python
from anthropic import Anthropic

# Start MCP server first: bun run mcp:start
client = Anthropic()

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=[...],  # Auto-discover from MCP
    messages=[
        {"role": "user", "content": "How many employees are in organization 5?"}
    ]
)
```

### With Claude CLI
```bash
# Add to your claude.json config:
{
  "mcp_servers": {
    "poc-mandiri": {
      "command": "bun",
      "args": ["run", "src/mcp/server.ts"],
      "cwd": "/path/to/poc-mandiri"
    }
  }
}
```

## Environment Setup

Ensure these env vars are set:

```env
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# ImageKit (for file uploads)
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
```

## Architecture

```
MCP Server (src/mcp/server.ts)
├── Database Tools (src/mcp/tools/database.ts)
│   └── Uses existing repositories
├── Cache Tools (src/mcp/tools/cache.ts)
│   └── Redis operations
├── File Tools (src/mcp/tools/file.ts)
│   └── ImageKit integration
└── Activity Tools (src/mcp/tools/activity.ts)
    └── Audit logging
```

## Next Steps

1. ✅ MCP server created and running
2. ✅ Database tools exposed (20+ read operations)
3. ✅ Cache tools exposed
4. ✅ File tools exposed
5. ⏳ TODO: Add write/mutation tools (create/update/delete)
6. ⏳ TODO: Implement resource definitions
7. ⏳ TODO: Add batch query support

## Troubleshooting

**"Redis not connected" error:**
- Ensure `REDIS_URL` is set and Redis server is running
- Server continues without Redis, but cache tools will fail

**"Database connection failed" error:**
- Check `DATABASE_URL` and database accessibility
- Run `bun run db:migrate` to ensure schema is up-to-date

**"ImageKit upload failed" error:**
- Verify `IMAGEKIT_*` env vars are set correctly
- Check file encoding (must be Base64)

## Resources

- [MCP Specification](./MCP_SPEC.md) - Full tool documentation
- [MCP SDK Docs](https://modelcontextprotocol.io/)
- [Claude API Docs](https://docs.anthropic.com/)
