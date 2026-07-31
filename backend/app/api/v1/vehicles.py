from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import asyncpg
from datetime import date, timedelta

from app.dependencies import get_db
from app.core.security import get_current_user, TokenPayload
from app.schemas.flota import Vehicle, VehicleCreate, VehicleUpdate, AlertaVehicle

router = APIRouter()

@router.get("/", response_model=List[Vehicle])
async def get_vehicles(
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        SELECT * FROM vehicles
        WHERE empresa_id = $1 AND actiu = true
    """
    records = await db.fetch(query, current_user.empresa_id)
    return [dict(r) for r in records]

@router.get("/alertes", response_model=List[AlertaVehicle])
async def get_alertes_vehicles(
    dies_avis: int = 30,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    alertes = []
    data_limit = date.today() + timedelta(days=dies_avis)
    
    query = """
        SELECT id, nom, matricula, itv_data_caducitat, seguro_data_caducitat, propera_revisio
        FROM vehicles
        WHERE empresa_id = $1 AND actiu = true
    """
    vehicles = await db.fetch(query, current_user.empresa_id)
    
    for v in vehicles:
        if v['itv_data_caducitat'] and v['itv_data_caducitat'] <= data_limit:
            dies = (v['itv_data_caducitat'] - date.today()).days
            alertes.append({
                "id": v['id'],
                "nom": v['nom'],
                "matricula": v['matricula'],
                "tipus_alerta": "ITV",
                "data_caducitat": v['itv_data_caducitat'],
                "dies_restants": dies
            })
        
        if v['seguro_data_caducitat'] and v['seguro_data_caducitat'] <= data_limit:
            dies = (v['seguro_data_caducitat'] - date.today()).days
            alertes.append({
                "id": v['id'],
                "nom": v['nom'],
                "matricula": v['matricula'],
                "tipus_alerta": "ASSEGURANSA",
                "data_caducitat": v['seguro_data_caducitat'],
                "dies_restants": dies
            })
            
        if v['propera_revisio'] and v['propera_revisio'] <= data_limit:
            dies = (v['propera_revisio'] - date.today()).days
            alertes.append({
                "id": v['id'],
                "nom": v['nom'],
                "matricula": v['matricula'],
                "tipus_alerta": "REVISIO",
                "data_caducitat": v['propera_revisio'],
                "dies_restants": dies
            })
            
    # Podríem afegir alertes per KM o Hores si tinguéssim la lògica
    return alertes

@router.get("/{id}", response_model=Vehicle)
async def get_vehicle(
    id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        SELECT * FROM vehicles
        WHERE id = $1 AND empresa_id = $2 AND actiu = true
    """
    record = await db.fetchrow(query, id, current_user.empresa_id)
    if not record:
        raise HTTPException(status_code=404, detail="Vehicle no trobat")
    return dict(record)

@router.post("/", response_model=Vehicle, status_code=status.HTTP_201_CREATED)
async def create_vehicle(
    vehicle: VehicleCreate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        INSERT INTO vehicles (
            empresa_id, tipus, nom, matricula, marca, model, any_fabricacio,
            km_actual, hores_acumulades, itv_data_caducitat, seguro_polissa,
            seguro_companyia, seguro_data_caducitat, ultima_revisio,
            propera_revisio, interval_revisio_km, interval_revisio_hores,
            estat, ubicacio_actual, operari_actual_id, actiu
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
            $15, $16, $17, $18, $19, $20, $21
        )
        RETURNING *
    """
    try:
        record = await db.fetchrow(
            query,
            current_user.empresa_id,
            vehicle.tipus, vehicle.nom, vehicle.matricula, vehicle.marca,
            vehicle.model, vehicle.any_fabricacio, vehicle.km_actual,
            vehicle.hores_acumulades, vehicle.itv_data_caducitat,
            vehicle.seguro_polissa, vehicle.seguro_companyia,
            vehicle.seguro_data_caducitat, vehicle.ultima_revisio,
            vehicle.propera_revisio, vehicle.interval_revisio_km,
            vehicle.interval_revisio_hores, vehicle.estat,
            vehicle.ubicacio_actual, vehicle.operari_actual_id, vehicle.actiu
        )
        return dict(record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{id}", response_model=Vehicle)
async def update_vehicle(
    id: str,
    vehicle: VehicleUpdate,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    existing = await db.fetchrow(
        "SELECT * FROM vehicles WHERE id = $1 AND empresa_id = $2",
        id, current_user.empresa_id
    )
    if not existing:
        raise HTTPException(status_code=404, detail="Vehicle no trobat")

    update_data = vehicle.model_dump(exclude_unset=True)
    if not update_data:
        return dict(existing)

    set_clauses = []
    values = [id, current_user.empresa_id]
    for i, (key, value) in enumerate(update_data.items(), start=3):
        set_clauses.append(f"{key} = ${i}")
        values.append(value)

    query = f"""
        UPDATE vehicles
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
async def delete_vehicle(
    id: str,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user)
):
    query = """
        UPDATE vehicles SET actiu = false
        WHERE id = $1 AND empresa_id = $2
    """
    result = await db.execute(query, id, current_user.empresa_id)
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Vehicle no trobat")
    return None
