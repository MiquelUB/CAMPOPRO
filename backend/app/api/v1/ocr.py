from fastapi import APIRouter, UploadFile, File, HTTPException
import httpx
import base64
import json
import os
from pydantic import BaseModel, StrictInt, field_validator
from app.core.upload import validate_uploaded_image

router = APIRouter()

class OCRResponse(BaseModel):
    nom: str
    quantitat: int
    preu_unitari: float

    class Config:
        extra = "forbid"

class OcrComptadorResponse(BaseModel):
    quilometres: StrictInt

    @field_validator('quilometres', mode='before')
    def parse_quilometres(cls, v):
        if not isinstance(v, int):
            try:
                # Intenta forçar conversió, però només si és absolutament numèric sense lletres
                val = int(v)
                if str(val) != str(v).strip():
                    raise ValueError("Ha de ser estrictament un número sencer sense text addicional")
                return val
            except (ValueError, TypeError):
                raise ValueError("El valor retornat no és un número sencer vàlid.")
        return v

    class Config:
        extra = "forbid"

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@router.post("/extract-albara", response_model=OCRResponse)
async def extract_albara(file: UploadFile = File(...)):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")

    contents = await file.read()
    base64_image = base64.b64encode(contents).decode("utf-8")
    
    mime_type = file.content_type
    
    prompt = """Analitza aquesta imatge (un albarà o factura) i extreu-ne el nom del producte, la quantitat i el preu unitari. 
    Retorna ÚNICAMENT un objecte JSON vàlid amb les claus exactes: "nom" (string), "quantitat" (integer), "preu_unitari" (float). 
    No afegeixis text addicional ni markdown."""
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "anthropic/claude-3-haiku:beta", # Or any suitable vision model
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            result = response.json()
            
            content = result["choices"][0]["message"]["content"]
            
            # Clean possible markdown JSON wrapping
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
                
            parsed_json = json.loads(content.strip())
            
            # Validate with Pydantic
            validated_data = OCRResponse(**parsed_json)
            return validated_data
            
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Error de parseig del JSON de la IA")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@router.post("/comptador", response_model=OcrComptadorResponse)
async def extract_comptador(file: UploadFile = File(...)):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")

    # 1. MAGIC BYTES SHIELD
    content_bytes = await validate_uploaded_image(file)
    base64_image = base64.b64encode(content_bytes).decode("utf-8")
    mime_type = file.content_type

    prompt = """Analitza aquesta imatge del comptador d'un cotxe (odòmetre) i extreu-ne els quilòmetres. 
    Retorna ÚNICAMENT un objecte JSON vàlid amb la clau: "quilometres" (integer). 
    No afegeixis text addicional, ni unitats, ni markdown, només el número sencer. Exemple: {"quilometres": 150000}"""
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "anthropic/claude-3-haiku:beta",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            result = response.json()
            
            content = result["choices"][0]["message"]["content"]
            
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
                
            parsed_json = json.loads(content.strip())
            
            # Pydantic STRICT INT validation
            validated_data = OcrComptadorResponse(**parsed_json)
            return validated_data
            
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Error de parseig del JSON de la IA")
        except ValueError as ve:
            raise HTTPException(status_code=422, detail=str(ve))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
