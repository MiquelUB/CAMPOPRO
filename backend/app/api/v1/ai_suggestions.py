from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Any
import json

from app.api.deps import get_current_user
from app.models.user import User
from app.services.openrouter import process_prompt_with_openrouter, OpenRouterRequest

router = APIRouter()

class SuggestionRequest(BaseModel):
    feina_descripcio: str = Field(..., description="Text descriptive of the job")

class SuggestionItem(BaseModel):
    nom: str
    quantitat_suggerida: float
    unitat: str
    es_eina: bool

class SuggestionResponse(BaseModel):
    suggeriments: List[SuggestionItem]

@router.post("/", response_model=SuggestionResponse)
async def get_ai_suggestions(
    request: SuggestionRequest,
    current_user: User = Depends(get_current_user),
) -> Any:
    system_prompt = """
    Ets un assistent per a una empresa d'instal·lacions i manteniment (jardineria, muntatge, manteniment).
    L'usuari et proporcionarà una descripció d'una feina que s'ha de realitzar.
    La teva tasca és extreure i suggerir els materials i les eines necessàries per fer aquesta feina.
    Respon ÚNICAMENT amb un objecte JSON vàlid amb una clau 'suggeriments' que contingui un array d'objectes.
    Format d'exemple:
    {
        "suggeriments": [
            {"nom": "Tub de PVC 25mm", "quantitat_suggerida": 10.0, "unitat": "metres", "es_eina": false},
            {"nom": "Trepant", "quantitat_suggerida": 1.0, "unitat": "unitats", "es_eina": true}
        ]
    }
    No incloguis text abans ni després del JSON. No facis servir blocs de codi markdown (```json).
    """
    
    # Sanititzem/escapem l'entrada per evitar Prompt Injection (simplement com a mesura bàsica)
    safe_desc = request.feina_descripcio.replace('"', "'").strip()
    
    user_prompt = f"Descripció de la feina:\n{safe_desc}"
    
    or_req = OpenRouterRequest(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        max_tokens=1000
    )
    
    try:
        response_text = await process_prompt_with_openrouter(or_req)
        # Netegem per si l'IA ha afegit markdown block
        response_text = response_text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
            
        data = json.loads(response_text)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar suggeriments IA: {str(e)}")
