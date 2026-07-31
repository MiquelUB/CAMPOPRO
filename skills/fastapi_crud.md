# Skill: FastAPI CRUD asyncpg

## Descripció
Aquesta skill proporciona un template per crear rutes CRUD a FastAPI utilitzant `asyncpg` amb connexions al pool, consultes parametritzades per evitar injecció SQL, paginació, filtres per `empresa_id` segons l'usuari actual i soft delete. És ideal per substituir clients de Supabase en el backend.

## Template

```python
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from asyncpg.pool import Pool

# Dependències assumides (cal implementar-les al teu projecte)
# from app.db.connection import get_db_pool
# from app.auth.deps import get_current_user

router = APIRouter(prefix="/[NOM_RECURS]", tags=["[NOM_RECURS]"])

class [NOM_MODEL]Base(BaseModel):
    nom: str
    descripcio: Optional[str] = None
    # [ALTRES_CAMPS]

class [NOM_MODEL]Create([NOM_MODEL]Base):
    pass

class [NOM_MODEL]Update(BaseModel):
    nom: Optional[str] = None
    descripcio: Optional[str] = None
    actiu: Optional[bool] = None
    # [ALTRES_CAMPS]

class [NOM_MODEL]Response([NOM_MODEL]Base):
    id: str
    empresa_id: str
    actiu: bool
    creat_el: datetime
    actualitzat_el: datetime

@router.get("/", response_model=List[[NOM_MODEL]Response])
async def llistar_[NOM_RECURS](
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    cerca: Optional[str] = None,
    db: Pool = Depends(get_db_pool),
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Llistar [NOM_RECURS] amb paginació i filtre de cerca.\"\"\"
    query = \"\"\"
        SELECT * FROM [TAULA_DB]
        WHERE empresa_id = $1 AND actiu = true
    \"\"\"
    args = [current_user['empresa_id']]
    
    if cerca:
        query += \" AND nom ILIKE $2\"
        args.append(f"%{cerca}%")
        query += \" ORDER BY creat_el DESC OFFSET $3 LIMIT $4\"
        args.extend([skip, limit])
    else:
        query += \" ORDER BY creat_el DESC OFFSET $2 LIMIT $3\"
        args.extend([skip, limit])
        
    async with db.acquire() as conn:
        records = await conn.fetch(query, *args)
        
    return [dict(r) for r in records]

@router.post("/", response_model=[NOM_MODEL]Response, status_code=status.HTTP_201_CREATED)
async def crear_[NOM_RECURS](
    item: [NOM_MODEL]Create,
    db: Pool = Depends(get_db_pool),
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Crear un nou [NOM_RECURS].\"\"\"
    query = \"\"\"
        INSERT INTO [TAULA_DB] (nom, descripcio, empresa_id)
        VALUES ($1, $2, $3)
        RETURNING *
    \"\"\"
    async with db.acquire() as conn:
        record = await conn.fetchrow(
            query, 
            item.nom, 
            item.descripcio, 
            current_user['empresa_id']
        )
    return dict(record)

@router.get("/{item_id}", response_model=[NOM_MODEL]Response)
async def obtenir_[NOM_RECURS](
    item_id: str,
    db: Pool = Depends(get_db_pool),
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Obtenir un [NOM_RECURS] específic per ID.\"\"\"
    query = \"\"\"
        SELECT * FROM [TAULA_DB]
        WHERE id = $1 AND empresa_id = $2 AND actiu = true
    \"\"\"
    async with db.acquire() as conn:
        record = await conn.fetchrow(query, item_id, current_user['empresa_id'])
        
    if not record:
        raise HTTPException(status_code=404, detail="[NOM_RECURS] no trobat")
        
    return dict(record)

@router.patch("/{item_id}", response_model=[NOM_MODEL]Response)
async def actualitzar_[NOM_RECURS](
    item_id: str,
    item_data: [NOM_MODEL]Update,
    db: Pool = Depends(get_db_pool),
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Actualitzar parcialment un [NOM_RECURS].\"\"\"
    update_data = item_data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Cap camp per actualitzar proporcionat")
        
    set_clauses = []
    args = [item_id, current_user['empresa_id']]
    arg_idx = 3
    
    for key, value in update_data.items():
        set_clauses.append(f"{key} = ${arg_idx}")
        args.append(value)
        arg_idx += 1
        
    set_query = ", ".join(set_clauses)
    
    query = f\"\"\"
        UPDATE [TAULA_DB]
        SET {set_query}, actualitzat_el = CURRENT_TIMESTAMP
        WHERE id = $1 AND empresa_id = $2 AND actiu = true
        RETURNING *
    \"\"\"
    
    async with db.acquire() as conn:
        record = await conn.fetchrow(query, *args)
        
    if not record:
        raise HTTPException(status_code=404, detail="[NOM_RECURS] no trobat")
        
    return dict(record)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def esborrar_[NOM_RECURS](
    item_id: str,
    db: Pool = Depends(get_db_pool),
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Esborrar de forma lògica (soft delete) un [NOM_RECURS].\"\"\"
    query = \"\"\"
        UPDATE [TAULA_DB]
        SET actiu = false, actualitzat_el = CURRENT_TIMESTAMP
        WHERE id = $1 AND empresa_id = $2 AND actiu = true
        RETURNING id
    \"\"\"
    
    async with db.acquire() as conn:
        record = await conn.fetchrow(query, item_id, current_user['empresa_id'])
        
    if not record:
        raise HTTPException(status_code=404, detail="[NOM_RECURS] no trobat")
        
    return None
```

## Exemple d'ús
Substitueix `[NOM_RECURS]` per `clients`, `[NOM_MODEL]` per `Client` i `[TAULA_DB]` per `clients`. Assegura't de tenir `get_db_pool` i `get_current_user` implementats adequadament.

## Validació
- Comprova que intentar accedir a l'ID d'una altra `empresa_id` retorna 404 (o no el retorna).
- Verifica que cridar el DELETE dues vegades sobre el mateix item retorna 404 a la segona trucada, ja que `actiu = true` fallarà.
- Comprova que l'injecció SQL no funcioni al camp `cerca`.

## Errors comuns
- Oblidar afegir `empresa_id = $x` al `WHERE` d'actualitzacions, permetent que un usuari esborri dades d'altres.
- Retornar `record` directament sense convertir-lo a `dict(record)`, la qual cosa pot fallar la serialització de Pydantic depenent de la versió.
- Passar paràmetres fora d'ordre en consultes on l'ordre de `args` és dinàmic (com el PATCH).
