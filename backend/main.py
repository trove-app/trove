from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, List, Dict, Optional
import asyncpg
import os

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/trove")

class QueryRequest(BaseModel):
    query: str

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
            results = await conn.fetch(request.query)
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