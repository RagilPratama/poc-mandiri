# MCP Server Specification - POC Mandiri

## Overview

The MCP (Model Context Protocol) server for POC Mandiri exposes database, cache, and file operations as tools for AI integration.

**Server Details:**
- **Name:** `poc-mandiri-mcp`
- **Version:** 1.0.0
- **Transport:** Stdio (stdout/stderr for communication)
- **Language:** TypeScript (compiled and run via Bun)

## Running the Server

```bash
# Development
bun run mcp:start

# With debug logs (optional)
MCP_DEBUG=true bun run mcp:start
```

The server will connect to:
- PostgreSQL (via `DATABASE_URL`)
- Redis (via `REDIS_URL`)
- ImageKit (via `IMAGEKIT_*` env vars)

## Available Tools

### 1. Database Query Tools

#### `db_get_all_pegawai`
Get all employees with pagination and filtering.

**Input Schema:**
```json
{
  "page": 1,
  "perPage": 10,
  "search": "john",
  "organisasiId": 5
}
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 42
  }
}
```

---

#### `db_get_pegawai_by_id`
Get employee details by ID.

**Input Schema:**
```json
{
  "id": 123
}
```

---

#### `db_get_all_kelompok_nelayan`
Get all fisherman groups with pagination and filtering.

**Input Schema:**
```json
{
  "page": 1,
  "perPage": 10,
  "search": "group name",
  "provinsiId": 11,
  "uptId": 2
}
```

---

#### `db_get_kelompok_nelayan_by_id`
Get fisherman group details by ID (includes related UPT, province, penyuluh, pegawai).

**Input Schema:**
```json
{
  "id": 456
}
```

---

#### `db_get_all_penyuluh`
Get all extension agents.

**Input Schema:**
```json
{
  "page": 1,
  "perPage": 10,
  "search": "agent name"
}
```

---

#### `db_get_all_bantuan`
Get all assistance records.

**Input Schema:**
```json
{
  "page": 1,
  "perPage": 10,
  "kelompokNelayanId": 456,
  "statusPenyaluran": "TERSALUR"
}
```

---

#### `db_get_all_pelatihan`
Get all training programs.

**Input Schema:**
```json
{
  "page": 1,
  "perPage": 10,
  "statusPelatihan": "SELESAI"
}
```

---

#### `db_get_all_absensi`
Get all attendance records.

**Input Schema:**
```json
{
  "page": 1,
  "perPage": 10,
  "nipPegawai": "19870101199203001"
}
```

---

#### `db_get_all_provinces`
Get all provinces (reference data).

**Input Schema:**
```json
{}
```

---

#### `db_get_regencies_by_province`
Get all regencies for a specific province.

**Input Schema:**
```json
{
  "provinsiId": 11
}
```

---

### 2. Cache Tools

#### `cache_get`
Get a value from Redis by key.

**Input Schema:**
```json
{
  "key": "province:all"
}
```

**Response:**
```json
{
  "key": "province:all",
  "value": [...],
  "found": true
}
```

---

#### `cache_set`
Set a value in Redis with optional TTL.

**Input Schema:**
```json
{
  "key": "custom:data",
  "value": "{\"data\": [1,2,3]}",
  "ttlSeconds": 3600
}
```

**Response:**
```json
{
  "key": "custom:data",
  "set": true,
  "ttlSeconds": 3600
}
```

---

#### `cache_delete`
Delete a key from Redis.

**Input Schema:**
```json
{
  "key": "custom:data"
}
```

---

#### `cache_keys_by_pattern`
Find all keys matching a pattern.

**Input Schema:**
```json
{
  "pattern": "province:*"
}
```

**Response:**
```json
{
  "pattern": "province:*",
  "count": 34,
  "keys": ["province:11", "province:12", ...]
}
```

---

#### `cache_flush_all`
⚠️ **WARNING**: Clear all keys from Redis (requires confirmation).

**Input Schema:**
```json
{
  "confirm": true
}
```

---

### 3. File Tools

#### `file_upload`
Upload a file to ImageKit.

**Input Schema:**
```json
{
  "fileName": "document.pdf",
  "file": "base64encodedcontent...",
  "folder": "/documents",
  "tags": ["important", "review"]
}
```

**Response:**
```json
{
  "success": true,
  "fileId": "65f7a1b2c3d4e5f6g7h8i9j0",
  "url": "https://ik.imagekit.io/...",
  "name": "document.pdf",
  "size": 102400
}
```

---

#### `file_delete`
Delete a file from ImageKit by ID.

**Input Schema:**
```json
{
  "fileId": "65f7a1b2c3d4e5f6g7h8i9j0"
}
```

---

#### `file_list`
List files from ImageKit folder.

**Input Schema:**
```json
{
  "path": "/documents",
  "limit": 10
}
```

**Response:**
```json
{
  "path": "/documents",
  "count": 5,
  "files": [
    {
      "fileId": "...",
      "name": "file.pdf",
      "size": 102400,
      "url": "https://...",
      "type": "file"
    }
  ]
}
```

---

### 4. Activity Logging Tools

#### `log_activity`
Log an activity for audit trail.

**Input Schema:**
```json
{
  "aktivitas": "CREATE",
  "modul": "PEGAWAI",
  "deskripsi": "Created new employee",
  "dataBaru": "{\"name\": \"John\", \"nip\": \"123\"}",
  "dataLama": null,
  "status": "SUCCESS"
}
```

**Activity Types:**
- `CREATE` - New record created
- `UPDATE` - Existing record modified
- `DELETE` - Record deleted
- `LOGIN` - User login
- `LOGOUT` - User logout
- `VIEW` - Record viewed
- `ERROR` - Operation failed

**Statuses:**
- `SUCCESS` - Operation successful
- `ERROR` - Operation failed
- `WARNING` - Operation completed with warnings

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# Optional
MCP_DEBUG=true  # Enable debug logging
```

## Error Handling

All tools return error responses on failure:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Database connection failed"
    }
  ],
  "isError": true
}
```

## Integration Examples

### Python (Claude SDK)
```python
from anthropic import Anthropic

client = Anthropic()

# Initialize with MCP server
# Tools will be auto-discovered from stdio
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=[...],  # Auto-loaded from MCP
    messages=[
        {"role": "user", "content": "Get all employees from organization 5"}
    ]
)
```

### Node.js (fetch-based)
```javascript
const fs = require('fs');

// Call tool via stdio
const proc = require('child_process').spawn('bun', ['run', 'src/mcp/server.ts']);

// Send request
const req = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "db_get_all_pegawai",
    arguments: { page: 1, perPage: 10 }
  }
};

proc.stdin.write(JSON.stringify(req) + '\n');
```

## Performance Considerations

- **Pagination**: All list tools support pagination. Use `perPage` ≤ 50 for optimal performance.
- **Caching**: Database results can be cached using `cache_set` with appropriate TTL.
- **Batch Operations**: For multiple queries, consider implementing batch endpoints.

## Security Notes

- **No Authentication**: This MCP server assumes it runs in a trusted environment (same network).
- **Database Access**: Reuses existing database credentials from `DATABASE_URL`.
- **File Uploads**: Validate file types and sizes before upload.
- **Activity Logging**: All mutations are automatically logged for audit purposes.

## Future Enhancements

- [ ] Add write/mutation tools (create/update/delete records)
- [ ] Implement resource definitions (for static data discovery)
- [ ] Add batch query support
- [ ] Implement query result caching
- [ ] Add metrics/monitoring tools
