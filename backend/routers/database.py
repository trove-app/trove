"""Database connection management endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from typing import List
import asyncpg
import logging
import os

from models.database import (
    DatabaseConnectionCreate,
    DatabaseConnectionUpdate,
    DatabaseConnectionResponse
)
from utils.crypto import crypto_manager
from utils.connection_manager import connection_manager

router = APIRouter(prefix="/api/v1/connections", tags=["database"])
logger = logging.getLogger(__name__)

async def get_db():
    """Get internal database connection for metadata operations."""
    try:
        conn = await connection_manager.get_internal_connection()
        yield conn
    finally:
        await conn.close()

@router.post("/", response_model=DatabaseConnectionResponse)
async def create_connection(
    connection: DatabaseConnectionCreate,
    db: asyncpg.Connection = Depends(get_db)
):
    """Create a new database connection."""
    print(connection)
    print(db)
    try:
        # Encrypt the password
        encrypted_password = crypto_manager.encrypt(
            connection.password.get_secret_value()
        )
        
        # Insert into database
        result = await db.fetchrow("""
            INSERT INTO database_connections (
                name, connection_type, host, port, database,
                username, password, ssl_mode
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, name, connection_type, host, port,
                      database, username, ssl_mode, created_at,
                      updated_at, is_active
        """, connection.name, connection.connection_type,
             connection.host, connection.port, connection.database,
             connection.username, encrypted_password, connection.ssl_mode)
        
        return DatabaseConnectionResponse(**dict(result))
    except asyncpg.UniqueViolationError:
        raise HTTPException(
            status_code=400,
            detail=f"Connection with name '{connection.name}' already exists"
        )
    except Exception as e:
        logger.error(f"Error creating database connection: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error creating database connection"
        )

@router.get("/", response_model=List[DatabaseConnectionResponse])
async def list_connections(
    db: asyncpg.Connection = Depends(get_db),
    active_only: bool = True
):
    """List all database connections."""
    try:
        query = """
            SELECT id, name, connection_type, host, port,
                   database, username, ssl_mode, created_at,
                   updated_at, is_active
            FROM database_connections
        """
        if active_only:
            query += " WHERE is_active = true"
        query += " ORDER BY name"
        
        results = await db.fetch(query)
        return [DatabaseConnectionResponse(**dict(row)) for row in results]
    except Exception as e:
        logger.error(f"Error listing database connections: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error listing database connections"
        )

@router.get("/{connection_id}", response_model=DatabaseConnectionResponse)
async def get_connection(
    connection_id: int,
    db: asyncpg.Connection = Depends(get_db)
):
    """Get a specific database connection."""
    try:
        result = await db.fetchrow("""
            SELECT id, name, connection_type, host, port,
                   database, username, ssl_mode, created_at,
                   updated_at, is_active
            FROM database_connections
            WHERE id = $1 AND is_active = true
        """, connection_id)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Connection {connection_id} not found"
            )
        
        return DatabaseConnectionResponse(**dict(result))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting database connection: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error getting database connection"
        )

@router.patch("/{connection_id}", response_model=DatabaseConnectionResponse)
async def update_connection(
    connection_id: int,
    connection: DatabaseConnectionUpdate,
    db: asyncpg.Connection = Depends(get_db)
):
    """Update a database connection."""
    try:
        # Get existing connection
        existing = await db.fetchrow("""
            SELECT * FROM database_connections
            WHERE id = $1 AND is_active = true
        """, connection_id)
        
        if not existing:
            raise HTTPException(
                status_code=404,
                detail=f"Connection {connection_id} not found"
            )
        
        # Build update query dynamically based on provided fields
        updates = []
        params = []
        update_data = connection.model_dump(exclude_unset=True)
        
        for i, (key, value) in enumerate(update_data.items(), start=1):
            if key == 'password':
                # Encrypt new password if provided
                value = crypto_manager.encrypt(value.get_secret_value())
            updates.append(f"{key} = ${i}")
            params.append(value)
        
        if not updates:
            return DatabaseConnectionResponse(**dict(existing))
        
        # Add connection_id as the last parameter
        params.append(connection_id)
        
        # Execute update
        result = await db.fetchrow(f"""
            UPDATE database_connections
            SET {", ".join(updates)}
            WHERE id = ${len(params)}
            RETURNING id, name, connection_type, host, port,
                      database, username, ssl_mode, created_at,
                      updated_at, is_active
        """, *params)
        
        return DatabaseConnectionResponse(**dict(result))
    except asyncpg.UniqueViolationError:
        raise HTTPException(
            status_code=400,
            detail=f"Connection with name '{connection.name}' already exists"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating database connection: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error updating database connection"
        )

@router.delete("/{connection_id}")
async def delete_connection(
    connection_id: int,
    db: asyncpg.Connection = Depends(get_db)
):
    """Soft delete a database connection."""
    try:
        result = await db.fetchrow("""
            UPDATE database_connections
            SET is_active = false
            WHERE id = $1 AND is_active = true
            RETURNING id
        """, connection_id)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Connection {connection_id} not found"
            )
        
        return {"message": "Connection deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting database connection: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error deleting database connection"
        )
