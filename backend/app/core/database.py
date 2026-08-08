import asyncpg
from typing import Optional
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)

class DatabasePool:
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        settings = get_settings()
        # Debugging log to see the parsed URL (masking password)
        safe_url = settings.DATABASE_URL.replace(settings.POSTGRES_PASSWORD, "****") if settings.DATABASE_URL and settings.POSTGRES_PASSWORD else settings.DATABASE_URL
        logger.info(f"Initializing asyncpg connection pool to: {safe_url}")
        try:
            self.pool = await asyncpg.create_pool(
                dsn=settings.DATABASE_URL,
                min_size=2,
                max_size=20,
                command_timeout=60,
            )
            logger.info("asyncpg connection pool initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize asyncpg connection pool: {e}")
            raise

    async def disconnect(self):
        if self.pool:
            logger.info("Closing asyncpg connection pool...")
            await self.pool.close()
            logger.info("asyncpg connection pool closed.")

db_pool = DatabasePool()

async def get_db_pool() -> asyncpg.Pool:
    if not db_pool.pool:
        raise Exception("Database pool is not initialized")
    return db_pool.pool

async def get_db_connection():
    pool = await get_db_pool()
    async with pool.acquire() as connection:
        yield connection
