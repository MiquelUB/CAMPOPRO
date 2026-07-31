from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Pressupost Addicional ---
class PressupostAddicionalBase(BaseModel):
    import_estimat: float
    detalls: Optional[str] = None
    estat: Optional[str] = "Pendent"

class PressupostAddicionalCreate(PressupostAddicionalBase):
    incidencia_id: int

class PressupostAddicionalUpdate(BaseModel):
    import_estimat: Optional[float] = None
    detalls: Optional[str] = None
    estat: Optional[str] = None

class PressupostAddicionalInDB(PressupostAddicionalBase):
    id: int
    incidencia_id: int
    data_creacio: datetime

    class Config:
        from_attributes = True

# --- Incidencia ---
class IncidenciaBase(BaseModel):
    feina_id: int
    operari_id: int
    transcripcio_audio: Optional[str] = None
    foto_url: Optional[str] = None

class IncidenciaCreate(IncidenciaBase):
    pass

class IncidenciaUpdate(BaseModel):
    transcripcio_audio: Optional[str] = None
    foto_url: Optional[str] = None
    estat: Optional[str] = None
    memondum: Optional[Dict[str, Any]] = None
    requires_budget: Optional[bool] = None

class IncidenciaInDB(IncidenciaBase):
    id: int
    memondum: Optional[Dict[str, Any]] = None
    requires_budget: bool
    estat: str
    data_creacio: datetime
    pressupostos: List[PressupostAddicionalInDB] = []

    class Config:
        from_attributes = True
