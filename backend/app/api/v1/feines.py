from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from uuid import UUID
import datetime
import asyncpg

from app.dependencies import get_db
from app.core.security import get_current_user, get_current_user_optional, TokenPayload
from app.schemas.feines import FeinaCreate, FeinaUpdate, FeinaResponse

router = APIRouter()

async def generate_feina_codi(db: asyncpg.Connection, empresa_id: str) -> str:
    current_year = datetime.datetime.now().year
    prefix = f"F-{current_year}-"
    
    query = """
        SELECT codi FROM feines
        WHERE empresa_id = $1 AND codi LIKE $2
        ORDER BY codi DESC LIMIT 1
    """
    last_codi = await db.fetchval(query, empresa_id, f"{prefix}%")
    
    if last_codi:
        try:
            last_num = int(last_codi.split("-")[-1])
            new_num = last_num + 1
        except ValueError:
            new_num = 1
    else:
        new_num = 1
        
    return f"{prefix}{new_num:04d}"

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_feina(
    feina_in: FeinaCreate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional),
):
    empresa_id = current_user.empresa_id
    codi = await generate_feina_codi(db, empresa_id)
    
    query = """
        INSERT INTO feines (
            empresa_id, client_id, codi, titol, descripcio, tipus, estat,
            prioritat, lat, lng, adreca, data_programada,
            hora_inici_prevista, hora_fi_prevista, hores_estimades,
            material_assignat, area_m2
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
    """
    try:
        record = await db.fetchrow(
            query,
            empresa_id, feina_in.client_id, codi, feina_in.titol,
            feina_in.descripcio, feina_in.tipus, feina_in.estat or "pendent",
            feina_in.prioritat or 2, feina_in.lat, feina_in.lng,
            feina_in.adreca, feina_in.data_programada,
            feina_in.hora_inici_prevista, feina_in.hora_fi_prevista,
            feina_in.hores_estimades, feina_in.material_assignat,
            feina_in.area_m2
        )
        return dict(record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def read_feines(
    skip: int = 0,
    limit: int = 100,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional),
):
    query = """
        SELECT * FROM feines
        WHERE empresa_id = $1 AND actiu = true
        ORDER BY created_at DESC
        OFFSET $2 LIMIT $3
    """
    records = await db.fetch(query, current_user.empresa_id, skip, limit)
    return [dict(r) for r in records]

@router.get("/{id}")
async def read_feina(
    id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional),
):
    query = """
        SELECT * FROM feines
        WHERE id = $1 AND empresa_id = $2
    """
    record = await db.fetchrow(query, id, current_user.empresa_id)
    if not record:
        raise HTTPException(status_code=404, detail="Feina no trobada")
    return dict(record)

@router.put("/{id}")
async def update_feina(
    id: str,
    feina_in: FeinaUpdate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional),
):
    existing = await db.fetchrow(
        "SELECT * FROM feines WHERE id = $1 AND empresa_id = $2",
        id, current_user.empresa_id
    )
    if not existing:
        raise HTTPException(status_code=404, detail="Feina no trobada")
    
    update_data = feina_in.model_dump(exclude_unset=True)
    if not update_data:
        return dict(existing)

    set_clauses = []
    values = [id, current_user.empresa_id]
    for i, (key, value) in enumerate(update_data.items(), start=3):
        set_clauses.append(f"{key} = ${i}")
        values.append(value)

    query = f"""
        UPDATE feines
        SET {', '.join(set_clauses)}, updated_at = now()
        WHERE id = $1 AND empresa_id = $2
        RETURNING *
    """
    record = await db.fetchrow(query, *values)
    return dict(record)

@router.delete("/{id}")
async def delete_feina(
    id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional),
):
    result = await db.execute(
        "UPDATE feines SET actiu = false WHERE id = $1 AND empresa_id = $2",
        id, current_user.empresa_id
    )
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Feina no trobada")
    return {"message": "Feina esborrada correctament"}
