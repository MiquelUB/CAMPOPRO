from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import asyncpg
from uuid import UUID
from app.dependencies import get_db
from app.schemas.proveidor import ProveidorCreate, ProveidorUpdate, ProveidorResponse

router = APIRouter()

@router.get("/", response_model=List[ProveidorResponse])
async def llistar_proveidors(db: asyncpg.Connection = Depends(get_db)):
    query = """
        SELECT id, empresa_id, nif, nom, categoria, contacte, telefon, email, adreca, productes, descompte, forma_pagament, condicions_pagament, iban, creat_a, actualitzat_a
        FROM proveidors
        ORDER BY creat_a DESC
    """
    records = await db.fetch(query)
    return [dict(r) for r in records]

@router.post("/", response_model=ProveidorResponse, status_code=status.HTTP_201_CREATED)
async def crear_proveidor(
    proveidor: ProveidorCreate,
    db: asyncpg.Connection = Depends(get_db)
):
    query = """
        INSERT INTO proveidors (nif, nom, categoria, contacte, telefon, email, adreca, productes, descompte, forma_pagament, condicions_pagament, iban)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, empresa_id, nif, nom, categoria, contacte, telefon, email, adreca, productes, descompte, forma_pagament, condicions_pagament, iban, creat_a, actualitzat_a
    """
    record = await db.fetchrow(
        query,
        proveidor.nif, proveidor.nom, proveidor.categoria, proveidor.contacte, proveidor.telefon,
        proveidor.email, proveidor.adreca, proveidor.productes, proveidor.descompte, proveidor.forma_pagament,
        proveidor.condicions_pagament, proveidor.iban
    )
    return dict(record)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def esborrar_proveidor(
    item_id: UUID,
    db: asyncpg.Connection = Depends(get_db)
):
    query = "DELETE FROM proveidors WHERE id = $1 RETURNING id"
    record = await db.fetchrow(query, item_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proveidor no trobat")
    return None
