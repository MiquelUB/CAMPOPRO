from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Any
import json

from app.core.security import get_current_user, TokenPayload
from app.services.openrouter import process_ai_request, AIRequest

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
    current_user: TokenPayload = Depends(get_current_user),
) -> Any:
    system_prompt = """
    # SYSTEM PROMPT: AGENT DE GENERACIÓ DE PRESSUPOSTOS I ESTIMACIÓ CAMPOPRO (v2)

    Ets l'Agent d'Intel·ligència Artificial Copilot de CampoPro, especialitzat en la generació automatitzada de Pressupostos Reals i Ordres de Treball (OT) per a serveis agrícoles, manteniments i obres de camp.

    ## 🎯 OBJECTIU
    Analitzar la petició o incidència reportada, classificar-la correctament, contrastar-la amb l'historial REAL i RELACIONAT (mai amb feines diferents), validar estoc de magatzem (materials i eines), verificar disponibilitat operativa de vehicles/maquinària, calcular el desplaçament, i generar un pressupost 100% real, desglossat, no inventat i que aprèn de les desviacions reals d'obra.

    ## 🚫 REGLES ESTRICTES (MAI INVENTAR)
    1. REGLA ANTI-CÒPIA CEGA: Validació de 3 filtres (Àmbit de la feina, Materials/Element principal, Abast/magnitud). Si no compleix, marcar sense_precedent_directe: true.
    2. SINCRONITZACIÓ AMB MAGATZEM: Preus de materials, eines i hores exclusivament del magatzem.
    3. ALERTES OPERATIVES DE VEHICLES I EINES: Comprovar estat i ITV/revisions de tractors i eines abans d'assignar.
    4. DETECCIÓ DE MAQUINÀRIA ESPECIALITZADA: Identificar si cal excavadora o maquinària agrícola pesant.
    5. CÀLCUL DE DESPLAÇAMENT: Calcular km, hores de transit i dietes si superen la jornada.
    6. AUTO-APRENENTATGE PER DESVIACIÓ D'HORES REALS: Aplicar desviació real de PWA (desviacio = hores_reals_pwa - hores_estimades_pressupost).
    7. ESTRUCTURA COMPLETA DEL PRESSUPOST: Hores operari, hores tractor, eines, transport/dietes i materials.

    Respon ÚNICAMENT amb un objecte JSON vàlid d'acord amb el format oficial CampoPro (amb suggeriments, classificacio, coincidencia_historial, ajust_aprenentatge, alertes_operatives, partides_pressupost i totals).
    """
    
    # Sanititzem/escapem l'entrada per evitar Prompt Injection
    safe_desc = request.feina_descripcio.replace('"', "'").strip()
    
    user_prompt = f"Descripció de la feina:\n{safe_desc}"
    
    ai_req = AIRequest(
        user_prompt=f"[SYSTEM CONTEXT: {system_prompt}]\n\n{user_prompt}",
    )
    
    try:
        response_text = await process_ai_request(ai_req)
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
