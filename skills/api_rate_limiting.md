# Skill: Rate Limiting d'API amb Slowapi i Redis

## Descripció
Aquest skill aplica restriccions de ràtio (Rate Limiting) a la API de FastAPI utilitzant `slowapi` i emmagatzemant els comptadors a Redis. Això protegeix l'aplicació contra atacs de força bruta, DoS i abusos de la IA. Inclou límits generals per IP, més estrictes per a login i endpoints d'IA, i límits globals per a usuaris autenticats. També configura llistes blanques per als endpoints de salut de la infraestructura.

## Template

```python
# [PLACEHOLDER_DIR]/core/rate_limit.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI, Request
from redis.asyncio import Redis
from [PLACEHOLDER_CORE].config import settings
import re

# Use Redis backend for persistent distributed rate limiting
redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)

# Lògica personalitzada per a l'adreça IP o l'usuari si està autenticat
def get_user_or_ip(request: Request) -> str:
    # Prioritza l'ID de l'usuari si hi ha token JWT als headers
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        # A la pràctica, aquí extrauries el sub del JWT (sense verificar la signatura per rapidesa)
        # Per ex: return jwt.decode(token, options={"verify_signature": False}).get("sub")
        pass
    
    # Suport per a Nginx real IP proxy
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)

# Limiter principal
limiter = Limiter(
    key_func=get_user_or_ip,
    storage_uri=settings.REDIS_URL,
    default_limits=["100/minute"]  # Límit per defecte global
)

def setup_rate_limiting(app: FastAPI):
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

## Exemple d'ús

```python
# [PLACEHOLDER_DIR]/main.py
from fastapi import FastAPI, Request
from [PLACEHOLDER_DIR].core.rate_limit import setup_rate_limiting, limiter

app = FastAPI()
setup_rate_limiting(app)

# [PLACEHOLDER_DIR]/routers/auth.py
from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/login")
@limiter.limit("5/minute") # Límit estricte per a login per IP
async def login(request: Request):
    return {"msg": "Intent de login"}

@router.post("/ai/analyze")
@limiter.limit("10/minute") # Límit per a crides cares
async def analyze_photo(request: Request):
    return {"msg": "Processant amb IA"}

@router.get("/health")
@limiter.exempt # Whitelist per health checks (ex. Docker o Nginx)
async def health_check():
    return {"status": "ok"}
```

## Validació
- Fer més de 5 crides al `/login` en 1 minut des de la mateixa IP i confirmar que la 6a crida retorna codi HTTP 429 Too Many Requests.
- Verificar que el cos de la resposta HTTP 429 inclou un missatge descriptiu de Slowapi (`"Rate limit exceeded"`).
- Comprovar que el límit no afecta l'endpoint `/health`.
- Reiniciar el servei FastAPI i comprovar que l'estat del rate limit persisteix perquè es guarda a Redis.

## Errors comuns
- **No passar el `request: Request` a la funció del router**: Slowapi necessita l'objecte `request` a l'endpoint o fallarà en obtenir la IP.
- **Ignorar proxys inversos**: Si no llegeixes `X-Forwarded-For`, totes les peticions vindran de la IP del proxy (Nginx) bloquejant tothom si hi ha trànsit.
- **Aplicar el mateix límit a usuaris i IPs no autenticades**: És millor separar o basar la key de Redis en un mix segons convingui.
