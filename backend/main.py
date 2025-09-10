from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, List, Dict, Optional
import asyncpg
import logging
import os

from db import DatabaseManager
from routers import database as database_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Internal database configuration (for trove's metadata)
TROVE_DB_URL = os.getenv("TROVE_DB_URL", "postgresql://postgres:postgres@trove-db:5432/trove")
db_manager = DatabaseManager(TROVE_DB_URL)

# Sample database configuration (for demo/examples)
SAMPLE_DB_URL = os.getenv("SAMPLE_DB_URL", "postgresql://postgres:postgres@sample-db:5432/postgres")

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    """Run on application startup."""
    logger.info("Running database migrations...")
    await db_manager.run_migrations()
    logger.info("Database migrations completed")

# Include routers
app.include_router(database_router.router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@sample-db:5432/postgres")

class QueryRequest(BaseModel):
    query: str
    limit: Optional[int] = None

class ColumnMetadata(BaseModel):
    name: str
    data_type: str
    is_nullable: bool
    default: Optional[str] = None

class TableMetadata(BaseModel):
    table_name: str
    columns: List[ColumnMetadata]

@app.post("/api/v1/query")
async def run_query(request: QueryRequest) -> Any:
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        try:
            query_to_execute = request.query
            if request.limit is not None and request.limit > 0:
                query_to_execute += f" LIMIT {request.limit}"
            results = await conn.fetch(query_to_execute)
            columns = results[0].keys() if results else []
            data = [dict(row) for row in results]
            return {"columns": columns, "rows": data}
        finally:
            await conn.close()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/v1/tables", response_model=List[TableMetadata])
async def get_tables_metadata() -> Any:
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print(DATABASE_URL)
        
        try:
            # Get all user tables in the public schema
            tables = await conn.fetch("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            """)
            table_list = []
            for table in tables:
                table_name = table['table_name']
                columns = await conn.fetch("""
                    SELECT column_name, data_type, is_nullable, column_default
                    FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = $1
                    ORDER BY ordinal_position;
                """, table_name)
                column_list = [
                    ColumnMetadata(
                        name=col['column_name'],
                        data_type=col['data_type'],
                        is_nullable=(col['is_nullable'] == 'YES'),
                        default=col['column_default']
                    ) for col in columns
                ]
                table_list.append(TableMetadata(table_name=table_name, columns=column_list))
            return table_list
        finally:
            await conn.close()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching table metadata: {str(e)}") 