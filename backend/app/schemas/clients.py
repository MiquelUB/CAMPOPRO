from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime

class ClientBase(BaseModel):
    nom: str
    telefon: str
    email: Optional[EmailStr] = None
    nif: Optional[str] = None
    adreca: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    tipus: str = 'particular'
    municipi_id: Optional[UUID] = None
    preferencies: Optional[dict] = Field(default_factory=dict)
    notes: Optional[str] = None
    actiu: bool = True

    @field_validator('telefon')
    @classmethod
    def validate_telefon(cls, v: str) -> str:
        from app.core.sanitize import validate_phone
        return validate_phone(v)

    @field_validator('nif')
    @classmethod
    def validate_nif_field(cls, v: Optional[str]) -> Optional[str]:
        if not v: return v
        from app.core.sanitize import validate_nif
        return validate_nif(v)

    @field_validator('notes')
    @classmethod
    def sanitize_notes(cls, v: Optional[str]) -> Optional[str]:
        from app.core.sanitize import sanitize_html
        return sanitize_html(v)

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    nom: Optional[str] = None
    telefon: Optional[str] = None
    tipus: Optional[str] = None
    actiu: Optional[bool] = None

class ClientResponse(ClientBase):
    id: UUID
    empresa_id: UUID
    percentatge_incidencia_historic: Optional[float] = 0
    created_at: datetime

    class Config:
        from_attributes = True
