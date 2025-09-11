"""Connection management utilities for handling user database connections."""

import asyncpg
import logging
from typing import Optional
from fastapi import HTTPException, Header
from utils.crypto import crypto_manager

logger = logging.getLogger(__name__)

# Internal database configuration - ONLY for trove metadata, never for user queries
INTERNAL_DATABASE_URL = "postgresql://postgres:postgres@trove-db:5432/trove"

class ConnectionManager:
    """Manages user database connections and ensures proper isolation."""
    
    @staticmethod
    async def get_user_connection_string(connection_id: int) -> str:
        """Get database connection string for a user connection ID."""
        logger.info(f"Getting connection string for connection_id: {connection_id}")
        
        # Connect to INTERNAL database to fetch connection info
        conn = await asyncpg.connect(INTERNAL_DATABASE_URL)
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
            
            # Build connection string - currently only PostgreSQL supported
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
    
    @staticmethod
    async def get_user_connection(connection_id: int) -> asyncpg.Connection:
        """Get an active connection to a user database."""
        connection_string = await ConnectionManager.get_user_connection_string(connection_id)
        try:
            conn = await asyncpg.connect(connection_string)
            return conn
        except Exception as e:
            logger.error(f"Failed to connect to user database {connection_id}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to connect to database: {str(e)}")
    
    @staticmethod
    async def get_internal_connection() -> asyncpg.Connection:
        """Get connection to internal trove database for metadata operations."""
        try:
            conn = await asyncpg.connect(INTERNAL_DATABASE_URL)
            return conn
        except Exception as e:
            logger.error(f"Failed to connect to internal database: {e}")
            raise HTTPException(status_code=500, detail="Internal database connection failed")
    
    @staticmethod
    def extract_connection_id(connection_id_param: Optional[int] = None, 
                            connection_id_header: Optional[str] = Header(None, alias="X-Connection-ID")) -> int:
        """
        Extract connection ID from request parameters or headers.
        Prioritizes parameter over header.
        """
        if connection_id_param is not None:
            return connection_id_param
        
        if connection_id_header is not None:
            try:
                return int(connection_id_header)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid connection ID in header")
        
        raise HTTPException(status_code=400, detail="No database connection specified. Please select a database connection.")

# Global instance
connection_manager = ConnectionManager()