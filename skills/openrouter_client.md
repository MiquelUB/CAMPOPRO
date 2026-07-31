# Skill: OpenRouter API Client

## Descripció
Aquest mòdul subministra un client asíncron per contactar diferents models a través de l'OpenRouter amb fallback automàtic (p.ex: de Kimi a DeepSeek a Claude Haiku). Inclou Retry per la xarxa, Timeout i gestió dels errors per fer seguiment del cost per `empresa_id`.

## Template

```python
import httpx
import logging
from typing import List, Dict, Any, Optional
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

class AIClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://campopro.com", 
            "X-Title": "CampoPro"
        }
        # MODELS ORDERED BY PRIORITY (Fallback strategy)
        self.models = [
            "qwen/qwen-vl-plus:free", # Prioritat (ex: Kimi Vision / Qwen free)
            "deepseek/deepseek-chat", # Fallback 1
            "anthropic/claude-3-haiku" # Fallback 2
        ]

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def _make_request_to_model(self, model: str, messages: List[Dict], empresa_id: str) -> Dict[str, Any]:
        payload = {
            "model": model,
            "messages": messages
        }
        
        async with httpx.AsyncClient() as client:
            # S'utilitza timeout ampli per IA
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=45.0
            )
            response.raise_for_status()
            
            data = response.json()
            # Aquí idealment podríem guardar els tokens gastats
            # log_usage(empresa_id, data['usage'])
            return data

    async def generate_completion(self, messages: List[Dict], empresa_id: str) -> Optional[str]:
        \"\"\"Prova generar una resposta iterant per tots els models com a fallback.\"\"\"
        errors = []
        for model in self.models:
            try:
                logger.info(f"Intentant amb el model {model}...")
                response = await self._make_request_to_model(model, messages, empresa_id)
                content = response['choices'][0]['message']['content']
                return content
            except Exception as e:
                logger.warning(f"Error utilitzant el model {model}: {e}")
                errors.append(str(e))
                continue
                
        # Si arribem aquí tots han fallat
        logger.error(f"Tots els models de OpenRouter han fallat: {errors}")
        raise RuntimeError("No s'ha pogut generar resposta amb cap dels models AI de suport.")
```

## Exemple d'ús
```python
client_ai = AIClient(api_key="tu-api-key")

missatges = [
    {"role": "system", "content": "Ets un asistent expert en agricultura que resumeix tasques de camp."},
    {"role": "user", "content": "Avui he estat posant sulfat de coure als cirerers unes 4 hores."}
]

# Idealment dins d'una funció asyncrona
resultat = await client_ai.generate_completion(missatges, empresa_id="uuid-de-empresa")
print(resultat)
```

## Validació
- Per provocar un fall-back de prova, canvia el primer model de la llista per una adreça inexistent (ex: "model/no-existeix") i mira si el client passa al segon.
- Verifica que el temps límit (`timeout`) salti si l'OpenRouter tarda més de 45 segons.

## Errors comuns
- Posar models al OpenRouter sense fons i no capturar o gestionar els 402 Payment Required si uses un compte de recàrrega.
- No fer tracking de l'`empresa_id` des del principi; pot esdevenir molt car quan un usuari en abusa i no se sap de quina instància era.
