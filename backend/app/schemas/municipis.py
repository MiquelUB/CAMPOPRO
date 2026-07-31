from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class MunicipiBase(BaseModel):
    nom: str
    comarca: Optional[str] = None
    provincia: Optional[str] = None
    notes: Optional[str] = None

class MunicipiCreate(MunicipiBase):
    pass

class MunicipiUpdate(MunicipiBase):
    nom: Optional[str] = None

class MunicipiResponse(MunicipiBase):
    id: UUID
    empresa_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
