from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class ProveidorBase(BaseModel):
    nif: Optional[str] = None
    nom: str
    categoria: Optional[str] = None
    contacte: Optional[str] = None
    telefon: Optional[str] = None
    email: Optional[str] = None
    adreca: Optional[str] = None
    productes: Optional[str] = None
    descompte: Optional[str] = None
    forma_pagament: Optional[str] = None
    condicions_pagament: Optional[str] = None
    iban: Optional[str] = None

class ProveidorCreate(ProveidorBase):
    pass

class ProveidorUpdate(ProveidorBase):
    nom: Optional[str] = None

class ProveidorResponse(ProveidorBase):
    id: UUID
    empresa_id: Optional[UUID] = None
    creat_a: datetime
    actualitzat_a: datetime

    class Config:
        from_attributes = True
