from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime, date

class EquipamentBase(BaseModel):
    client_id: UUID
    nom: str
    tipus: str
    marca: Optional[str] = None
    model: Optional[str] = None
    data_instal_lacio: Optional[date] = None
    garantia_anys: Optional[int] = None
    data_ultima_revisio: Optional[date] = None
    notes: Optional[str] = None

class EquipamentCreate(EquipamentBase):
    pass

class EquipamentUpdate(EquipamentBase):
    client_id: Optional[UUID] = None
    nom: Optional[str] = None
    tipus: Optional[str] = None

class EquipamentResponse(EquipamentBase):
    id: UUID
    empresa_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
