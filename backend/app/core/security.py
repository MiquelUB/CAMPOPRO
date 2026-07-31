from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import redis.asyncio as redis
from app.config import get_settings
from app.dependencies import get_db
import asyncpg

settings = get_settings()

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

class TokenPayload(BaseModel):
    sub: str
    empresa_id: Optional[str] = None
    rol: str
    session_type: str
    exp: datetime
    iat: datetime

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": now})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    return create_access_token(data, expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))

async def check_token_in_blacklist(token: str) -> bool:
    is_blacklisted = await redis_client.get(f"blacklist_{token}")
    return is_blacklisted is not None

async def blacklist_token(token: str, expires_in: int):
    await redis_client.setex(f"blacklist_{token}", expires_in, "true")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: asyncpg.Connection = Depends(get_db)
) -> TokenPayload:
    if await check_token_in_blacklist(token):
        raise HTTPException(status_code=401, detail="Token revocat")
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
        
        if datetime.fromtimestamp(token_data.exp.timestamp(), tz=timezone.utc) < datetime.now(timezone.utc):
             raise HTTPException(status_code=401, detail="Token expirat")
             
        if token_data.empresa_id and token_data.rol != 'super_admin':
            await db.execute(f"SET LOCAL app.current_empresa_id = '{token_data.empresa_id}'")
            
        return token_data
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Credencials invàlides")

def require_role(allowed_roles: list[str]):
    async def role_checker(user: TokenPayload = Depends(get_current_user)):
        if user.rol not in allowed_roles:
            raise HTTPException(status_code=403, detail="No tens permisos suficients")
        return user
    return role_checker

async def require_super_admin(user: TokenPayload = Depends(get_current_user)):
    if user.rol != 'super_admin':
         raise HTTPException(status_code=403, detail="Requereix privilegis d'administrador")
    return user

async def require_not_impersonating(user: TokenPayload = Depends(get_current_user)):
    if user.session_type == 'impersonation':
         raise HTTPException(status_code=403, detail="Acció no permesa durant la impersonació")
    return user
