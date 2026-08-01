from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
import asyncpg

from app.dependencies import get_db
from app.core.security import get_current_user, TokenPayload

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_incidencia(
    incidencia: dict,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    query = """
        INSERT INTO incidencies (
            empresa_id, feina_id, operari_id, tipus, gravetat,
            descripcio, transcripcio_audio, foto_url, lat, lng
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    """
    try:
        record = await db.fetchrow(
            query,
            current_user.empresa_id, incidencia.get("feina_id"),
            current_user.sub, incidencia.get("tipus", "general"),
            incidencia.get("gravetat", "baixa"), incidencia.get("descripcio"),
            incidencia.get("transcripcio_audio"), incidencia.get("foto_url"),
            incidencia.get("lat"), incidencia.get("lng")
        )
        return dict(record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def read_incidencies(
    skip: int = 0,
    limit: int = 100,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    query = """
        SELECT * FROM incidencies
        WHERE empresa_id = $1
        ORDER BY created_at DESC
        OFFSET $2 LIMIT $3
    """
    records = await db.fetch(query, current_user.empresa_id, skip, limit)
    return [dict(r) for r in records]

@router.get("/{incidencia_id}")
async def read_incidencia(
    incidencia_id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    record = await db.fetchrow(
        "SELECT * FROM incidencies WHERE id = $1 AND empresa_id = $2",
        incidencia_id, current_user.empresa_id
    )
    if not record:
        raise HTTPException(status_code=404, detail="Incidència no trobada")
    return dict(record)

@router.put("/{incidencia_id}")
async def update_incidencia(
    incidencia_id: str,
    incidencia: dict,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    existing = await db.fetchrow(
        "SELECT * FROM incidencies WHERE id = $1 AND empresa_id = $2",
        incidencia_id, current_user.empresa_id
    )
    if not existing:
        raise HTTPException(status_code=404, detail="Incidència no trobada")

    update_data = {k: v for k, v in incidencia.items() if v is not None}
    if not update_data:
        return dict(existing)

    set_clauses = []
    values = [incidencia_id, current_user.empresa_id]
    for i, (key, value) in enumerate(update_data.items(), start=3):
        set_clauses.append(f"{key} = ${i}")
        values.append(value)

    query = f"""
        UPDATE incidencies
        SET {', '.join(set_clauses)}
        WHERE id = $1 AND empresa_id = $2
        RETURNING *
    """
    record = await db.fetchrow(query, *values)
    return dict(record)

@router.delete("/{incidencia_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_incidencia(
    incidencia_id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    result = await db.execute(
        "DELETE FROM incidencies WHERE id = $1 AND empresa_id = $2",
        incidencia_id, current_user.empresa_id
    )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Incidència no trobada")
    return None
