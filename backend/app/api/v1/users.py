from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import asyncpg
from uuid import UUID
from app.dependencies import get_db
from app.models.user import Usuari
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.core.security import get_current_user, require_super_admin, TokenPayload, get_password_hash

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def llistar_usuaris(
    db: asyncpg.Connection = Depends(get_db),
    # current_user: TokenPayload = Depends(require_super_admin)  # Descomentar si volem forçar admin
):
    # En un entorn real filtraríem per empresa_id
    query = """
        SELECT id, empresa_id, rol, nom, telefon, email, vehicle_assignat, actiu, created_at, updated_at
        FROM usuaris
        ORDER BY created_at DESC
    """
    records = await db.fetch(query)
    return [dict(r) for r in records]

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def crear_usuari(
    usuari: UserCreate,
    db: asyncpg.Connection = Depends(get_db)
):
    query = """
        INSERT INTO usuaris (rol, nom, telefon, email, vehicle_assignat, actiu, password_hash, pin_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, empresa_id, rol, nom, telefon, email, vehicle_assignat, actiu, created_at, updated_at
    """
    password_hash = get_password_hash(usuari.password) if usuari.password else None
    pin_hash = get_password_hash(usuari.pin) if usuari.pin else None

    record = await db.fetchrow(
        query,
        usuari.rol,
        usuari.nom,
        usuari.telefon,
        usuari.email,
        usuari.vehicle_assignat,
        usuari.actiu,
        password_hash,
        pin_hash
    )
    return dict(record)

@router.get("/{user_id}", response_model=UserResponse)
async def obtenir_usuari(
    user_id: UUID,
    db: asyncpg.Connection = Depends(get_db)
):
    query = """
        SELECT id, empresa_id, rol, nom, telefon, email, vehicle_assignat, actiu, created_at, updated_at
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
    db: asyncpg.Connection = Depends(get_db)
):
    # Verify exists
    existing = await obtenir_usuari(user_id, db)
    
    update_data = usuari_update.dict(exclude_unset=True)
    if not update_data:
        return existing
        
    if "password" in update_data and update_data["password"]:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))
    if "pin" in update_data and update_data["pin"]:
        update_data["pin_hash"] = get_password_hash(update_data.pop("pin"))
        
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
    db: asyncpg.Connection = Depends(get_db)
):
    query = "DELETE FROM usuaris WHERE id = $1 RETURNING id"
    record = await db.fetchrow(query, user_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuari no trobat")
    return None
