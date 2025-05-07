from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
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