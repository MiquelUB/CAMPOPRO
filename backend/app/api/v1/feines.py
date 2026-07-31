from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from uuid import UUID
import datetime

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.feina import Feina
from app.schemas.feines import FeinaCreate, FeinaUpdate, FeinaResponse

router = APIRouter()

async def generate_feina_codi(db: AsyncSession, empresa_id: UUID) -> str:
    current_year = datetime.datetime.now().year
    prefix = f"F-{current_year}-"
    
    # Use func.max to get the highest code for the current year
    query = select(Feina.codi).where(
        Feina.empresa_id == empresa_id,
        Feina.codi.like(f"{prefix}%")
    ).order_by(Feina.codi.desc()).limit(1)
    
    result = await db.execute(query)
    last_codi = result.scalar_one_or_none()
    
    if last_codi:
        try:
            last_num = int(last_codi.split("-")[-1])
            new_num = last_num + 1
        except ValueError:
            new_num = 1
    else:
        new_num = 1
        
    return f"{prefix}{new_num:04d}"

@router.post("/", response_model=FeinaResponse, status_code=status.HTTP_201_CREATED)
async def create_feina(
    *,
    db: AsyncSession = Depends(get_db),
    feina_in: FeinaCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    empresa_id = current_user.empresa_id
    codi = await generate_feina_codi(db, empresa_id)
    
    feina = Feina(
        **feina_in.dict(),
        empresa_id=empresa_id,
        codi=codi
    )
    
    db.add(feina)
    await db.commit()
    await db.refresh(feina)
    return feina

@router.get("/", response_model=List[FeinaResponse])
async def read_feines(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    query = select(Feina).where(
        Feina.empresa_id == current_user.empresa_id,
        Feina.actiu == True
    ).offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{id}", response_model=FeinaResponse)
async def read_feina(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    query = select(Feina).where(
        Feina.id == id,
        Feina.empresa_id == current_user.empresa_id
    )
    result = await db.execute(query)
    feina = result.scalar_one_or_none()
    
    if not feina:
        raise HTTPException(status_code=404, detail="Feina no trobada")
        
    return feina

@router.put("/{id}", response_model=FeinaResponse)
async def update_feina(
    id: UUID,
    feina_in: FeinaUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    query = select(Feina).where(
        Feina.id == id,
        Feina.empresa_id == current_user.empresa_id
    )
    result = await db.execute(query)
    feina = result.scalar_one_or_none()
    
    if not feina:
        raise HTTPException(status_code=404, detail="Feina no trobada")
        
    update_data = feina_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(feina, field, value)
        
    db.add(feina)
    await db.commit()
    await db.refresh(feina)
    return feina

@router.delete("/{id}")
async def delete_feina(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    query = select(Feina).where(
        Feina.id == id,
        Feina.empresa_id == current_user.empresa_id
    )
    result = await db.execute(query)
    feina = result.scalar_one_or_none()
    
    if not feina:
        raise HTTPException(status_code=404, detail="Feina no trobada")
        
    # Soft delete
    feina.actiu = False
    db.add(feina)
    await db.commit()
    
    return {"message": "Feina esborrada correctament"}
