from fastapi import Depends, HTTPException, status
from typing import AsyncGenerator
import asyncpg
from app.core.database import get_db_connection

async def get_db(conn: asyncpg.Connection = Depends(get_db_connection)) -> AsyncGenerator[asyncpg.Connection, None]:
    """
    FastAPI dependency to get a database connection from the pool.
    Usage:
        @app.get("/users")
        async def get_users(db: asyncpg.Connection = Depends(get_db)):
            ...
    """
    try:
        yield conn
    except Exception as e:
        # Handle transaction rollback or other cleanup if necessary
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database connection error")
