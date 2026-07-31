from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import asyncpg
from app.dependencies import get_db
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    TokenPayload,
    get_current_user,
    require_super_admin
)

router = APIRouter()

class LoginPinRequest(BaseModel):
    telefon: str
    pin: str

class LoginEmailRequest(BaseModel):
    email: str
    password: str
    totp_code: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    rol: str

class RefreshRequest(BaseModel):
    refresh_token: str

class ImpersonateRequest(BaseModel):
    empresa_id: str

@router.post("/login/pin", response_model=TokenResponse)
async def login_pin(req: LoginPinRequest, db: asyncpg.Connection = Depends(get_db)):
    user = await db.fetchrow("SELECT * FROM usuaris WHERE telefon = $1 AND actiu = true", req.telefon)
    if not user or not user["pin_hash"]:
        raise HTTPException(status_code=401, detail="Telèfon o PIN incorrecte")
    
    if not verify_password(req.pin, user["pin_hash"]):
        raise HTTPException(status_code=401, detail="Telèfon o PIN incorrecte")
    
    if user["rol"] != "operari":
         raise HTTPException(status_code=403, detail="Aquest login és només per a operaris")

    payload = {
        "sub": str(user["id"]),
        "empresa_id": str(user["empresa_id"]) if user["empresa_id"] else None,
        "rol": user["rol"],
        "session_type": "normal"
    }
    
    return {
        "access_token": create_access_token(payload),
        "refresh_token": create_refresh_token(payload),
        "rol": user["rol"]
    }

@router.post("/login/email", response_model=TokenResponse)
async def login_email(req: LoginEmailRequest, db: asyncpg.Connection = Depends(get_db)):
    user = await db.fetchrow("SELECT * FROM usuaris WHERE email = $1 AND actiu = true", req.email)
    if not user or not user["password_hash"]:
        raise HTTPException(status_code=401, detail="Email o contrasenya incorrecte")
    
    if not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email o contrasenya incorrecte")
        
    if user["totp_activat"]:
        # Manca validació real del TOTP per ara, es pot afegir després
        if not req.totp_code:
            raise HTTPException(status_code=401, detail="Codi TOTP requerit")
            
    payload = {
        "sub": str(user["id"]),
        "empresa_id": str(user["empresa_id"]) if user["empresa_id"] else None,
        "rol": user["rol"],
        "session_type": "normal"
    }
    
    return {
        "access_token": create_access_token(payload),
        "refresh_token": create_refresh_token(payload),
        "rol": user["rol"]
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(req: RefreshRequest):
    from app.config import get_settings
    settings = get_settings()
    import jwt
    from datetime import datetime, timezone
    from app.core.security import check_token_in_blacklist
    
    if await check_token_in_blacklist(req.refresh_token):
        raise HTTPException(status_code=401, detail="Token revocat")
        
    try:
        payload = jwt.decode(req.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if datetime.fromtimestamp(payload['exp'], tz=timezone.utc) < datetime.now(timezone.utc):
             raise HTTPException(status_code=401, detail="Token expirat")
             
        new_payload = {
            "sub": payload["sub"],
            "empresa_id": payload.get("empresa_id"),
            "rol": payload["rol"],
            "session_type": payload.get("session_type", "normal")
        }
        return {
            "access_token": create_access_token(new_payload),
            "refresh_token": create_refresh_token(new_payload),
            "rol": payload["rol"]
        }
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Refresh token invàlid")

@router.post("/impersonate", response_model=TokenResponse)
async def impersonate(req: ImpersonateRequest, user: TokenPayload = Depends(require_super_admin)):
    payload = {
        "sub": user.sub,
        "empresa_id": req.empresa_id,
        "rol": user.rol,
        "session_type": "impersonation"
    }
    return {
        "access_token": create_access_token(payload),
        "refresh_token": create_refresh_token(payload),
        "rol": user.rol
    }

from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timezone

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/login")

@router.post("/logout")
async def logout(user: TokenPayload = Depends(get_current_user), token: str = Depends(oauth2_scheme)):
    from app.core.security import blacklist_token
    now = datetime.now(timezone.utc)
    remaining = int((user.exp - now).total_seconds())
    if remaining > 0:
        await blacklist_token(token, remaining)
    return {"message": "Logout correcte"}
