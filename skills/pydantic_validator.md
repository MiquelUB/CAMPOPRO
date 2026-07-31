# Skill: Pydantic Validators

## Descripció
Plantilles per validació complexa de dades a Pydantic v2 (FastAPI 0.100+), incloent creació de camps personalitzats, validació entre camps (`@model_validator`), enums, camps JSONB, i control de precisió decimal, entre d'altres validacions típiques per a formularis del sector agrícola/Campopro.

## Template

```python
from pydantic import BaseModel, Field, model_validator, field_validator, AwareDatetime
from typing import Optional, List, Dict, Any
from decimal import Decimal
from enum import Enum
import re
from datetime import date, datetime

class EstatFeina(str, Enum):
    PENDENT = "pendent"
    EN_PROGRES = "en_progres"
    FINALITZAT = "finalitzat"
    CANCELAT = "cancelat"

class TipusTasca(str, Enum):
    SEMBRA = "sembra"
    COLLITA = "collita"
    FUMIGACIO = "fumigacio"

class Coordenades(BaseModel):
    latitud: float = Field(..., ge=-90, le=90)
    longitud: float = Field(..., ge=-180, le=180)

class FeinaValidatorBase(BaseModel):
    # Enum validator (Pydantic ho valida directament però ho declarem com el tipus de camp)
    estat: EstatFeina = EstatFeina.PENDENT
    tipus: TipusTasca
    
    # Custom regex i validació bàsica per strings
    nif_client: str
    telefon: str = Field(..., pattern=r'^\+?[0-9]{9,15}$')
    
    # Decimals amb precisió i valors mínims
    hectarees: Decimal = Field(..., gt=0, decimal_places=2)
    preu_hora: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    
    # JSONB (Es mapeja a un dict en Python)
    dades_extra: Optional[Dict[str, Any]] = None
    
    # Dates
    data_inici: date
    data_fi: Optional[date] = None

    # Validació simple de camp individual
    @field_validator('nif_client')
    @classmethod
    def validar_nif_cif_nie(cls, v: str) -> str:
        v = v.upper().replace(" ", "").replace("-", "")
        # Expressió regular bàsica per a NIF, NIE, CIF espanyol (ajustar per a real)
        if not re.match(r'^[XYZ0-9][0-9]{7}[A-Z0-9]$', v):
            raise ValueError('El NIF no té un format vàlid per a Espanya')
        return v
        
    @field_validator('data_inici')
    @classmethod
    def validar_no_en_passat(cls, v: date) -> date:
        if v < date.today():
            raise ValueError("La data d'inici no pot ser en el passat")
        return v

    # Validació creuada entre camps (Cross-field validation)
    @model_validator(mode='after')
    def validar_coherencia_dades(self) -> 'FeinaValidatorBase':
        # Validar data d'inici i data de fi
        if self.data_fi and self.data_fi < self.data_inici:
            raise ValueError('La data de fi no pot ser anterior a la data d\'inici')
        
        # Validacions dependents de l'estat
        if self.estat == EstatFeina.FINALITZAT and not self.data_fi:
            raise ValueError("Si la feina està finalitzada cal establir una data de fi")
            
        return self

```

## Exemple d'ús
S'utilitza igual que qualsevol model de Pydantic com a entrada de l'API.

```python
try:
    feina = FeinaValidatorBase(
        tipus=TipusTasca.COLLITA,
        nif_client="B12345678",
        telefon="612345678",
        hectarees=12.45,
        data_inici=date.today(),
        estat=EstatFeina.FINALITZAT # Donaria error per manca de data de fi
    )
except Exception as e:
    print(e)
```

## Validació
- Introdueix `hectarees` amb 3 decimals; s'ha de truncar o rebutjar, segons la configuració (A Pydantic v2 sol rebutjar si posar decimals no encaixa, però depèn de l'strict mode).
- Passa un `estat="incorrecte"`; rebràs error de validació d'Enum.
- Prova un CIF/NIF incorrecte i visualitza l'error "El NIF no té un format vàlid".

## Errors comuns
- No establir `@classmethod` als `@field_validator` (OBLIGATORI a Pydantic V2 per als field validators de classe).
- A Pydantic V2 utilitzar `mode='before'` de model_validator quan es vol accedir als objectes parsejats (tipus datetime, etc.); s'ha d'usar `mode='after'`.
- Deixar valors d'Enum lliures per permetre compatibilitat backwards; és millor controlar això en l'API que en el Validator.
