from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "CampoPro Backend API"
    VERSION: str = "2.0"
    API_V1_STR: str = "/api/v1"
    
    # PostgreSQL Database
    POSTGRES_USER: str = Field(default="postgres")
    POSTGRES_PASSWORD: str = Field(default="postgres")
    POSTGRES_SERVER: str = Field(default="localhost")
    POSTGRES_PORT: str = Field(default="5432")
    POSTGRES_DB: str = Field(default="campopro")
    
    DATABASE_URL: str | None = None
    
    def model_post_init(self, __context) -> None:
        if not self.DATABASE_URL:
            self.DATABASE_URL = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis / Celery
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    
    # Security
    SECRET_KEY: str = Field(default="change-me-in-production-super-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Telegram Bot
    TELEGRAM_BOT_TOKEN: str = Field(default="YOUR_BOT_TOKEN_HERE")
    TELEGRAM_WEBHOOK_SECRET: str = Field(default="my-super-secret-webhook-token")
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True)

@lru_cache()
def get_settings() -> Settings:
    return Settings()
