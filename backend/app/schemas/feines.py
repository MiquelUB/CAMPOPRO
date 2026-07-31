from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import date, time, datetime
from uuid import UUID

class FeinaBase(BaseModel):
    client_id: UUID
    titol: str
    descripcio: Optional[str] = None
    tipus: str
    prioritat: int = 2
    lat: Optional[float] = None
    lng: Optional[float] = None
    adreca: Optional[str] = None
    data_programada: date
    hora_inici_prevista: Optional[time] = None
    hora_fi_prevista: Optional[time] = None
    hores_estimades: Optional[float] = None
    percentatge_incidencia_estimat: Optional[float] = 0
    material_assignat: Optional[List[dict]] = []
    planol_id: Optional[UUID] = None
    area_m2: Optional[float] = None
    observacions: Optional[str] = None

class FeinaCreate(FeinaBase):
    pass

class FeinaUpdate(BaseModel):
    titol: Optional[str] = None
    descripcio: Optional[str] = None
    tipus: Optional[str] = None
    estat: Optional[str] = None
    prioritat: Optional[int] = None
    data_programada: Optional[date] = None
    hora_inici_prevista: Optional[time] = None
    hora_fi_prevista: Optional[time] = None
    hores_estimades: Optional[float] = None
    hores_reals: Optional[float] = None
    percentatge_incidencia_estimat: Optional[float] = None
    material_assignat: Optional[List[dict]] = None
    material_consumit: Optional[List[dict]] = None
    resultat: Optional[str] = None
    observacions: Optional[str] = None
    valoracio_client: Optional[int] = None
    actiu: Optional[bool] = None

class FeinaResponse(FeinaBase):
    id: UUID
    empresa_id: UUID
    codi: str
    estat: str
    hores_reals: Optional[float] = 0
    material_consumit: Optional[List[dict]] = []
    resultat: Optional[str] = None
    valoracio_client: Optional[int] = None
    actiu: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
