from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import asyncpg
from uuid import UUID
from app.dependencies import get_db
from app.models.user import Usuari
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.core.security import get_current_user, require_super_admin, TokenPayload, hash_password, get_current_user_optional

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def llistar_usuaris(
    skip: int = 0,
    limit: int = 100,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    query = """
        SELECT * FROM usuaris
        WHERE actiu = true
    """
    args = []
    if current_user and current_user.empresa_id:
        query += " AND (empresa_id = $1 OR empresa_id IS NULL)"
        args.append(current_user.empresa_id)
        
    query += f" ORDER BY created_at DESC OFFSET ${len(args) + 1} LIMIT ${len(args) + 2}"
    args.extend([skip, limit])
    
    records = await db.fetch(query, *args)
    return [dict(r) for r in records]

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def crear_usuari(
    usuari: UserCreate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    query = """
        INSERT INTO usuaris (empresa_id, rol, nom, telefon, email, vehicle_assignat, especialitat, cap_de_grup_id, actiu, password_hash, pin_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, empresa_id, rol, nom, telefon, email, vehicle_assignat, especialitat, cap_de_grup_id, actiu, created_at, updated_at
    """
    password_hash = hash_password(usuari.password) if usuari.password else None
    pin_hash = hash_password(usuari.pin) if usuari.pin else None

    try:
        record = await db.fetchrow(
            query,
            current_user.empresa_id if current_user else None,
            usuari.rol or "OPERARI_PWA",
            usuari.nom,
            usuari.telefon,
            usuari.email,
            usuari.vehicle_assignat,
            usuari.especialitat,
            usuari.cap_de_grup_id,
            usuari.actiu,
            password_hash,
            pin_hash
        )
        return dict(record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}", response_model=UserResponse)
async def obtenir_usuari(
    user_id: UUID,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    query = """
        SELECT id, empresa_id, rol, nom, telefon, email, vehicle_assignat, especialitat, cap_de_grup_id, actiu, created_at, updated_at
        FROM usuaris
        WHERE id = $1
    """
    record = await db.fetchrow(query, user_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuari no trobat")
    return dict(record)

@router.patch("/{user_id}", response_model=UserResponse)
async def actualitzar_usuari(
    user_id: UUID,
    usuari_update: UserUpdate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    # Verify exists
    existing = await obtenir_usuari(user_id, db)
    
    update_data = usuari_update.dict(exclude_unset=True)
    if not update_data:
        return existing
        
    if "password" in update_data and update_data["password"]:
        update_data["password_hash"] = hash_password(update_data.pop("password"))
    if "pin" in update_data and update_data["pin"]:
        update_data["pin_hash"] = hash_password(update_data.pop("pin"))
        
    set_clauses = []
    values = []
    for i, (key, value) in enumerate(update_data.items(), start=2):
        set_clauses.append(f"{key} = ${i}")
        values.append(value)
        
    set_query = ", ".join(set_clauses)
    query = f"""
        UPDATE usuaris
        SET {set_query}, updated_at = NOW()
        WHERE id = $1
        RETURNING id, empresa_id, rol, nom, telefon, email, vehicle_assignat, actiu, created_at, updated_at
    """
    record = await db.fetchrow(query, user_id, *values)
    return dict(record)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def esborrar_usuari(
    user_id: UUID,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    query = "DELETE FROM usuaris WHERE id = $1 RETURNING id"
    record = await db.fetchrow(query, user_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuari no trobat")
    return None
