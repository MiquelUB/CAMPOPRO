from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI, Request
from redis.asyncio import Redis
from app.config import get_settings

settings = get_settings()

redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)

def get_user_or_ip(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        pass
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)

limiter = Limiter(
    key_func=get_user_or_ip,
    storage_uri=settings.REDIS_URL,
    default_limits=["100/minute"]
)

def setup_rate_limiting(app: FastAPI):
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
