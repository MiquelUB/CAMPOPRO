from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
import asyncpg

from app.dependencies import get_db
from app.core.security import get_current_user, TokenPayload

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_pressupost(
    pressupost: dict,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    # Verify incidencia exists
    incidencia = await db.fetchrow(
        "SELECT id FROM incidencies WHERE id = $1 AND empresa_id = $2",
        pressupost.get("incidencia_id"), current_user.empresa_id
    )
    if not incidencia:
        raise HTTPException(status_code=404, detail="Incidència no trobada")

    query = """
        INSERT INTO pressupostos_addicionals (
            empresa_id, incidencia_id, descripcio, import_estimat,
            estat, creat_per_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    """
    try:
        record = await db.fetchrow(
            query,
            current_user.empresa_id, pressupost.get("incidencia_id"),
            pressupost.get("descripcio"), pressupost.get("import_estimat"),
            pressupost.get("estat", "pendent"), current_user.sub
        )
        return dict(record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def read_pressupostos(
    skip: int = 0,
    limit: int = 100,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    query = """
        SELECT * FROM pressupostos_addicionals
        WHERE empresa_id = $1
        ORDER BY created_at DESC
        OFFSET $2 LIMIT $3
    """
    records = await db.fetch(query, current_user.empresa_id, skip, limit)
    return [dict(r) for r in records]

@router.get("/{pressupost_id}")
async def read_pressupost(
    pressupost_id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    record = await db.fetchrow(
        "SELECT * FROM pressupostos_addicionals WHERE id = $1 AND empresa_id = $2",
        pressupost_id, current_user.empresa_id
    )
    if not record:
        raise HTTPException(status_code=404, detail="Pressupost no trobat")
    return dict(record)

@router.put("/{pressupost_id}")
async def update_pressupost(
    pressupost_id: str,
    pressupost: dict,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    existing = await db.fetchrow(
        "SELECT * FROM pressupostos_addicionals WHERE id = $1 AND empresa_id = $2",
        pressupost_id, current_user.empresa_id
    )
    if not existing:
        raise HTTPException(status_code=404, detail="Pressupost no trobat")

    update_data = {k: v for k, v in pressupost.items() if v is not None}
    if not update_data:
        return dict(existing)

    set_clauses = []
    values = [pressupost_id, current_user.empresa_id]
    for i, (key, value) in enumerate(update_data.items(), start=3):
        set_clauses.append(f"{key} = ${i}")
        values.append(value)

    query = f"""
        UPDATE pressupostos_addicionals
        SET {', '.join(set_clauses)}
        WHERE id = $1 AND empresa_id = $2
        RETURNING *
    """
    record = await db.fetchrow(query, *values)
    return dict(record)

@router.delete("/{pressupost_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pressupost(
    pressupost_id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    result = await db.execute(
        "DELETE FROM pressupostos_addicionals WHERE id = $1 AND empresa_id = $2",
        pressupost_id, current_user.empresa_id
    )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Pressupost no trobat")
    return None
