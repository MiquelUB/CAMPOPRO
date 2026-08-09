from fastapi import APIRouter, Depends, HTTPException
import httpx
import logging
import json
import os
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import asyncpg

from app.dependencies import get_db
from app.core.security import get_current_user, TokenPayload
from app.services.ai_tools import (
    cercar_feines_similars_tool,
    consultar_magatzem_tool,
    consultar_eines_disponibles_tool,
    consultar_vehicles_disponibles_tool,
    consultar_operaris_disponibles_tool,
    consultar_planols_ubicacio_tool
)

logger = logging.getLogger(__name__)

router = APIRouter()

class AIRequest(BaseModel):
    descripcio: str
    client_id: Optional[str] = None

SYSTEM_PROMPT = """Ets l'assistent de redacció de feines de CampoPro. Tens dues funcions clares: 
Primer, ajudar l'enginyer avaluant la descripció de la feina amb les eines per validar recursos reals. 
Segon, crear el pressupost exclusivament amb dades obtingudes de les eines.

REGLES OBLIGATÒRIES:
1. Mai inventis materials, preus, hores, vehicles, eines ni operaris. Tota dada ha de venir d'una crida a una eina.
2. Si no trobes una feina similar exacta amb l'eina "cercar_feines_similars", has de dir EXPLÍCITAMENT "No tinc registre d'aquesta feina" i no inventar ni estimar hores o materials.
3. Al consultar el magatzem o eines, si un recurs està esgotat o ocupat, utilitza els recursos substitutius que l'eina et proposi. Informa-ho als "avisos".
4. Diferencia els vehicles de transport dels vehicles de maquinària/treball. Assegura't mitjançant l'eina que hi ha disponibilitat.
5. Comprova sempre l'existència de plànols vinculats cridant a consultar_planols_ubicacio si tens el client_id.
6. Respon EXCLUSIVAMENT amb un objecte JSON estructurat un cop obtinguda i validada tota la informació de les eines, o bé continua cridant eines.
7. No hi pot haver cap text fora del JSON a la teva resposta final.

ESTRUCTURA DEL JSON FINAL REQUERIT:
{
  "proposta": {
    "confianca": "alta | baixa",
    "avisos": ["llista d'avisos com falta d'estoc o feina no trobada"]
  },
  "pressupost": {
    "materials": [{"material_id": "uuid", "nom": "string", "quantitat": 1, "preu_unitat": 0.0}],
    "eines": [{"eina_id": "uuid", "nom": "string"}],
    "hores_estimades": 0,
    "vehicle_id": "uuid o null",
    "maquinaria_id": "uuid o null",
    "operari_recomanat_id": "uuid o null",
    "planol_id": "uuid o null"
  }
}
"""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "cercar_feines_similars",
            "description": "Cerca a l'històric de feines de l'empresa les més semblants EXACTES a una descripció.",
            "parameters": {
                "type": "object",
                "properties": {
                    "descripcio": {"type": "string"}
                },
                "required": ["descripcio"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "consultar_magatzem",
            "description": "Consulta disponibilitat i preu actual de materials. Retorna també substitutius si no hi ha estoc.",
            "parameters": {
                "type": "object",
                "properties": {
                    "materials_noms": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["materials_noms"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "consultar_eines_disponibles",
            "description": "Comprova si unes eines estan lliures. Retorna substitutives si cal.",
            "parameters": {
                "type": "object",
                "properties": {
                    "eines_noms": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["eines_noms"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "consultar_vehicles_disponibles",
            "description": "Retorna vehicles lliures de cert tipus (transport, maquinaria, etc).",
            "parameters": {
                "type": "object",
                "properties": {
                    "tipus": {"type": "string"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "consultar_operaris_disponibles",
            "description": "Busca operaris lliures, indicant preferència d'habilitat.",
            "parameters": {
                "type": "object",
                "properties": {
                    "habilitat": {"type": "string"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "consultar_planols_ubicacio",
            "description": "Cerca si hi ha plànols tècnics disponibles associats a un client.",
            "parameters": {
                "type": "object",
                "properties": {
                    "client_id": {"type": "string"}
                },
                "required": ["client_id"]
            }
        }
    }
]

@router.post("/generar")
async def generar_pressupost_ai(
    req: AIRequest,
    db: asyncpg.Connection = Depends(get_db),
    current_user: TokenPayload = Depends(get_current_user),
):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Descripció feina: {req.descripcio}\nClient ID (opcional): {req.client_id}"}
    ]

    empresa_id = current_user.empresa_id

    async with httpx.AsyncClient() as client:
        # We will loop to handle multiple tool calls (up to 5 iterations to avoid infinite loops)
        for _ in range(5):
            payload = {
                "model": "openai/gpt-4o-mini",
                "messages": messages,
                "tools": TOOLS,
                "tool_choice": "auto",
                "temperature": 0.1
            }

            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }

            resp = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=60.0)
            if resp.status_code != 200:
                logger.error(f"OpenRouter Error: {resp.text}")
                raise HTTPException(status_code=502, detail="Error de la API IA.")
                
            resp_data = resp.json()
            message = resp_data["choices"][0]["message"]

            if message.get("tool_calls"):
                messages.append(message)
                for tool_call in message["tool_calls"]:
                    func_name = tool_call["function"]["name"]
                    args = json.loads(tool_call["function"]["arguments"])
                    
                    tool_result = None
                    try:
                        if func_name == "cercar_feines_similars":
                            tool_result = await cercar_feines_similars_tool(args.get("descripcio", ""), empresa_id, db)
                        elif func_name == "consultar_magatzem":
                            tool_result = await consultar_magatzem_tool(args.get("materials_noms", []), empresa_id, db)
                        elif func_name == "consultar_eines_disponibles":
                            tool_result = await consultar_eines_disponibles_tool(args.get("eines_noms", []), empresa_id, db)
                        elif func_name == "consultar_vehicles_disponibles":
                            tool_result = await consultar_vehicles_disponibles_tool(args.get("tipus"), empresa_id, db)
                        elif func_name == "consultar_operaris_disponibles":
                            tool_result = await consultar_operaris_disponibles_tool(args.get("habilitat"), empresa_id, db)
                        elif func_name == "consultar_planols_ubicacio":
                            tool_result = await consultar_planols_ubicacio_tool(args.get("client_id", ""), empresa_id, db)
                        else:
                            tool_result = {"error": "Tool unknown"}
                    except Exception as e:
                        logger.error(f"Tool error {func_name}: {e}")
                        tool_result = {"error": str(e)}

                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call["id"],
                        "name": func_name,
                        "content": json.dumps(tool_result)
                    })
            else:
                # LLM finished, return its JSON
                content = message.get("content", "")
                try:
                    return json.loads(content)
                except:
                    return {"error": "JSON parse error", "content": content}

        raise HTTPException(status_code=504, detail="Too many tool iterations.")
