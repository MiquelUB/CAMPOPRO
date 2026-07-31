# Skill: Autenticació JWT amb Rols i Seguretat Avançada

## Descripció
Aquest skill implementa un sistema complet d'autenticació JWT per a FastAPI al projecte CampoPro. Inclou tokens d'accés (15 minuts) i de refresc (7 dies), gestió de llista negra de tokens en Redis per a la desconnexió, i suport per a 3 nivells d'autenticació: `super_admin`, `empresari`/`enginyer`, i `operari`. S'inclou xifratge de contrasenyes amb bcrypt i PINs hash per als operaris, així com funcionalitat d'impersonació limitada per als super_admins.

## Template

```python
# [PLACEHOLDER_DIR]/auth/security.py
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import redis.asyncio as redis
from [PLACEHOLDER_CORE].config import settings

# Redis client for token blacklist
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

class TokenPayload(BaseModel):
    sub: str # user_id
    empresa_id: Optional[str] = None
    rol: str
    session_type: str # 'normal', 'impersonation'
    exp: datetime
    iat: datetime

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire, "iat": now})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    return create_access_token(data, expires_delta=timedelta(days=7))

async def check_token_in_blacklist(token: str) -> bool:
    is_blacklisted = await redis_client.get(f"blacklist_{token}")
    return is_blacklisted is not None

async def blacklist_token(token: str, expires_in: int):
    await redis_client.setex(f"blacklist_{token}", expires_in, "true")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenPayload:
    if await check_token_in_blacklist(token):
        raise HTTPException(status_code=401, detail="Token revocat")
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
        
        if datetime.fromtimestamp(token_data.exp.timestamp(), tz=timezone.utc) < datetime.now(timezone.utc):
             raise HTTPException(status_code=401, detail="Token expirat")
             
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
    # IP allowlist check could be implemented here checking request.client.host
    return user
    
async def require_not_impersonating(user: TokenPayload = Depends(get_current_user)):
    if user.session_type == 'impersonation':
         raise HTTPException(status_code=403, detail="Acció no permesa durant la impersonació")
    return user
```

## Exemple d'ús

```python
from fastapi import APIRouter, Depends
from [PLACEHOLDER_DIR].auth.security import require_role, require_super_admin, require_not_impersonating, TokenPayload

router = APIRouter()

@router.get("/empresari/dashboard")
async def get_dashboard(user: TokenPayload = Depends(require_role(['empresari']))):
    return {"message": "Benvingut", "empresa_id": user.empresa_id}

@router.post("/finances/modificar")
async def modify_finances(user: TokenPayload = Depends(require_role(['empresari'])), _ = Depends(require_not_impersonating)):
    # El super_admin impersonant no podrà arribar aquí
    return {"message": "Dades financeres modificades"}
```

## Validació
- Comprova que intentar usar un token caducat retorna HTTP 401.
- Verifica que el logout afegeix el token a la blacklist de Redis i impedeix el seu ús futur.
- Confirma que funcions restringides retornen HTTP 403 per a rols inferiors (ex. `operari` accedint a `empresari`).
- Valida que la impersonació permet accés de lectura, però denega acció restringida per `require_not_impersonating`.

## Errors comuns
- **Oblidar establir `timezone.utc`**: Els tokens poden caducar abans d'hora si s'usa l'hora local sense zona.
- **No incloure el `sub` al payload**: L'estàndard JWT requereix `sub` per identificar de qui és el token.
- **Usar claus secretes febles**: La clau per signar `settings.SECRET_KEY` ha de ser molt forta i guardada en `.env`.
- **No verificar la llista negra**: Els access tokens podrien seguir sent vàlids fins i tot després que l'usuari faci logout.
