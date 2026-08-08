from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
import asyncpg
import json

from app.dependencies import get_db
from app.core.security import get_current_user, get_current_user_optional, TokenPayload
from app.schemas.clients import ClientCreate, ClientUpdate, ClientResponse

router = APIRouter(prefix="/clients", tags=["clients"])

@router.get("", response_model=List[ClientResponse])
async def llistar_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    cerca: Optional[str] = None,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    query = """
        SELECT * FROM clients
        WHERE actiu = true
    """
    args = []
    if current_user.empresa_id:
        query += " AND (empresa_id = $1 OR empresa_id IS NULL)"
        args.append(current_user.empresa_id)

    if cerca:
        query += f" AND nom ILIKE ${len(args) + 1}"
        args.append(f"%{cerca}%")
        query += f" ORDER BY created_at DESC OFFSET ${len(args) + 1} LIMIT ${len(args) + 2}"
        args.extend([skip, limit])
    else:
        query += f" ORDER BY created_at DESC OFFSET ${len(args) + 1} LIMIT ${len(args) + 2}"
        args.extend([skip, limit])
        
    records = await db.fetch(query, *args)
    return [dict(r) for r in records]

@router.post("", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def crear_client(
    item: ClientCreate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    query = """
        INSERT INTO clients (
            empresa_id, nom, telefon, email, nif, adreca, lat, lng, 
            tipus, municipi_id, preferencies, notes, actiu
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
    """
    try:
        record = await db.fetchrow(
            query,
            current_user.empresa_id,
            item.nom,
            item.telefon,
            item.email,
            item.nif,
            item.adreca,
            item.lat,
            item.lng,
            item.tipus,
            item.municipi_id,
            json.dumps(item.preferencies) if item.preferencies else '{}',
            item.notes,
            item.actiu
        )
    except asyncpg.exceptions.ForeignKeyViolationError:
        raise HTTPException(status_code=400, detail="Municipi invàlid")

    return dict(record)

@router.get("/{item_id}", response_model=ClientResponse)
async def obtenir_client(
    item_id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        SELECT * FROM clients
        WHERE id = $1 AND empresa_id = $2 AND actiu = true
    """
    record = await db.fetchrow(query, item_id, current_user.empresa_id)
        
    if not record:
        raise HTTPException(status_code=404, detail="Client no trobat")
        
    return dict(record)

@router.patch("/{item_id}", response_model=ClientResponse)
async def actualitzar_client(
    item_id: str,
    item_data: ClientUpdate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    update_data = item_data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Cap camp per actualitzar proporcionat")
        
    if 'preferencies' in update_data:
        update_data['preferencies'] = json.dumps(update_data['preferencies'])
        
    set_clauses = []
    args = [item_id, current_user.empresa_id]
    arg_idx = 3
    
    for key, value in update_data.items():
        set_clauses.append(f"{key} = ${arg_idx}")
        args.append(value)
        arg_idx += 1
        
    set_query = ", ".join(set_clauses)
    
    query = f"""
        UPDATE clients
        SET {set_query}
        WHERE id = $1 AND empresa_id = $2 AND actiu = true
        RETURNING *
    """
    try:
        record = await db.fetchrow(query, *args)
    except asyncpg.exceptions.ForeignKeyViolationError:
        raise HTTPException(status_code=400, detail="Municipi invàlid")
        
    if not record:
        raise HTTPException(status_code=404, detail="Client no trobat")
        
    return dict(record)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def esborrar_client(
    item_id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        UPDATE clients
        SET actiu = false
        WHERE id = $1 AND empresa_id = $2 AND actiu = true
        RETURNING id
    """
    
    record = await db.fetchrow(query, item_id, current_user.empresa_id)
        
    if not record:
        raise HTTPException(status_code=404, detail="Client no trobat")
        
    return None
