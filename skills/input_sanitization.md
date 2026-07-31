# Skill: Validació i Sanejament de Dades d'Entrada

## Descripció
Aquest skill detalla com protegir el backend de FastAPI i la base de dades contra dades malicioses. Utilitza `pydantic` per validar formats (NIF, telèfon, email, coordenades GPS), paràmetres de `asyncpg` per evitar SQL Injection (SQLi), i `bleach` per evitar atacs Cross-Site Scripting (XSS) netejant l'entrada de text lliure abans d'emmagatzemar-la. També aborda la protecció Path Traversal de fitxers.

## Template

```python
# [PLACEHOLDER_DIR]/schemas/validators.py
import re
import bleach
from pydantic import BaseModel, EmailStr, field_validator, ValidationInfo
from typing import Optional

# Regex constants
NIF_REGEX = re.compile(r'^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$', re.IGNORECASE)
PHONE_REGEX = re.compile(r'^\+?[0-9]{9,15}$')

class UserInputSchema(BaseModel):
    email: EmailStr
    phone: str
    nif: str
    notes_html: Optional[str] = None
    latitude: float
    longitude: float
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not PHONE_REGEX.match(v):
            raise ValueError('Format de telèfon invàlid')
        return v
        
    @field_validator('nif')
    @classmethod
    def validate_nif(cls, v: str) -> str:
        v = v.upper()
        if not NIF_REGEX.match(v):
            raise ValueError('Format de NIF invàlid')
        return v
        
    @field_validator('latitude', 'longitude')
    @classmethod
    def validate_coordinates(cls, v: float, info: ValidationInfo) -> float:
        if info.field_name == 'latitude' and not (-90 <= v <= 90):
            raise ValueError('Latitud ha de ser entre -90 i 90')
        if info.field_name == 'longitude' and not (-180 <= v <= 180):
            raise ValueError('Longitud ha de ser entre -180 i 180')
        return v

    @field_validator('notes_html')
    @classmethod
    def sanitize_html(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        # Sanejament XSS: només permetem algunes etiquetes segures
        allowed_tags = ['b', 'i', 'u', 'a', 'p', 'br', 'ul', 'li']
        allowed_attributes = {'a': ['href', 'title']}
        clean_text = bleach.clean(v, tags=allowed_tags, attributes=allowed_attributes, strip=True)
        return clean_text

# [PLACEHOLDER_DIR]/db/queries.py
# Exemple de prevenció SQLi i Path Traversal
import os

async def get_user_by_email(conn, email: str):
    # CORRECTE: Parameterized query (asyncpg) evitant SQLi
    query = "SELECT id, email, rol FROM usuaris WHERE email = $1"
    row = await conn.fetchrow(query, email)
    return row

def secure_filename(filename: str) -> str:
    # Sanejament de Path Traversal
    filename = os.path.basename(filename)
    # Netejar caràcters no alfanumèrics o punts segurs
    return re.sub(r'[^a-zA-Z0-9_\.-]', '_', filename)
```

## Exemple d'ús

```python
from fastapi import APIRouter
from [PLACEHOLDER_DIR].schemas.validators import UserInputSchema, secure_filename

router = APIRouter()

@router.post("/usuaris/")
async def create_user(user: UserInputSchema):
    # 'user' ja està validat i 'notes_html' no conté scripts malignes (XSS filtrat)
    
    # Insert a BD usant asyncpg $1, $2, $3...
    # await conn.execute("INSERT INTO usuaris (email, notes) VALUES ($1, $2)", user.email, user.notes_html)
    return {"status": "ok", "sanitized_notes": user.notes_html}

@router.post("/pujar-fitxer/")
async def upload_document(nom_fitxer: str):
    # Protecció contra "../../etc/passwd"
    nom_segur = secure_filename(nom_fitxer)
    return {"nom_real": nom_segur}
```

## Validació
- Intentar enviar `<script>alert(1)</script>` al camp `notes_html` i comprovar que el backend retorna el text escapat i net.
- Intentar usar NIFs falsos o emails sense la forma correcta, comprovant que retorna 422 Unprocessable Entity de Pydantic.
- Cridar `secure_filename("../../../etc/shadow")` i comprovar que retorna `shadow`.
- Utilitzar injeccions SQL tipus `' OR 1=1 --` en una cerca, verificant que asyncpg l'escapa.

## Errors comuns
- **Utilitzar f-strings a les queries de base de dades**: `f"SELECT * FROM users WHERE email = '{email}'"` -> Això obre la porta a SQL Injection fatal. Sempre utilitza paràmetres posicionals ($1, $2).
- **No utilitzar `os.path.basename` o l'equivalent segur**: Acceptar rutes relatives en arxius d'usuari pot exposar el sistema d'arxius del servidor.
- **Massa permissivitat de tags a bleach**: Permetre `script`, `iframe` o `style` desfà la seguretat XSS.
