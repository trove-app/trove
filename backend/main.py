from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, List, Dict, Optional
import asyncpg
import logging
import os

from db import DatabaseManager
from routers import database as database_router
from utils.crypto import crypto_manager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@trove-db:5432/trove")
db_manager = DatabaseManager(DATABASE_URL)

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    """Run on application startup."""
    logger.info("Running database migrations...")
    await db_manager.run_migrations()
    logger.info("Database migrations completed")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str
    limit: Optional[int] = None
    connection_id: Optional[int] = None

class ColumnMetadata(BaseModel):
    name: str
    data_type: str
    is_nullable: bool
    default: Optional[str] = None

class TableMetadata(BaseModel):
    table_name: str
    columns: List[ColumnMetadata]

async def get_connection_string(connection_id: int) -> str:
    """Get database connection string for a given connection ID."""
    logger.info(f"Getting connection string for connection_id: {connection_id}")
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        result = await conn.fetchrow("""
            SELECT connection_type, host, port, database, username, password
            FROM database_connections
            WHERE id = $1 AND is_active = true
        """, connection_id)
        
        if not result:
            logger.error(f"Connection {connection_id} not found in database")
            raise HTTPException(status_code=404, detail=f"Connection {connection_id} not found")
        
        logger.info(f"Found connection: {result['connection_type']} to {result['host']}:{result['port']}/{result['database']}")
        
        # Decrypt password
        try:
            decrypted_password = crypto_manager.decrypt(result['password'])
        except Exception as e:
            logger.error(f"Failed to decrypt password for connection {connection_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to decrypt connection password")
        
        # Build connection string based on connection type - for now only PostgreSQL
        if result['connection_type'] == 'postgresql':
            connection_string = f"postgresql://{result['username']}:{decrypted_password}@{result['host']}:{result['port']}/{result['database']}"
            logger.info(f"Built connection string for PostgreSQL connection to {result['host']}")
            return connection_string
        else:
            logger.error(f"Unsupported connection type: {result['connection_type']}")
            raise HTTPException(status_code=400, detail=f"Currently only PostgreSQL connections are supported. Found: {result['connection_type']}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting connection string: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error retrieving connection information")
    finally:
        await conn.close()

# Include routers
app.include_router(database_router.router)

@app.post("/api/v1/query")
async def run_query(request: QueryRequest) -> Any:
    try:
        print(request)
        if request.connection_id is not None:
            connection_string = await get_connection_string(request.connection_id)
        else:
            raise HTTPException(status_code=400, detail="No database selected.")
        
        conn = await asyncpg.connect(connection_string)
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
async def get_tables_metadata(connection_id: Optional[int] = None) -> Any:
    try:
        if connection_id is not None:
            connection_string = await get_connection_string(connection_id)
        else:
            raise HTTPException(status_code=400, detail="No database selected.")
        
        conn = await asyncpg.connect(connection_string)
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
        logger.error(f"Error fetching table metadata: {e}", exc_info=True)
        raise HTTPException(
            status_code=400,
            detail=f"Error fetching table metadata: {str(e)}"
        )