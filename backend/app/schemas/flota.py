from pydantic import BaseModel, UUID4, Field
from typing import Optional, List
from datetime import date, datetime

class EinaBase(BaseModel):
    nom: str
    codi: Optional[str] = None
    categoria: Optional[str] = None
    marca: Optional[str] = None
    model: Optional[str] = None
    numero_serie: Optional[str] = None
    data_compra: Optional[date] = None
    preu_compra: Optional[float] = None
    estat: str = "disponible"
    ubicacio_actual: Optional[str] = None
    operari_actual_id: Optional[UUID4] = None
    ultima_revisio: Optional[date] = None
    propera_revisio: Optional[date] = None
    notes_manteniment: Optional[str] = None
    actiu: bool = True

class EinaCreate(EinaBase):
    pass

class EinaUpdate(BaseModel):
    nom: Optional[str] = None
    codi: Optional[str] = None
    categoria: Optional[str] = None
    marca: Optional[str] = None
    model: Optional[str] = None
    numero_serie: Optional[str] = None
    data_compra: Optional[date] = None
    preu_compra: Optional[float] = None
    estat: Optional[str] = None
    ubicacio_actual: Optional[str] = None
    operari_actual_id: Optional[UUID4] = None
    ultima_revisio: Optional[date] = None
    propera_revisio: Optional[date] = None
    notes_manteniment: Optional[str] = None
    actiu: Optional[bool] = None

class Eina(EinaBase):
    id: UUID4
    empresa_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReassignacioEina(BaseModel):
    operari_id: UUID4
    ubicacio: Optional[str] = None

class VehicleBase(BaseModel):
    tipus: str = "vehicle_km"
    nom: str
    matricula: Optional[str] = None
    marca: Optional[str] = None
    model: Optional[str] = None
    any_fabricacio: Optional[int] = None
    km_actual: Optional[float] = 0.0
    hores_acumulades: Optional[float] = 0.0
    itv_data_caducitat: Optional[date] = None
    seguro_polissa: Optional[str] = None
    seguro_companyia: Optional[str] = None
    seguro_data_caducitat: Optional[date] = None
    ultima_revisio: Optional[date] = None
    propera_revisio: Optional[date] = None
    interval_revisio_km: Optional[float] = None
    interval_revisio_hores: Optional[float] = None
    estat: str = "disponible"
    ubicacio_actual: Optional[str] = None
    operari_actual_id: Optional[UUID4] = None
    actiu: bool = True

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    tipus: Optional[str] = None
    nom: Optional[str] = None
    matricula: Optional[str] = None
    marca: Optional[str] = None
    model: Optional[str] = None
    any_fabricacio: Optional[int] = None
    km_actual: Optional[float] = None
    hores_acumulades: Optional[float] = None
    itv_data_caducitat: Optional[date] = None
    seguro_polissa: Optional[str] = None
    seguro_companyia: Optional[str] = None
    seguro_data_caducitat: Optional[date] = None
    ultima_revisio: Optional[date] = None
    propera_revisio: Optional[date] = None
    interval_revisio_km: Optional[float] = None
    interval_revisio_hores: Optional[float] = None
    estat: Optional[str] = None
    ubicacio_actual: Optional[str] = None
    operari_actual_id: Optional[UUID4] = None
    actiu: Optional[bool] = None

class Vehicle(VehicleBase):
    id: UUID4
    empresa_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AlertaVehicle(BaseModel):
    id: UUID4
    nom: str
    matricula: Optional[str] = None
    tipus_alerta: str # 'ITV', 'ASSEGURANSA', 'REVISIO'
    data_caducitat: Optional[date] = None
    dies_restants: Optional[int] = None
    km_restants: Optional[float] = None
    hores_restants: Optional[float] = None
