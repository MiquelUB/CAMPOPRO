from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
import asyncpg

from app.dependencies import get_db
from app.core.security import get_current_user, TokenPayload
from app.schemas.municipis import MunicipiCreate, MunicipiUpdate, MunicipiResponse

router = APIRouter(prefix="/municipis", tags=["municipis"])

@router.get("/", response_model=List[MunicipiResponse])
async def llistar_municipis(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    cerca: Optional[str] = None,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        SELECT * FROM municipis
        WHERE empresa_id = $1
    """
    args = [current_user.empresa_id]
    
    if cerca:
        query += " AND nom ILIKE $2"
        args.append(f"%{cerca}%")
        query += " ORDER BY nom ASC OFFSET $3 LIMIT $4"
        args.extend([skip, limit])
    else:
        query += " ORDER BY nom ASC OFFSET $2 LIMIT $3"
        args.extend([skip, limit])
        
    records = await db.fetch(query, *args)
    return [dict(r) for r in records]

@router.post("/", response_model=MunicipiResponse, status_code=status.HTTP_201_CREATED)
async def crear_municipi(
    item: MunicipiCreate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        INSERT INTO municipis (empresa_id, nom, comarca, provincia, notes)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    """
    record = await db.fetchrow(
        query, 
        current_user.empresa_id,
        item.nom,
        item.comarca,
        item.provincia,
        item.notes
    )
    return dict(record)

@router.get("/{item_id}", response_model=MunicipiResponse)
async def obtenir_municipi(
    item_id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        SELECT * FROM municipis
        WHERE id = $1 AND empresa_id = $2
    """
    record = await db.fetchrow(query, item_id, current_user.empresa_id)
        
    if not record:
        raise HTTPException(status_code=404, detail="Municipi no trobat")
        
    return dict(record)

@router.patch("/{item_id}", response_model=MunicipiResponse)
async def actualitzar_municipi(
    item_id: str,
    item_data: MunicipiUpdate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    update_data = item_data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Cap camp per actualitzar proporcionat")
        
    set_clauses = []
    args = [item_id, current_user.empresa_id]
    arg_idx = 3
    
    for key, value in update_data.items():
        set_clauses.append(f"{key} = ${arg_idx}")
        args.append(value)
        arg_idx += 1
        
    set_query = ", ".join(set_clauses)
    
    query = f"""
        UPDATE municipis
        SET {set_query}
        WHERE id = $1 AND empresa_id = $2
        RETURNING *
    """
    
    record = await db.fetchrow(query, *args)
        
    if not record:
        raise HTTPException(status_code=404, detail="Municipi no trobat")
        
    return dict(record)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def esborrar_municipi(
    item_id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        DELETE FROM municipis
        WHERE id = $1 AND empresa_id = $2
        RETURNING id
    """
    try:
        record = await db.fetchrow(query, item_id, current_user.empresa_id)
    except asyncpg.exceptions.ForeignKeyViolationError:
        raise HTTPException(status_code=400, detail="El municipi té clients associats")
        
    if not record:
        raise HTTPException(status_code=404, detail="Municipi no trobat")
        
    return None
