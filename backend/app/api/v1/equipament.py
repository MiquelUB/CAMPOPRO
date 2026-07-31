from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
import asyncpg

from app.dependencies import get_db
from app.core.security import get_current_user, TokenPayload
from app.schemas.equipament import EquipamentCreate, EquipamentUpdate, EquipamentResponse

router = APIRouter(prefix="/equipament", tags=["equipament"])

@router.get("/", response_model=List[EquipamentResponse])
async def llistar_equipaments(
    client_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    cerca: Optional[str] = None,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        SELECT * FROM equipament_instal_lat
        WHERE empresa_id = $1
    """
    args = [current_user.empresa_id]
    arg_idx = 2
    
    if client_id:
        query += f" AND client_id = ${arg_idx}"
        args.append(client_id)
        arg_idx += 1
        
    if cerca:
        query += f" AND nom ILIKE ${arg_idx}"
        args.append(f"%{cerca}%")
        arg_idx += 1
        
    query += f" ORDER BY created_at DESC OFFSET ${arg_idx} LIMIT ${arg_idx+1}"
    args.extend([skip, limit])
        
    records = await db.fetch(query, *args)
    return [dict(r) for r in records]

@router.post("/", response_model=EquipamentResponse, status_code=status.HTTP_201_CREATED)
async def crear_equipament(
    item: EquipamentCreate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    # Verify client exists and belongs to empresa
    client_query = "SELECT id FROM clients WHERE id = $1 AND empresa_id = $2 AND actiu = true"
    client = await db.fetchrow(client_query, str(item.client_id), current_user.empresa_id)
    if not client:
        raise HTTPException(status_code=400, detail="Client invàlid o no actiu")

    query = """
        INSERT INTO equipament_instal_lat (
            client_id, empresa_id, nom, tipus, marca, model, 
            data_instal_lacio, garantia_anys, data_ultima_revisio, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    """
    record = await db.fetchrow(
        query, 
        item.client_id,
        current_user.empresa_id,
        item.nom,
        item.tipus,
        item.marca,
        item.model,
        item.data_instal_lacio,
        item.garantia_anys,
        item.data_ultima_revisio,
        item.notes
    )
    return dict(record)

@router.get("/{item_id}", response_model=EquipamentResponse)
async def obtenir_equipament(
    item_id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        SELECT * FROM equipament_instal_lat
        WHERE id = $1 AND empresa_id = $2
    """
    record = await db.fetchrow(query, item_id, current_user.empresa_id)
        
    if not record:
        raise HTTPException(status_code=404, detail="Equipament no trobat")
        
    return dict(record)

@router.patch("/{item_id}", response_model=EquipamentResponse)
async def actualitzar_equipament(
    item_id: str,
    item_data: EquipamentUpdate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    update_data = item_data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Cap camp per actualitzar proporcionat")
        
    if 'client_id' in update_data:
        client_query = "SELECT id FROM clients WHERE id = $1 AND empresa_id = $2 AND actiu = true"
        client = await db.fetchrow(client_query, str(update_data['client_id']), current_user.empresa_id)
        if not client:
            raise HTTPException(status_code=400, detail="Client invàlid o no actiu")
            
    set_clauses = []
    args = [item_id, current_user.empresa_id]
    arg_idx = 3
    
    for key, value in update_data.items():
        set_clauses.append(f"{key} = ${arg_idx}")
        args.append(value)
        arg_idx += 1
        
    set_query = ", ".join(set_clauses)
    
    query = f"""
        UPDATE equipament_instal_lat
        SET {set_query}
        WHERE id = $1 AND empresa_id = $2
        RETURNING *
    """
    
    record = await db.fetchrow(query, *args)
        
    if not record:
        raise HTTPException(status_code=404, detail="Equipament no trobat")
        
    return dict(record)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def esborrar_equipament(
    item_id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        DELETE FROM equipament_instal_lat
        WHERE id = $1 AND empresa_id = $2
        RETURNING id
    """
    record = await db.fetchrow(query, item_id, current_user.empresa_id)
        
    if not record:
        raise HTTPException(status_code=404, detail="Equipament no trobat")
        
    return None
