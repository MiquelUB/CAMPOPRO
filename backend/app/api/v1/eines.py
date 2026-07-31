from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import asyncpg

from app.dependencies import get_db
from app.core.security import get_current_user, TokenPayload
from app.schemas.flota import Eina, EinaCreate, EinaUpdate, ReassignacioEina

router = APIRouter()

@router.get("/", response_model=List[Eina])
async def get_eines(
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        SELECT * FROM eines
        WHERE empresa_id = $1 AND actiu = true
    """
    records = await db.fetch(query, current_user.empresa_id)
    return [dict(r) for r in records]

@router.get("/{id}", response_model=Eina)
async def get_eina(
    id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        SELECT * FROM eines
        WHERE id = $1 AND empresa_id = $2 AND actiu = true
    """
    record = await db.fetchrow(query, id, current_user.empresa_id)
    if not record:
        raise HTTPException(status_code=404, detail="Eina no trobada")
    return dict(record)

@router.post("/", response_model=Eina, status_code=status.HTTP_201_CREATED)
async def create_eina(
    eina: EinaCreate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        INSERT INTO eines (
            empresa_id, codi, nom, categoria, marca, model, numero_serie,
            data_compra, preu_compra, estat, ubicacio_actual,
            operari_actual_id, ultima_revisio, propera_revisio,
            notes_manteniment, actiu
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
    """
    try:
        record = await db.fetchrow(
            query,
            current_user.empresa_id,
            eina.codi, eina.nom, eina.categoria, eina.marca,
            eina.model, eina.numero_serie, eina.data_compra,
            eina.preu_compra, eina.estat, eina.ubicacio_actual,
            eina.operari_actual_id, eina.ultima_revisio,
            eina.propera_revisio, eina.notes_manteniment, eina.actiu
        )
        return dict(record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{id}", response_model=Eina)
async def update_eina(
    id: str,
    eina: EinaUpdate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    # Retrieve existing
    existing = await db.fetchrow(
        "SELECT * FROM eines WHERE id = $1 AND empresa_id = $2",
        id, current_user.empresa_id
    )
    if not existing:
        raise HTTPException(status_code=404, detail="Eina no trobada")

    update_data = eina.model_dump(exclude_unset=True)
    if not update_data:
        return dict(existing)

    set_clauses = []
    values = [id, current_user.empresa_id]
    for i, (key, value) in enumerate(update_data.items(), start=3):
        set_clauses.append(f"{key} = ${i}")
        values.append(value)

    query = f"""
        UPDATE eines
        SET {', '.join(set_clauses)}
        WHERE id = $1 AND empresa_id = $2
        RETURNING *
    """
    try:
        record = await db.fetchrow(query, *values)
        return dict(record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_eina(
    id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    # Soft delete
    query = """
        UPDATE eines SET actiu = false
        WHERE id = $1 AND empresa_id = $2
    """
    result = await db.execute(query, id, current_user.empresa_id)
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Eina no trobada")
    return None

@router.post("/{id}/reassignar", response_model=Eina)
async def reassignar_eina(
    id: str,
    reassignacio: ReassignacioEina,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    # Verify user exists? In a real system maybe, here we rely on FK
    query = """
        UPDATE eines
        SET operari_actual_id = $1, ubicacio_actual = $2, estat = 'en_us'
        WHERE id = $3 AND empresa_id = $4 AND actiu = true
        RETURNING *
    """
    try:
        record = await db.fetchrow(
            query,
            reassignacio.operari_id,
            reassignacio.ubicacio,
            id,
            current_user.empresa_id
        )
        if not record:
            raise HTTPException(status_code=404, detail="Eina no trobada")
        return dict(record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
