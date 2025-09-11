# Architecture & Data Flow 🏗️

## How Everything Fits Together

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        UI[User Interface]
        CS[Connection Selector]
        CM[Connection Manager]
        SE[SQL Editor]
        DE[DB Explorer]
        CTX[DatabaseConnectionContext]
        
        UI --> CS
        UI --> CM
        UI --> SE
        UI --> DE
        CS --> CTX
        CM --> CTX
        SE --> CTX
        DE --> CTX
    end
    
    subgraph "API Layer (Next.js API Routes)"
        API_CONN["/api/connections"]
        API_QUERY["/api/query"]
        API_TABLES["/api/schema/tables"]
    end
    
    subgraph "Backend (FastAPI)"
        subgraph "Connection Management"
            CONN_MGR[ConnectionManager]
            CRYPTO[CryptoManager]
            CONN_ROUTES[Connection Routes]
        end
        
        subgraph "Query Execution"
            QUERY_ROUTES[Query Routes]
            TABLE_ROUTES[Table Routes]
        end
        
        subgraph "Database Access"
            INTERNAL_CONN[Internal DB Connection]
            USER_CONN[User DB Connections]
        end
    end
    
    subgraph "Databases"
        INTERNAL_DB[("Internal DB<br/>trove-db:5433")]
        USER_DB1[("User DB 1<br/>Connection 1")]
        USER_DB2[("User DB 2<br/>Connection 2")]
        USER_DBN[("User DB N<br/>Connection N")]
    end
    
    %% Frontend to API
    CTX --> API_CONN
    CTX --> API_QUERY
    CTX --> API_TABLES
    
    %% API to Backend
    API_CONN --> CONN_ROUTES
    API_QUERY --> QUERY_ROUTES
    API_TABLES --> TABLE_ROUTES
    
    %% Backend Internal Connections
    CONN_ROUTES --> CONN_MGR
    CONN_MGR --> CRYPTO
    CONN_MGR --> INTERNAL_CONN
    CONN_MGR --> USER_CONN
    
    QUERY_ROUTES --> CONN_MGR
    TABLE_ROUTES --> CONN_MGR
    
    %% Database Connections
    INTERNAL_CONN --> INTERNAL_DB
    USER_CONN --> USER_DB1
    USER_CONN --> USER_DB2
    USER_CONN --> USER_DBN
    
    %% Styling
    classDef frontend fill:#e1f5fe
    classDef api fill:#f3e5f5
    classDef backend fill:#e8f5e8
    classDef database fill:#fff3e0
    
    class UI,CS,CM,SE,DE,CTX frontend
    class API_CONN,API_QUERY,API_TABLES api
    class CONN_MGR,CRYPTO,CONN_ROUTES,QUERY_ROUTES,TABLE_ROUTES,INTERNAL_CONN,USER_CONN backend
    class INTERNAL_DB,USER_DB1,USER_DB2,USER_DBN database
```

## What Happens When You Click Things

### Switching Connections (The Magic ✨)

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Context
    participant Schema
    participant API
    participant Backend
    participant UserDB
    
    User->>UI: Select Connection
    UI->>Context: selectConnection(id)
    Context->>Context: Update selectedConnection
    Context->>Context: Save to localStorage
    Context->>Schema: Trigger useEffect
    Schema->>API: GET /api/schema/tables
    Note over API: X-Connection-ID: 1
    API->>Backend: GET /api/v1/tables
    Backend->>UserDB: Query information_schema
    UserDB-->>Backend: Table metadata
    Backend-->>API: JSON response
    API-->>Schema: Table data
    Schema->>UI: Update tables list
    UI->>User: Show new schema
```

### Running Queries (The Fun Part 🚀)

```mermaid
sequenceDiagram
    participant User
    participant SQLEditor
    participant Hook
    participant API
    participant Backend
    participant ConnMgr
    participant UserDB
    
    User->>SQLEditor: Enter SQL query
    SQLEditor->>Hook: executeQuery()
    Hook->>Hook: Add X-Connection-ID header
    Hook->>API: POST /api/query
    Note over API: Headers: X-Connection-ID, Content-Type
    API->>Backend: POST /api/v1/query
    Backend->>ConnMgr: extract_connection_id()
    ConnMgr->>ConnMgr: get_user_connection(id)
    ConnMgr->>UserDB: Execute SQL query
    UserDB-->>ConnMgr: Query results
    ConnMgr-->>Backend: Formatted results
    Backend-->>API: JSON response
    API-->>Hook: Query data
    Hook->>Hook: Cache results
    Hook->>SQLEditor: Display results
    SQLEditor->>User: Show query results
```

### Adding New Connections (The Setup 🔐)

```mermaid
sequenceDiagram
    participant User
    participant ConnForm
    participant Context
    participant API
    participant Backend
    participant Crypto
    participant InternalDB
    
    User->>ConnForm: Fill connection details
    ConnForm->>Context: addConnection(data)
    Context->>API: POST /api/connections
    API->>Backend: POST /api/v1/connections
    Backend->>Crypto: encrypt(password)
    Crypto-->>Backend: encrypted_password
    Backend->>InternalDB: INSERT INTO database_connections
    InternalDB-->>Backend: Connection record
    Backend-->>API: Success response
    API-->>Context: New connection data
    Context->>Context: Update connections list
    Context->>ConnForm: Close form
    ConnForm->>User: Show success message
```

## Component Tree (The Family 👨‍👩‍👧‍👦)

### How React Components Are Related

```mermaid
graph TD
    App[App Layout]
    App --> Providers[Context Providers]
    App --> Sidebar[Sidebar]
    App --> Pages[Page Routes]
    
    Providers --> ThemeProvider
    Providers --> DBConnProvider[DatabaseConnectionProvider]
    Providers --> SchemaProvider
    
    Pages --> Home[Home Page]
    Pages --> Connections[Connections Page]
    Pages --> DBExplorer[DB Explorer Page]
    Pages --> SQLBuilder[SQL Builder Page]
    
    Connections --> ConnList[ConnectionList]
    Connections --> ConnForm[ConnectionForm]
    
    DBExplorer --> ConnSelector[ConnectionSelector]
    DBExplorer --> TableSidebar
    DBExplorer --> TableDetails
    
    SQLBuilder --> ConnSelector2[ConnectionSelector]
    SQLBuilder --> SQLEditor
    SQLBuilder --> ResultTable[SqlResultTable]
    
    TableDetails --> DataPreview
    
    %% Hooks and Context
    DBExplorer --> SchemaContext[useSchema]
    SQLBuilder --> SQLQuery[useSqlQuery]
    ConnSelector --> DBContext[useDatabaseConnection]
    ConnSelector2 --> DBContext
    ConnList --> DBContext
    ConnForm --> DBContext
    
    classDef providers fill:#ffeb3b
    classDef pages fill:#2196f3
    classDef components fill:#4caf50
    classDef hooks fill:#ff9800
    
    class Providers,ThemeProvider,DBConnProvider,SchemaProvider providers
    class Home,Connections,DBExplorer,SQLBuilder pages
    class ConnList,ConnForm,ConnSelector,ConnSelector2,TableSidebar,TableDetails,SQLEditor,ResultTable,DataPreview components
    class SchemaContext,SQLQuery,DBContext hooks
```

### Backend File Organization (The Grown-ups 🐍)

```mermaid
graph TD
    Main[main.py]
    Main --> Routers[routers/]
    Main --> Utils[utils/]
    Main --> Models[models/]
    Main --> DB[db.py]
    Main --> Migrations[migrations.py]
    
    Routers --> DatabaseRouter[database.py]
    
    Utils --> ConnManager[connection_manager.py]
    Utils --> Crypto[crypto.py]
    
    Models --> DatabaseModels[database.py]
    
    DB --> DatabaseManager[DatabaseManager]
    DB --> Migration[Migration System]
    
    DatabaseRouter --> ConnManager
    DatabaseRouter --> Crypto
    DatabaseRouter --> DatabaseModels
    
    Main --> ConnManager
    Main --> DatabaseModels
    
    ConnManager --> Crypto
    ConnManager --> DatabaseManager
    
    classDef core fill:#f44336
    classDef routers fill:#9c27b0
    classDef utils fill:#00bcd4
    classDef models fill:#ff9800
    classDef db fill:#4caf50
    
    class Main,Routers,DatabaseRouter routers
    class Utils,ConnManager,Crypto utils
    class Models,DatabaseModels models
    class DB,DatabaseManager,Migration db
```

## Security Stuff (The Important Bits 🔒)

### How We Keep Your Passwords Safe

```mermaid
graph LR
    subgraph "Frontend"
        Form[Connection Form]
        PlainPW[Plain Password]
    end
    
    subgraph "API Transport"
        HTTPS[HTTPS Transport]
        Encrypted[Encrypted Channel]
    end
    
    subgraph "Backend Processing"
        Receive[Receive Password]
        FernetEnc[Fernet Encryption]
        EncryptedPW[Encrypted Password]
    end
    
    subgraph "Database Storage"
        ByteaCol[BYTEA Column]
        StoredEnc[Stored Encrypted]
    end
    
    subgraph "Runtime Decryption"
        Retrieve[Retrieve from DB]
        FernetDec[Fernet Decryption]
        UsePlain[Use for Connection]
    end
    
    Form --> PlainPW
    PlainPW --> HTTPS
    HTTPS --> Encrypted
    Encrypted --> Receive
    Receive --> FernetEnc
    FernetEnc --> EncryptedPW
    EncryptedPW --> ByteaCol
    ByteaCol --> StoredEnc
    
    StoredEnc --> Retrieve
    Retrieve --> FernetDec
    FernetDec --> UsePlain
    
    classDef frontend fill:#e1f5fe
    classDef transport fill:#f3e5f5
    classDef backend fill:#e8f5e8
    classDef storage fill:#fff3e0
    classDef runtime fill:#fce4ec
    
    class Form,PlainPW frontend
    class HTTPS,Encrypted transport
    class Receive,FernetEnc,EncryptedPW backend
    class ByteaCol,StoredEnc storage
    class Retrieve,FernetDec,UsePlain runtime
```

### Why Your Data Stays Separate (No Mixing! 🚫)

```mermaid
graph TB
    subgraph "Trove Internal Database"
        InternalDB[("trove-db:5433")]
        ConnTable[database_connections]
        MigrationTable[schema_migrations]
        
        InternalDB --> ConnTable
        InternalDB --> MigrationTable
    end
    
    subgraph "User Database Connections"
        UserDB1[("User DB 1")]
        UserDB2[("User DB 2")]
        UserDBN[("User DB N")]
        
        UserTables1[User Tables & Data]
        UserTables2[User Tables & Data]
        UserTablesN[User Tables & Data]
        
        UserDB1 --> UserTables1
        UserDB2 --> UserTables2
        UserDBN --> UserTablesN
    end
    
    subgraph "Backend Connection Manager"
        ConnMgr[ConnectionManager]
        InternalConn[get_internal_connection]
        UserConn[get_user_connection]
        
        ConnMgr --> InternalConn
        ConnMgr --> UserConn
    end
    
    %% Connections
    InternalConn -.-> InternalDB
    InternalConn -.-> ConnTable
    InternalConn -.-> MigrationTable
    
    UserConn -.-> UserDB1
    UserConn -.-> UserDB2
    UserConn -.-> UserDBN
    
    %% Isolation barriers
    UserDB1 -.- UserDB2
    UserDB2 -.- UserDBN
    InternalDB -.- UserDB1
    
    classDef internal fill:#ffcdd2
    classDef user fill:#c8e6c9
    classDef manager fill:#fff3e0
    classDef barrier fill:#f5f5f5,stroke:#f44336,stroke-width:2px,stroke-dasharray: 5 5
    
    class InternalDB,ConnTable,MigrationTable internal
    class UserDB1,UserDB2,UserDBN,UserTables1,UserTables2,UserTablesN user
    class ConnMgr,InternalConn,UserConn manager
```

## State Management (The Brain 🧠)

### How React Remembers Everything

```mermaid
graph TD
    LocalStorage[localStorage<br/>Selected Connection ID]
    
    subgraph "React Context"
        DBContext[DatabaseConnectionContext]
        SchemaContext[SchemaContext]
        Connections[connections: Array]
        Selected[selectedConnection: Object]
        Tables[tables: Array]
    end
    
    subgraph "Components"
        ConnSelector[ConnectionSelector]
        ConnManager[ConnectionManager]
        DBExplorer[DBExplorer]
        SQLBuilder[SQLBuilder]
    end
    
    subgraph "Hooks"
        SQLQuery[useSqlQuery]
        Cache[Query Cache]
    end
    
    %% State flow
    LocalStorage --> DBContext
    DBContext --> Connections
    DBContext --> Selected
    
    Selected --> SchemaContext
    SchemaContext --> Tables
    
    %% Component connections
    DBContext --> ConnSelector
    DBContext --> ConnManager
    SchemaContext --> DBExplorer
    
    Selected --> SQLQuery
    SQLQuery --> Cache
    SQLQuery --> SQLBuilder
    
    %% User interactions
    ConnSelector -.->|selectConnection| DBContext
    ConnManager -.->|CRUD operations| DBContext
    DBExplorer -.->|table queries| SQLQuery
    SQLBuilder -.->|custom queries| SQLQuery
    
    classDef storage fill:#ff9800
    classDef context fill:#2196f3
    classDef components fill:#4caf50
    classDef hooks fill:#9c27b0
    
    class LocalStorage storage
    class DBContext,SchemaContext,Connections,Selected,Tables context
    class ConnSelector,ConnManager,DBExplorer,SQLBuilder components
    class SQLQuery,Cache hooks
```

## The TL;DR

This whole system gives you:
- **Your stuff stays yours** - Each connection is totally isolated
- **Passwords are locked up tight** - Fernet encryption for everything
- **Fast switching** - React Context keeps it snappy
- **No surprises** - Query the right database every time
- **It just works** - Because who has time for broken stuff?