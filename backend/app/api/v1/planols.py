from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Any
from uuid import UUID

from app.dependencies import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.planol import Planol
from app.schemas.planols import PlanolCreate, PlanolUpdate, PlanolResponse

router = APIRouter()

@router.post("/", response_model=PlanolResponse, status_code=status.HTTP_201_CREATED)
async def create_planol(
    *,
    db: AsyncSession = Depends(get_db),
    planol_in: PlanolCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    empresa_id = current_user.empresa_id
    
    planol = Planol(
        **planol_in.dict(),
        empresa_id=empresa_id,
        creat_per_id=current_user.id
    )
    
    db.add(planol)
    await db.commit()
    await db.refresh(planol)
    return planol

@router.get("/", response_model=List[PlanolResponse])
async def read_planols(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    query = select(Planol).where(
        Planol.empresa_id == current_user.empresa_id,
        Planol.actiu == True
    ).offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{id}", response_model=PlanolResponse)
async def read_planol(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    query = select(Planol).where(
        Planol.id == id,
        Planol.empresa_id == current_user.empresa_id
    )
    result = await db.execute(query)
    planol = result.scalar_one_or_none()
    
    if not planol:
        raise HTTPException(status_code=404, detail="Plànol no trobat")
        
    return planol

@router.put("/{id}", response_model=PlanolResponse)
async def update_planol(
    id: UUID,
    planol_in: PlanolUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    query = select(Planol).where(
        Planol.id == id,
        Planol.empresa_id == current_user.empresa_id
    )
    result = await db.execute(query)
    planol = result.scalar_one_or_none()
    
    if not planol:
        raise HTTPException(status_code=404, detail="Plànol no trobat")
        
    update_data = planol_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(planol, field, value)
        
    db.add(planol)
    await db.commit()
    await db.refresh(planol)
    return planol

@router.delete("/{id}")
async def delete_planol(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    query = select(Planol).where(
        Planol.id == id,
        Planol.empresa_id == current_user.empresa_id
    )
    result = await db.execute(query)
    planol = result.scalar_one_or_none()
    
    if not planol:
        raise HTTPException(status_code=404, detail="Plànol no trobat")
        
    # Soft delete
    planol.actiu = False
    db.add(planol)
    await db.commit()
    
    return {"message": "Plànol esborrat correctament"}

from fastapi.responses import RedirectResponse

@router.get("/{id}/download")
async def download_planol(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Planol).where(
        Planol.id == id,
        Planol.empresa_id == current_user.empresa_id
    )
    result = await db.execute(query)
    planol = result.scalar_one_or_none()
    
    if not planol:
        raise HTTPException(status_code=404, detail="Plànol no trobat")
        
    return RedirectResponse(url=planol.fitxer_original_url)

@router.patch("/{id}/anchor-points", response_model=PlanolResponse)
async def update_anchor_points(
    id: UUID,
    bounds_json: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Planol).where(
        Planol.id == id,
        Planol.empresa_id == current_user.empresa_id
    )
    result = await db.execute(query)
    planol = result.scalar_one_or_none()
    
    if not planol:
        raise HTTPException(status_code=404, detail="Plànol no trobat")
        
    planol.bounds_json = bounds_json
    db.add(planol)
    await db.commit()
    await db.refresh(planol)
    return planol
