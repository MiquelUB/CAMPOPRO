# Skill: OCR via OpenRouter (Kimi K2 Vision)

## Descripció
Aquesta skill mostra com configurar un pipeline OCR de fotografies utilitzant l'API d'OpenRouter. Particularment, s'ha pensat per extraure dades estructurades a partir de tiquets/rebuts i comptadors de vehicles agraris, utilitzant Retry (Tenacity) i Pydantic per validar el resultat.

## Template

```python
import base64
import json
import httpx
from pydantic import BaseModel, ValidationError
from typing import List, Optional
from tenacity import retry, stop_after_attempt, wait_exponential
import logging

logger = logging.getLogger(__name__)

# Models de dades de sortida per al Tiquet
class LiniaTiquet(BaseModel):
    nom: str
    quantitat: float
    unitat: Optional[str]
    preu_unitari: float
    total: float

class ResultatTiquet(BaseModel):
    total_rebut: float
    linies: List[LiniaTiquet]

class OpenRouterOCRClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://campopro.com", 
            "X-Title": "CampoPro"
        }

    def _encode_image(self, image_path: str) -> str:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def extract_receipt_data(self, image_path: str) -> Optional[ResultatTiquet]:
        \"\"\"Extreu la informació d'un tiquet o rebut via Kimi K2.\"\"\"
        base64_image = self._encode_image(image_path)
        
        system_prompt = \"\"\"
        Ets un sistema expert en OCR. Extreu les dades del tiquet de l'imatge adjunta i retorna ÚNICAMENT
        un objecte JSON vàlid sense markdown. El format exacte ha de ser aquest:
        {
          "total_rebut": 0.0,
          "linies": [
            {"nom": "Nom article", "quantitat": 1.0, "unitat": "kg", "preu_unitari": 0.0, "total": 0.0}
          ]
        }
        \"\"\"

        payload = {
            "model": "qwen/qwen-vl-plus:free", # Substituir pel model corresponent si utilitzes Kimi o un altre per Vision a OpenRouter
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ]
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            
            data = response.json()
            # Tracking del cost es pot fer a data['usage']
            content = data['choices'][0]['message']['content']
            
            try:
                # Netejar possibles caràcters per si el model hi posa markdown (```json ...)
                content = content.replace("```json", "").replace("```", "").strip()
                parsed_json = json.loads(content)
                return ResultatTiquet.model_validate(parsed_json)
            except (json.JSONDecodeError, ValidationError) as e:
                logger.error(f"Error de validació de sortida: {e}")
                # Fallback manual o retry
                raise e
```

## Exemple d'ús
En un Worker de Celery o un endpoint, instància aquest client per fer OCR:

```python
async def proces_factura(ruta_imatge: str):
    client_ocr = OpenRouterOCRClient(api_key="sk-or-v1-XXXXX")
    try:
        dades = await client_ocr.extract_receipt_data(ruta_imatge)
        print(f"Total trobat: {dades.total_rebut}")
        return dades
    except Exception as e:
        print(f"L'OCR ha fallat completament després de re-intents: {e}")
        # Notificar a l'usuari que introdueixi manualment els valors
        return None
```

## Validació
- Genera i passa-li un ticket de supermercat senzill o factura en JPG.
- Revisa que retorna una instància de `ResultatTiquet` on les línies fan match amb l'imatge.

## Errors comuns
- Passar una URL directament a "image_url" que l'API de visió no pugui llegir; sempre és més segur utilitzar el `base64` per fitxers de S3 temporals o locals.
- No fer el "replace" dels blockquotes (```json) que fan servir habitualment els models d'OpenRouter (Deepseek/Kimi).
- Excedir els tokens de context de l'imatge si la resolució és massa gran, fent que falli abans de començar. És recomanable baixar una mica la resolució de la imatge.
