import io
import filetype
from fastapi import UploadFile, HTTPException
import logging

logger = logging.getLogger(__name__)

# Constants for allowed file types
ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp"
}

ALLOWED_MIME_TYPES_BLUEPRINT = {
    "application/pdf"
}

ALLOWED_MIME_TYPES_AUDIO = {
    "audio/webm",
    "video/webm",
    "audio/wav",
    "audio/x-wav",
    "video/mp4",
    "audio/mp4"
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
MAX_BLUEPRINT_SIZE = 50 * 1024 * 1024  # 50 MB
MAX_AUDIO_SIZE = 10 * 1024 * 1024 # 10 MB

async def validate_uploaded_image(file: UploadFile) -> bytes:
    """
    Validates an uploaded file strictly checking its magic bytes to prevent RCE/Malware.
    Returns the file content bytes if valid.
    """
    # 1. Read file content
    try:
        content = await file.read()
    except Exception as e:
        logger.error(f"Error llegint el fitxer pujat: {e}")
        raise HTTPException(status_code=400, detail="No s'ha pogut llegir el fitxer.")

    # 2. Check file size
    if len(content) > MAX_FILE_SIZE:
        logger.warning(f"Intent de pujada de fitxer massa gran: {len(content)} bytes")
        raise HTTPException(status_code=413, detail="El fitxer és massa gran (màxim 5MB).")

    # 3. Validate Magic Bytes (MIME type)
    kind = filetype.guess(content)
    if kind is None:
        logger.warning("Fitxer rebut sense magic bytes recognoscibles.")
        raise HTTPException(status_code=415, detail="Tipus de fitxer desconegut o invàlid.")

    if kind.mime not in ALLOWED_MIME_TYPES:
        logger.warning(f"Intent de pujada de tipus no permès: {kind.mime}")
        raise HTTPException(status_code=415, detail=f"Tipus de fitxer no permès: {kind.mime}. Només es permeten imatges.")

    # Reset file pointer if someone else needs to read it from the file object
    await file.seek(0)
    
    return content

async def validate_uploaded_blueprint(file: UploadFile) -> bytes:
    """
    Validates a blueprint upload (PDF) with a 50MB limit to prevent disk exhaustion.
    """
    try:
        content = await file.read()
    except Exception as e:
        logger.error(f"Error llegint el plànol pujat: {e}")
        raise HTTPException(status_code=400, detail="No s'ha pogut llegir el plànol.")

    if len(content) > MAX_BLUEPRINT_SIZE:
        logger.warning(f"Intent de pujada de plànol massa gran: {len(content)} bytes")
        raise HTTPException(status_code=413, detail="El plànol és massa gran (màxim 50MB).")

    kind = filetype.guess(content)
    if kind is None:
        # Some plain PDFs might not be perfectly guessed by filetype depending on the library version,
        # but filetype generally supports PDF magic bytes (%PDF-).
        pass
    
    if kind is None or kind.mime not in ALLOWED_MIME_TYPES_BLUEPRINT:
        # Fallback to basic pdf magic byte check if filetype fails
        if not content.startswith(b"%PDF-"):
            logger.warning(f"Intent de pujada de tipus de plànol no permès")
            raise HTTPException(status_code=415, detail="Tipus de fitxer no permès. Només es permeten PDFs.")

    await file.seek(0)
    return content

async def validate_uploaded_audio(file: UploadFile) -> bytes:
    """
    Validates an uploaded audio file strictly checking its magic bytes.
    Returns the file content bytes if valid.
    """
    try:
        content = await file.read()
    except Exception as e:
        logger.error(f"Error llegint l'àudio pujat: {e}")
        raise HTTPException(status_code=400, detail="No s'ha pogut llegir l'àudio.")

    if len(content) > MAX_AUDIO_SIZE:
        logger.warning(f"Intent de pujada d'àudio massa gran: {len(content)} bytes")
        raise HTTPException(status_code=413, detail="L'àudio és massa gran (màxim 10MB).")

    kind = filetype.guess(content)
    if kind is None:
        logger.warning("Àudio rebut sense magic bytes recognoscibles.")
        raise HTTPException(status_code=415, detail="Tipus d'arxiu desconegut o invàlid.")

    if kind.mime not in ALLOWED_MIME_TYPES_AUDIO:
        logger.warning(f"Intent de pujada de tipus d'àudio no permès: {kind.mime}")
        raise HTTPException(status_code=415, detail=f"Tipus de fitxer no permès: {kind.mime}. Només es permeten webm, wav o mp4.")

    await file.seek(0)
    
    return content

async def save_upload_temporarily(file_bytes: bytes, filename: str) -> str:
    """
    Guarda el fitxer temporalment abans de processar-lo.
    (Implementació dummy per a ser completada segons on s'hagi de guardar)
    """
    # En un cas real es guardaria a /tmp o a un bucket s3 pre-signat
    pass

async def validate_batch_uploads(files: list[UploadFile]) -> list[bytes]:
    """
    Processa i valida un batch de fitxers (Multi-part file batch upload) procedent d'una cua Offline.
    Analitza un per un els magic-bytes per assegurar que cap de les fotografies conté malware.
    """
    validated_files_content = []
    for file in files:
        try:
            content = await validate_uploaded_image(file)
            validated_files_content.append(content)
        except HTTPException as e:
            logger.warning(f"Fitxer en batch {file.filename} invàlid: {e.detail}")
            raise HTTPException(status_code=400, detail=f"Error en fitxer {file.filename}: {e.detail}")
    
    return validated_files_content
