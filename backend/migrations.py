"""Database migrations for trove backend.

This module contains SQL migrations for the trove backend database.
Each migration is a string containing SQL statements.
"""

# List of migrations in order of execution
migrations = [
    # Migration 0001 - Create database_connections table
    """
    CREATE TABLE IF NOT EXISTS database_connections (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        connection_type VARCHAR(50) NOT NULL,
        host VARCHAR(255) NOT NULL,
        port INTEGER NOT NULL,
        database VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        ssl_mode VARCHAR(50) DEFAULT 'prefer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        
        -- Ensure name is lowercase and doesn't contain spaces
        CONSTRAINT valid_name CHECK (name ~ '^[a-z0-9_-]+$'),
        -- Basic validation for connection type
        CONSTRAINT valid_connection_type CHECK (connection_type IN ('postgresql', 'mysql')),
        -- Basic validation for port
        CONSTRAINT valid_port CHECK (port > 0 AND port < 65536),
        -- Basic validation for ssl_mode
        CONSTRAINT valid_ssl_mode CHECK (ssl_mode IN ('disable', 'allow', 'prefer', 'require', 'verify-ca', 'verify-full'))
    );

    -- Function to update updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Trigger to automatically update updated_at
    CREATE TRIGGER update_database_connections_updated_at
        BEFORE UPDATE ON database_connections
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    -- Index on name for faster lookups
    CREATE INDEX IF NOT EXISTS idx_database_connections_name ON database_connections(name);
    
    -- Index on is_active for filtering active connections
    CREATE INDEX IF NOT EXISTS idx_database_connections_is_active ON database_connections(is_active);
    """
]
