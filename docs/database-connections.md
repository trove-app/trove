# Multi-Database Connections 🔗

## What's This About?

Trove now lets you connect to multiple PostgreSQL databases and switch between them like changing TV channels. No more environment variable juggling!

## How It Works

Think of it like this:
- **Trove DB** (port 5433) = Where we store *your connection info* 
- **Your DBs** (wherever) = Where we run *your actual queries*

We never mix the two. It's like keeping your contact list separate from your actual conversations.

```
You → Pick Connection → Trove Routes Query → Your Database
```

Simple.

## Quick Start

1. **Go to "DB Connections"** in the sidebar
2. **Add your database** with the form
3. **Pick it** from the dropdown anywhere
4. **Query away!** Everything just works™

## The Technical Bits

### Security
Your passwords get encrypted with [Fernet](https://cryptography.io/en/latest/fernet/). Set `TROVE_ENCRYPTION_KEY` in your environment or things will break spectacularly.

### API Endpoints

**Managing Connections:**
```http
POST /api/v1/connections/     # Add new connection
GET  /api/v1/connections/     # List your connections
PATCH /api/v1/connections/123 # Update connection 123
DELETE /api/v1/connections/123 # Bye bye connection 123
```

**Using Connections:**
```http
POST /api/v1/query
X-Connection-ID: 123
{"query": "SELECT * FROM users"}

GET /api/v1/tables  
X-Connection-ID: 123
```

We use headers because they're cleaner than URL params. Fight us.

### Database Schema

```sql
-- This lives in the internal Trove DB only
CREATE TABLE database_connections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    connection_type VARCHAR(50) NOT NULL,  -- 'postgresql' for now
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    database VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password BYTEA NOT NULL,  -- Encrypted, obviously
    ssl_mode VARCHAR(50) DEFAULT 'prefer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

## Migration Guide

**Before (Environment Hell):**
```yaml
backend:
  environment:
    - DATABASE_URL=postgresql://user:pass@db:5432/mydb
```

**After (Frontend Zen):**
```yaml
backend:
  environment:
    - DATABASE_URL=postgresql://postgres:postgres@trove-db:5432/trove  # Internal only
    - TROVE_ENCRYPTION_KEY=your-secret-key  # Don't lose this!
```

## Files That Matter

**Backend:**
- `utils/connection_manager.py` - The star of the show
- `routers/database.py` - CRUD for connections
- `utils/crypto.py` - Keeps your passwords safe

**Frontend:**
- `context/DatabaseConnectionContext.tsx` - React state magic
- `components/ConnectionSelector.tsx` - The dropdown
- `connections/` - The management UI

## Common Issues & Fixes

**"Connection 1 not found"**
→ Check if it exists: `GET /api/v1/connections/`

**"Failed to decrypt password"** 
→ Your `TROVE_ENCRYPTION_KEY` changed. Don't do that.

**"No database connection specified"**
→ Pick a connection from the dropdown. We're not mind readers.

## What's Next?

The tech lead wants us to:
1. **Add connection pooling** (performance++)
2. **Simplify the connection ID stuff** (headers only)
3. **Test connections before saving** (sanity++)
4. **Remove debug prints** (professionalism++)

## Pro Tips

- Always test your connections work before adding them
- Connection names must be lowercase with no spaces (blame the regex)
- The internal DB is sacred - never query user data from it
- When in doubt, check the logs: `make logs CONTAINER=trove-backend-1`

That's it! Go forth and connect to all the databases. 🚀