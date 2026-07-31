from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime

class CategoriaProducteBase(BaseModel):
    nom: str
    descripcio: Optional[str] = None

class CategoriaProducteCreate(CategoriaProducteBase):
    pass

class CategoriaProducte(CategoriaProducteBase):
    id: UUID4
    empresa_id: UUID4
    creat_a: datetime
    actualitzat_a: datetime

    class Config:
        from_attributes = True

class ProducteBase(BaseModel):
    categoria_id: Optional[UUID4] = None
    nom: str
    codi_barres: Optional[str] = None
    descripcio: Optional[str] = None
    preu_unitari: float = 0.0
    unitat_mesura: str
    estoc_minim: float = 0.0
    estoc_actual: float = 0.0

class ProducteCreate(ProducteBase):
    pass

class Producte(ProducteBase):
    id: UUID4
    empresa_id: UUID4
    creat_a: datetime
    actualitzat_a: datetime

    class Config:
        from_attributes = True

class MovimentMagatzemBase(BaseModel):
    producte_id: UUID4
    tipus: str # 'ENTRADA', 'SORTIDA', 'AJUST'
    quantitat: float
    motiu: Optional[str] = None

class MovimentMagatzemCreate(MovimentMagatzemBase):
    pass

class MovimentMagatzem(MovimentMagatzemBase):
    id: UUID4
    empresa_id: UUID4
    usuari_id: UUID4
    data_moviment: datetime

    class Config:
        from_attributes = True
