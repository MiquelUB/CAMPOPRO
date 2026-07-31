from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class PlanolBase(BaseModel):
    client_id: UUID
    municipi_id: Optional[UUID] = None
    ubicacio_municipal: Optional[str] = None
    nom: str
    tipus: str
    fitxer_original_url: str
    imatge_renderitzada_url: Optional[str] = None
    bounds_json: Optional[Dict[str, Any]] = None
    opacitat_defecte: Optional[float] = 0.7
    canvis_descripcio: Optional[str] = None
    descripcio_ia: Optional[str] = None
    feina_origen_id: Optional[UUID] = None

class PlanolCreate(PlanolBase):
    pass

class PlanolUpdate(BaseModel):
    nom: Optional[str] = None
    imatge_renderitzada_url: Optional[str] = None
    bounds_json: Optional[Dict[str, Any]] = None
    opacitat_defecte: Optional[float] = None
    canvis_descripcio: Optional[str] = None
    descripcio_ia: Optional[str] = None
    actiu: Optional[bool] = None

class PlanolResponse(PlanolBase):
    id: UUID
    empresa_id: UUID
    versio: int
    versio_anterior_id: Optional[UUID] = None
    creat_per_id: UUID
    actiu: bool
    created_at: datetime

    class Config:
        orm_mode = True
