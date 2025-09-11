# Changelog

All notable changes to Trove will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - The Big Connection Makeover 🎉

### Added - Say Goodbye to Environment Variable Hell

#### 🔗 **Multi-Database Connection Magic**
- **Frontend connection management** - Add, edit, and manage connections through the UI (no more YAML wrangling!)
- **One-click database switching** - Dropdown selector on every page because we're not animals
- **Fort Knox password security** - Fernet encryption keeps your creds locked up tight
- **Smart query routing** - Every query knows which database it's talking to
- **Proper data isolation** - Your databases can't see each other (as it should be)

#### 🏗️ **Backend Heavy Lifting**
- **Migration system** (`backend/db.py`) - Database versions that actually work
- **Connection CRUD API** (`backend/routers/database.py`) - Create, read, update, delete connections like a pro
- **ConnectionManager utility** (`backend/utils/connection_manager.py`) - One class to rule them all
- **Crypto helpers** (`backend/utils/crypto.py`) - Password encryption that doesn't suck
- **Database separation** - Internal metadata vs. your actual data (never the twain shall meet)

#### 🎨 **Frontend Niceties**
- **DatabaseConnectionContext** - React Context that actually manages state properly
- **Connection management UI** - Pretty forms and lists for your database connections
- **Connection dropdown** - That little selector that does exactly what you expect
- **Smart hooks** - `useSqlQuery` and `SchemaContext` now know which database you're using
- **Remembers your choice** - localStorage keeps your selected connection between sessions

#### 🔐 **Security That Actually Works**
- **Encrypted passwords** - Fernet encryption because plaintext is for amateurs
- **Headers not URLs** - Connection IDs travel via `X-Connection-ID` header (cleaner and safer)
- **Strict separation** - Our internal database never touches your user data
- **Configurable encryption** - Set `TROVE_ENCRYPTION_KEY` or things will break spectacularly

#### 🏛️ **Smart Architecture Decisions**
- **Two-database setup** - `trove-db` for our stuff, your databases for your stuff
- **Future-proof** - Ready for connection pooling when we get to it
- **Clean API proxying** - NextJS routes that don't get in the way
- **Isolated caching** - Query cache that knows which connection it belongs to

### Changed - The Good Kind of Breaking Changes

#### 🔧 **Infrastructure Shuffle**
- **Docker setup** - Sample database moved to its own container (cleaner)
- **Environment variables** - Added `TROVE_ENCRYPTION_KEY` (don't lose this!)
- **Database roles** - Internal database for our metadata only
- **Sidebar activation** - "DB Connections" link actually works now

#### 📊 **Smarter Data Handling**
- **Flexible endpoints** - Connection ID via header OR query param (your choice)
- **Context-aware schema** - Tables and columns for the right database
- **Correct previews** - Table data from the database you actually selected
- **Proper routing** - SQL queries go where you think they're going

### Fixed - The Bugs We Squashed

#### 🐛 **Query Shenanigans**
- **Missing connection context** - Table previews now actually use the selected connection
- **Header forwarding fails** - NextJS routes properly pass connection headers to backend
- **Stale schema data** - Schema updates immediately when switching connections
- **Cache confusion** - Query cache includes connection ID (no more mixing results)

#### 🔒 **Security Oops**
- **Encryption key errors** - Better messages when `TROVE_ENCRYPTION_KEY` is missing
- **Connection not found** - Clearer errors for invalid connection IDs
- **Database mixing** - Internal database stays internal (as it should be)

### Technical Details (For the Code Nerds 🤓)

#### 📁 **Files We Created**
```
backend/
├── utils/connection_manager.py     # Central connection handling
├── utils/crypto.py                 # Encryption utilities  
├── routers/database.py             # Connection CRUD API
├── models/database.py              # Pydantic models
├── migrations.py                   # Database migrations
└── db.py                          # Migration manager

frontend/
├── app/context/DatabaseConnectionContext.tsx  # Connection state
├── app/components/ConnectionSelector.tsx       # Connection dropdown
├── app/connections/                           # Connection management UI
│   ├── page.tsx                              # Main management page
│   ├── ConnectionForm.tsx                    # Add/edit form
│   └── ConnectionList.tsx                    # Connection list
└── app/api/connections/                      # NextJS API routes
    ├── route.ts                              # List/create endpoints
    └── [id]/route.ts                         # Individual connection CRUD
```

#### 🔄 **Files We Updated**
```
backend/main.py                 # Updated query endpoints with connection support
frontend/app/layout.tsx         # Added DatabaseConnectionProvider
frontend/app/components/Sidebar.tsx            # Activated DB connections link
frontend/app/hooks/useSqlQuery.ts              # Added connection ID parameter
frontend/app/context/SchemaContext.tsx         # Connection-aware schema fetching
frontend/app/db-explorer/TableDetails.tsx      # Fixed connection context
frontend/app/db-explorer/page.tsx              # Added connection selector
frontend/app/sql-builder/page.tsx              # Added connection selector
docker-compose.yml              # Updated for dual database architecture
```

#### 📊 **Database Schema**
```sql
-- New table for connection storage
CREATE TABLE database_connections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    connection_type VARCHAR(50) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    database VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password BYTEA NOT NULL,  -- Encrypted
    ssl_mode VARCHAR(50) DEFAULT 'prefer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Migration tracking table
CREATE TABLE schema_migrations (
    id SERIAL PRIMARY KEY,
    migration_id INTEGER UNIQUE NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 🔗 **API Endpoints**

**Connection Management:**
- `POST /api/v1/connections/` - Create new connection
- `GET /api/v1/connections/` - List all connections
- `GET /api/v1/connections/{id}` - Get specific connection
- `PATCH /api/v1/connections/{id}` - Update connection
- `DELETE /api/v1/connections/{id}` - Soft delete connection

**Updated Query Endpoints:**
- `POST /api/v1/query` - Execute SQL (accepts `X-Connection-ID` header)
- `GET /api/v1/tables` - Get schema metadata (accepts `X-Connection-ID` header)

#### 🏗️ **Architecture Pattern**

**Request Flow:**
```
Frontend UI → DatabaseConnectionContext → useSqlQuery/Schema hooks → 
NextJS API Routes → FastAPI Backend → ConnectionManager → User Database
```

**Connection Isolation:**
```
Internal DB (trove-db:5433)     User DBs (various)
├── database_connections        ├── User tables
├── schema_migrations          ├── User data  
└── Trove metadata            └── Query targets
```

### Migration Guide (How to Switch Over)

#### From Environment Hell to Frontend Heaven

**Before (Environment-based):**
```yaml
backend:
  environment:
    - DATABASE_URL=postgresql://user:pass@db:5432/mydb
```

**After (Frontend-managed):**
```yaml
backend:
  environment:
    - DATABASE_URL=postgresql://postgres:postgres@trove-db:5432/trove  # Internal only
    - TROVE_ENCRYPTION_KEY=your-encryption-key  # Required
```

**How to Switch:**
1. Set `TROVE_ENCRYPTION_KEY` in your environment (save this somewhere safe!)
2. Restart backend (migrations run automatically)
3. Go to `/connections` and add your databases through the UI
4. Pick a connection from the dropdown
5. Everything just works now ✨

### Breaking Changes (Sorry!)

- **You need an encryption key**: Set `TROVE_ENCRYPTION_KEY` or nothing will work
- **Dual databases required**: Internal database needed for metadata storage
- **Connection selection required**: Pick a database before querying (we tried to make this graceful)

### Documentation (The Good Stuff 📚)

- 📖 **[Database Connections Guide](docs/database-connections.md)** - Everything you need to know (now with 80% less verbosity!)
- 🏗️ **[Architecture Diagrams](docs/architecture-diagram.md)** - Pretty pictures of how everything fits together
- 🔧 **[API Reference](docs/database-connections.md#api-reference)** - All the endpoints you'll ever need

### Future Improvements

Based on technical review, planned improvements include:

#### High Priority
- **Connection pooling** - Improve performance under load
- **Simplified connection ID handling** - Use headers exclusively
- **Enhanced error handling** - Centralized error patterns
- **Connection validation** - Test connections before storing

#### Medium Priority  
- **Rate limiting** - Security hardening for connection endpoints
- **Connection testing endpoint** - UI for testing connection validity
- **Connection monitoring** - Usage analytics and health checks

#### Low Priority
- **Multi-database support** - MySQL, SQLite, BigQuery connectors
- **Team features** - Shared connections and permissions
- **Import/export** - Connection configuration backup/restore

---

## Previous Releases

### [0.1.0] - Initial Release
- Basic PostgreSQL connection via environment variables
- SQL editor and query execution
- Database schema exploration
- Table and column browsing
- Docker-based deployment