from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    nom: str
    rol: str
    email: Optional[str] = None
    telefon: Optional[str] = None
    vehicle_assignat: Optional[str] = None
    especialitat: Optional[str] = None
    cap_de_grup_id: Optional[UUID] = None
    nif: Optional[str] = None
    permis_conduir: Optional[str] = None
    domicili: Optional[str] = None
    actiu: bool = True

class UserCreate(UserBase):
    password: Optional[str] = None
    pin: Optional[str] = None

class UserUpdate(UserBase):
    nom: Optional[str] = None
    rol: Optional[str] = None
    password: Optional[str] = None
    pin: Optional[str] = None
    email: Optional[str] = None
    telefon: Optional[str] = None
    vehicle_assignat: Optional[str] = None
    especialitat: Optional[str] = None
    cap_de_grup_id: Optional[UUID] = None
    nif: Optional[str] = None
    permis_conduir: Optional[str] = None
    domicili: Optional[str] = None
    actiu: Optional[bool] = None

class UserResponse(UserBase):
    id: UUID
    empresa_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
