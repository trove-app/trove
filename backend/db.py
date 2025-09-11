"""Database utilities and migration manager for trove backend."""

import asyncpg
import logging
import os
from typing import List, Optional
from utils.crypto import crypto_manager

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, database_url: str):
        self.database_url = database_url
        
    async def _create_migrations_table(self, conn: asyncpg.Connection) -> None:
        """Create the migrations table if it doesn't exist."""
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                migration_id INTEGER UNIQUE NOT NULL,
                applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)

    async def get_applied_migrations(self, conn: asyncpg.Connection) -> List[int]:
        """Get list of already applied migrations."""
        await self._create_migrations_table(conn)
        records = await conn.fetch(
            "SELECT migration_id FROM schema_migrations ORDER BY migration_id;"
        )
        return [record['migration_id'] for record in records]

    async def apply_migration(
        self, 
        conn: asyncpg.Connection, 
        migration_id: int, 
        migration_sql: str
    ) -> None:
        """Apply a single migration."""
        async with conn.transaction():
            # For migration 2 (sample db connection), we need to encrypt the password
            if migration_id == 2:
                # Get the sample DB password from environment or use default
                sample_db_password = os.getenv("SAMPLE_DB_PASSWORD", "postgres")
                encrypted_password = crypto_manager.encrypt(sample_db_password)
                
                # Replace the placeholder with the actual encrypted password
                # Convert bytes to bytea format that PostgreSQL expects
                migration_sql = migration_sql.replace(
                    "'encrypted_password_placeholder'",
                    f"E'\\\\x{encrypted_password.hex()}'"  # Proper bytea format
                )
            
            await conn.execute(migration_sql)
            await conn.execute(
                "INSERT INTO schema_migrations (migration_id) VALUES ($1);",
                migration_id
            )
            logger.info(f"Applied migration {migration_id}")

    async def run_migrations(self) -> None:
        """Run all pending migrations."""
        try:
            conn = await asyncpg.connect(self.database_url)
            try:
                # Get list of applied migrations
                applied_migrations = await self.get_applied_migrations(conn)
                
                # Import migrations here to avoid circular imports
                from migrations import migrations
                
                # Apply each pending migration in order
                for i, migration_sql in enumerate(migrations):
                    migration_id = i + 1  # Migration IDs start at 1
                    if migration_id not in applied_migrations:
                        logger.info(f"Applying migration {migration_id}...")
                        await self.apply_migration(conn, migration_id, migration_sql)
                        
                logger.info("All migrations applied successfully")
                
            finally:
                await conn.close()
        except Exception as e:
            logger.error(f"Error running migrations: {e}")
            raise
