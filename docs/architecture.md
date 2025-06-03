# trove Architecture

This document provides a detailed overview of trove's architecture, components, and their interactions.

## System Overview

trove is built with a modern, microservices-based architecture that prioritizes simplicity and maintainability.

```mermaid
graph TD
    Frontend["Frontend<br/>(Next.js)"]
    Backend["Backend<br/>(FastAPI)"]
    Database["Database<br/>(PostgreSQL)"]
    DBT["dbt<br/>(Sample Data)"]

    Frontend <--> Backend
    Backend <--> Database
    DBT --> Database

    style Frontend fill:#f9f,stroke:#333,stroke-width:2px
    style Backend fill:#bbf,stroke:#333,stroke-width:2px
    style Database fill:#dfd,stroke:#333,stroke-width:2px
    style DBT fill:#ffd,stroke:#333,stroke-width:2px
```

## Component Details

### Frontend (Next.js)
- Modern React-based UI with Next.js
- Tailwind CSS for styling
- TypeScript for type safety
- Core Components:
  - Query Editor
  - Results Viewer
  - Schema Browser

```mermaid
graph TD
    subgraph Frontend
    Components --> QueryEditor
    Components --> ResultsViewer
    Components --> SchemaBrowser
    Lib --> API
    Lib --> Utils
    Pages --> Explore
    end

    style Frontend fill:#f9f,stroke:#333,stroke-width:2px
```

### Backend (FastAPI)
- Async Python with FastAPI
- PostgreSQL connection via asyncpg
- Query execution and management

```mermaid
graph TD
    subgraph Backend
    API --> Routes
    API --> Models
    DB --> Connection
    Services --> QueryService
    end

    style Backend fill:#bbf,stroke:#333,stroke-width:2px
```

### Database Layer
- PostgreSQL 15 for data storage
- dbt for sample data seeding
- Basic schema management

## Data Flow

1. **Query Execution Flow**
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database

    U->>F: Input Query
    F->>B: Send Query
    B->>D: Execute Query
    D-->>B: Return Results
    B-->>F: Format Results
    F-->>U: Display Results
```

2. **Data Discovery Flow**
```mermaid
graph LR
    SB[Schema Browser] --> TL[Table List]
    TL --> CD[Column Details]
    
    style SB fill:#f9f,stroke:#333,stroke-width:2px
    style TL fill:#bbf,stroke:#333,stroke-width:2px
    style CD fill:#dfd,stroke:#333,stroke-width:2px
```

## Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- CodeMirror (SQL editor)

### Backend
- FastAPI
- asyncpg
- Pydantic

### Data Layer
- PostgreSQL 15
- dbt (for sample data)

### DevOps
- Docker
- Docker Compose
- Make

## Current Limitations

- Basic authentication only
- Single database connection support
- Limited query history
- No saved queries feature yet
- Basic error handling

## Next Steps

See our [GitHub Issues](https://github.com/trove-app/trove/issues) for planned features and improvements. 