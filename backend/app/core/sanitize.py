import re
import bleach
import os
from typing import Optional

# Regex constants
NIF_REGEX = re.compile(r'^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$', re.IGNORECASE)
PHONE_REGEX = re.compile(r'^\+?[0-9]{9,15}$')

def validate_phone(v: str) -> str:
    if not PHONE_REGEX.match(v):
        raise ValueError('Format de telèfon invàlid')
    return v

def validate_nif(v: str) -> str:
    v = v.upper()
    if not NIF_REGEX.match(v):
        raise ValueError('Format de NIF invàlid')
    return v

def sanitize_html(v: Optional[str]) -> Optional[str]:
    if v is None:
        return None
    allowed_tags = ['b', 'i', 'u', 'a', 'p', 'br', 'ul', 'li']
    allowed_attributes = {'a': ['href', 'title']}
    clean_text = bleach.clean(v, tags=allowed_tags, attributes=allowed_attributes, strip=True)
    return clean_text

def secure_filename(filename: str) -> str:
    filename = os.path.basename(filename)
    return re.sub(r'[^a-zA-Z0-9_\.-]', '_', filename)
