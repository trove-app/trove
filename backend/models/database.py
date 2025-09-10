"""Database models for trove."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, SecretStr, Field, validator
import re

class DatabaseConnectionBase(BaseModel):
    """Base model for database connections."""
    name: str = Field(..., description="Unique identifier for the connection")
    connection_type: str = Field(..., description="Type of database (postgresql, mysql)")
    host: str = Field(..., description="Database host")
    port: int = Field(..., description="Database port")
    database: str = Field(..., description="Database name")
    username: str = Field(..., description="Database username")
    ssl_mode: str = Field(default="prefer", description="SSL mode for connection")

    @validator('name')
    def validate_name(cls, v):
        if not re.match(r'^[a-z0-9_-]+$', v):
            raise ValueError('name must be lowercase and contain only letters, numbers, underscores, and hyphens')
        return v

    @validator('connection_type')
    def validate_connection_type(cls, v):
        if v not in ('postgresql', 'mysql'):
            raise ValueError('connection_type must be either postgresql or mysql')
        return v

    @validator('port')
    def validate_port(cls, v):
        if not 0 < v < 65536:
            raise ValueError('port must be between 1 and 65535')
        return v

    @validator('ssl_mode')
    def validate_ssl_mode(cls, v):
        valid_modes = ('disable', 'allow', 'prefer', 'require', 'verify-ca', 'verify-full')
        if v not in valid_modes:
            raise ValueError(f'ssl_mode must be one of: {", ".join(valid_modes)}')
        return v

class DatabaseConnectionCreate(DatabaseConnectionBase):
    """Model for creating a new database connection."""
    password: SecretStr = Field(..., description="Database password")

class DatabaseConnectionUpdate(DatabaseConnectionBase):
    """Model for updating an existing database connection."""
    name: Optional[str] = None
    connection_type: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    database: Optional[str] = None
    username: Optional[str] = None
    password: Optional[SecretStr] = None
    ssl_mode: Optional[str] = None

class DatabaseConnectionResponse(DatabaseConnectionBase):
    """Model for database connection responses."""
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool

    class Config:
        from_attributes = True
