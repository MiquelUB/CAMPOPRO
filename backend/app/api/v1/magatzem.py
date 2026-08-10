from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
import asyncpg

from app.dependencies import get_db
from app.core.security import get_current_user_optional, TokenPayload
from app.schemas.magatzem import Producte, ProducteCreate, MovimentMagatzem, MovimentMagatzemCreate

router = APIRouter()

@router.get("/productes", response_model=List[Producte])
async def get_productes(
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    query = """
        SELECT * FROM producte
        WHERE empresa_id = $1
    """
    records = await db.fetch(query, current_user.empresa_id)
    return [dict(r) for r in records]

@router.post("/productes", response_model=Producte, status_code=status.HTTP_201_CREATED)
async def create_producte(
    item: ProducteCreate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    query = """
        INSERT INTO producte (
            empresa_id, categoria_id, nom, codi_barres, descripcio,
            preu_unitari, unitat_mesura, estoc_minim, estoc_actual
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    """
    try:
        record = await db.fetchrow(
            query,
            current_user.empresa_id,
            item.categoria_id,
            item.nom,
            item.codi_barres,
            item.descripcio,
            item.preu_unitari,
            item.unitat_mesura,
            item.estoc_minim,
            item.estoc_actual
        )
        return dict(record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/productes/stock_minim", response_model=List[Producte])
async def get_productes_stock_minim(
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    query = """
        SELECT * FROM producte
        WHERE empresa_id = $1 AND estoc_actual <= estoc_minim
    """
    records = await db.fetch(query, current_user.empresa_id)
    return [dict(r) for r in records]

@router.post("/moviments", response_model=MovimentMagatzem, status_code=status.HTTP_201_CREATED)
async def create_moviment(
    item: MovimentMagatzemCreate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    # Retrieve product to check stock
    producte = await db.fetchrow(
        "SELECT * FROM producte WHERE id = $1 AND empresa_id = $2",
        item.producte_id, current_user.empresa_id
    )
    if not producte:
        raise HTTPException(status_code=404, detail="Producte no trobat")

    nou_estoc = float(producte['estoc_actual'])
    
    if item.tipus == 'ENTRADA':
        nou_estoc += item.quantitat
    elif item.tipus == 'SORTIDA':
        if nou_estoc < item.quantitat:
            raise HTTPException(status_code=400, detail="Estoc insuficient")
        nou_estoc -= item.quantitat
    elif item.tipus == 'AJUST':
        nou_estoc = item.quantitat
    else:
        raise HTTPException(status_code=400, detail="Tipus de moviment no vàlid")

    async with db.transaction():
        # Update product stock
        await db.execute(
            "UPDATE producte SET estoc_actual = $1 WHERE id = $2",
            nou_estoc, item.producte_id
        )

        # Insert movement
        query = """
            INSERT INTO moviment_magatzem (
                empresa_id, producte_id, tipus, quantitat, motiu, usuari_id
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        """
        record = await db.fetchrow(
            query,
            current_user.empresa_id,
            item.producte_id,
            item.tipus,
            item.quantitat,
            item.motiu,
            current_user.sub
        )
        
    return dict(record)

@router.get("/moviments", response_model=List[MovimentMagatzem])
async def get_moviments(
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user_optional)
):
    query = """
        SELECT * FROM moviment_magatzem
        WHERE empresa_id = $1
        ORDER BY data_moviment DESC
    """
    records = await db.fetch(query, current_user.empresa_id)
    return [dict(r) for r in records]
