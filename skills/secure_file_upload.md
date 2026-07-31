# Skill: Pujada Segura de Fitxers a AWS S3

## Descripció
Skill per la gestió segura de fitxers al projecte. Utilitza AWS S3 amb URLs presignades perquè el client pugi directament l'arxiu al bucket S3 (reduint la càrrega del backend). Al backend generem aquestes URLs validant els límits de mida i els tipus MIME permesos. També implementa la verificació bàsica Magic Bytes per evitar malware amagat amb falses extensions, el sanejament de noms de fitxer (UUID) i la limitació temporal d'enllaços de descàrrega per evitar accessos no autoritzats.

## Template

```python
# [PLACEHOLDER_DIR]/services/s3_service.py
import boto3
import uuid
from botocore.exceptions import ClientError
from typing import Dict, Any, Tuple
from [PLACEHOLDER_CORE].config import settings
import magic  # python-magic per llegir magic bytes
from PIL import Image
import io

s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)

# Límits globals
ALLOWED_MIMETYPES = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
    'application/pdf': 'pdf', 'image/svg+xml': 'svg'
}
MAX_SIZE_PHOTOS = 10 * 1024 * 1024  # 10 MB
MAX_SIZE_PLANS = 50 * 1024 * 1024   # 50 MB

def generate_presigned_upload_url(mimetype: str, file_type: str = 'photo') -> Dict[str, Any]:
    if mimetype not in ALLOWED_MIMETYPES:
        raise ValueError("Tipus de fitxer no permès")
        
    max_size = MAX_SIZE_PHOTOS if file_type == 'photo' else MAX_SIZE_PLANS
    ext = ALLOWED_MIMETYPES[mimetype]
    
    # Sanejament: usar UUID en lloc del nom del client
    file_key = f"uploads/{file_type}/{uuid.uuid4()}.{ext}"

    try:
        # Generem URL que només permet aquest contentType i contentLength
        response = s3_client.generate_presigned_post(
            Bucket=settings.AWS_BUCKET_NAME,
            Key=file_key,
            Fields={'Content-Type': mimetype},
            Conditions=[
                {'Content-Type': mimetype},
                ['content-length-range', 1, max_size]
            ],
            ExpiresIn=300 # 5 minuts
        )
        # Retornem això al frontend per a que pugi el fitxer
        return {"upload_url": response, "file_key": file_key}
    except ClientError as e:
        raise Exception(f"Error S3: {str(e)}")

def generate_presigned_download_url(file_key: str, expires_in: int = 3600) -> str:
    """ Genera URL d'accés de només lectura """
    return s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': settings.AWS_BUCKET_NAME, 'Key': file_key},
        ExpiresIn=expires_in
    )

def verify_file_content(file_bytes: bytes) -> bool:
    """ Validació de Magic Bytes i stripping de metadades EXIF per a privacitat. """
    mime = magic.from_buffer(file_bytes, mime=True)
    if mime not in ALLOWED_MIMETYPES:
        return False
        
    if mime.startswith('image/'):
        try:
            # Això elimina l'EXIF implicitament excepte si l'exportem expressament
            img = Image.open(io.BytesIO(file_bytes))
            img.verify() 
            return True
        except Exception:
            return False
            
    return True
```

## Exemple d'ús

```python
from fastapi import APIRouter, HTTPException
from [PLACEHOLDER_DIR].services.s3_service import generate_presigned_upload_url

router = APIRouter()

@router.get("/solicitar-pujada")
async def request_upload(mimetype: str, doc_type: str = 'photo'):
    try:
        data = generate_presigned_upload_url(mimetype, doc_type)
        return data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

## Validació
- Realitzar una petició per obtenir la URL pre-signada i intentar pujar un fitxer de 15MB utilitzant Postman; S3 hauria de refusar la petició amb `EntityTooLarge`.
- Intentar enganyar S3 modificant el `Content-Type` del formulari de pujada per un altre no autoritzat; fallarà per condicions estrictes.
- Descarregar una imatge processada anteriorment i comprovar-ne les propietats (ex. amb eina ExifTool) per confirmar l'absència de coordenades GPS i metadades personals.

## Errors comuns
- **Confiar només en l'extensió del fitxer**: És trivial canviar el nom d'un arxiu de `virus.exe` a `imatge.jpg`. Cal validar els *Magic Bytes*.
- **No definir `content-length-range` a la policy**: Sense això, un atacant pot usar la teva URL presignada per pujar un fitxer de 5TB i buidar la targeta de crèdit en costos S3.
- **Deixar el nom de fitxer original**: Pot produir sobreescriptures, atacs de codificació i path traversals al bucket. Sempre usar UUID o hash per al nom intern de S3.
