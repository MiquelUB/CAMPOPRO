from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from typing import List, Any
import asyncpg

from app.dependencies import get_db
from app.core.security import get_current_user, TokenPayload
from app.schemas.planols import PlanolCreate, PlanolUpdate, PlanolResponse

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_planol(
    planol_in: PlanolCreate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    query = """
        INSERT INTO planols (
            empresa_id, client_id, municipi_id, ubicacio_municipal, nom, tipus,
            versio, fitxer_original_url, imatge_renderitzada_url,
            bounds_json, opacitat_defecte, canvis_descripcio, creat_per_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
    """
    try:
        record = await db.fetchrow(
            query,
            current_user.empresa_id, planol_in.client_id, planol_in.municipi_id,
            planol_in.ubicacio_municipal, planol_in.nom, planol_in.tipus,
            planol_in.versio or 1, planol_in.fitxer_original_url,
            planol_in.imatge_renderitzada_url, planol_in.bounds_json,
            planol_in.opacitat_defecte or 0.7, planol_in.canvis_descripcio,
            current_user.sub
        )
        return dict(record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def read_planols(
    skip: int = 0,
    limit: int = 100,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    query = """
        SELECT * FROM planols
        WHERE empresa_id = $1 AND actiu = true
        ORDER BY created_at DESC
        OFFSET $2 LIMIT $3
    """
    records = await db.fetch(query, current_user.empresa_id, skip, limit)
    return [dict(r) for r in records]

@router.get("/{id}")
async def read_planol(
    id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    query = """
        SELECT * FROM planols
        WHERE id = $1 AND empresa_id = $2
    """
    record = await db.fetchrow(query, id, current_user.empresa_id)
    if not record:
        raise HTTPException(status_code=404, detail="Plànol no trobat")
    return dict(record)

@router.put("/{id}")
async def update_planol(
    id: str,
    planol_in: PlanolUpdate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    existing = await db.fetchrow(
        "SELECT * FROM planols WHERE id = $1 AND empresa_id = $2",
        id, current_user.empresa_id
    )
    if not existing:
        raise HTTPException(status_code=404, detail="Plànol no trobat")

    update_data = planol_in.model_dump(exclude_unset=True)
    if not update_data:
        return dict(existing)

    set_clauses = []
    values = [id, current_user.empresa_id]
    for i, (key, value) in enumerate(update_data.items(), start=3):
        set_clauses.append(f"{key} = ${i}")
        values.append(value)

    query = f"""
        UPDATE planols
        SET {', '.join(set_clauses)}
        WHERE id = $1 AND empresa_id = $2
        RETURNING *
    """
    record = await db.fetchrow(query, *values)
    return dict(record)

@router.delete("/{id}")
async def delete_planol(
    id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    result = await db.execute(
        "UPDATE planols SET actiu = false WHERE id = $1 AND empresa_id = $2",
        id, current_user.empresa_id
    )
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Plànol no trobat")
    return {"message": "Plànol esborrat correctament"}

@router.get("/{id}/download")
async def download_planol(
    id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    record = await db.fetchrow(
        "SELECT fitxer_original_url FROM planols WHERE id = $1 AND empresa_id = $2",
        id, current_user.empresa_id
    )
    if not record:
        raise HTTPException(status_code=404, detail="Plànol no trobat")
    return RedirectResponse(url=record['fitxer_original_url'])

@router.patch("/{id}/anchor-points")
async def update_anchor_points(
    id: str,
    bounds_json: dict,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    import json
    record = await db.fetchrow(
        """UPDATE planols SET bounds_json = $1
           WHERE id = $2 AND empresa_id = $3
           RETURNING *""",
        bounds_json, id, current_user.empresa_id
    )
    if not record:
        raise HTTPException(status_code=404, detail="Plànol no trobat")
    return dict(record)
