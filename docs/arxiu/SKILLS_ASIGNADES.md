# SKILLS ASIGNADES — CampoPro Builder

## Skill: fastapi_crud

### Descripció
Crea routers CRUD complets per a FastAPI amb paginació, filtres, validació Pydantic i integració Supabase.

### Fitxer template: `backend/app/api/_template_crud.py`

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import UUID

from app.models.[entitat] import [Entitat]Create, [Entitat]Update, [Entitat]Response
from app.core.supabase_client import get_supabase
from app.dependencies import get_current_user, require_empresari

router = APIRouter(prefix="/api/[entitats]", tags=["[Entitats]"])

@router.get("", response_model=List[[Entitat]Response])
async def llista_[entitats](
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    filtre: Optional[str] = None,
    current_user = Depends(get_current_user),
):
    supabase = get_supabase()
    query = supabase.table("[entitats]").select("*").eq("empresa_id", current_user.empresa_id)

    if filtre:
        query = query.ilike("nom", f"%{filtre}%")

    result = query.range(skip, skip + limit - 1).execute()
    return result.data

@router.get("/{id}", response_model=[Entitat]Response)
async def detall_[entitat](
    id: UUID,
    current_user = Depends(get_current_user),
):
    supabase = get_supabase()
    result = supabase.table("[entitats]").select("*").eq("id", str(id)).eq("empresa_id", current_user.empresa_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="[Entitat] no trobada")

    return result.data

@router.post("", response_model=[Entitat]Response, status_code=201)
async def crear_[entitat](
    data: [Entitat]Create,
    current_user = Depends(get_current_user),
):
    supabase = get_supabase()
    data_dict = data.model_dump()
    data_dict["empresa_id"] = current_user.empresa_id

    result = supabase.table("[entitats]").insert(data_dict).execute()
    return result.data[0]

@router.patch("/{id}", response_model=[Entitat]Response)
async def actualitzar_[entitat](
    id: UUID,
    data: [Entitat]Update,
    current_user = Depends(get_current_user),
):
    supabase = get_supabase()
    data_dict = {k: v for k, v in data.model_dump().items() if v is not None}

    result = supabase.table("[entitats]").update(data_dict).eq("id", str(id)).eq("empresa_id", current_user.empresa_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="[Entitat] no trobada")

    return result.data[0]

@router.delete("/{id}", status_code=204)
async def eliminar_[entitat](
    id: UUID,
    current_user = Depends(get_current_user),
):
    supabase = get_supabase()
    result = supabase.table("[entitats]").update({"actiu": False}).eq("id", str(id)).eq("empresa_id", current_user.empresa_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="[Entitat] no trobada")
```

### Quan usar
Per a cada nou domini que necessiti CRUD complet.

---

## Skill: supabase_rls

### Descripció
Escriu policies Row Level Security segures per a Supabase.

### Fitxer template: `supabase/migrations/_template_rls.sql`

```sql
-- ============================================
-- Taula: [nom_taula]
-- ============================================

-- 1. Crear taula
CREATE TABLE IF NOT EXISTS [nom_taula] (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id),
    -- [camps específics]
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Índexos
CREATE INDEX IF NOT EXISTS idx_[taula]_empresa ON [nom_taula](empresa_id);
-- [índexos addicionals segons queries]

-- 3. Enable RLS
ALTER TABLE [nom_taula] ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "[taula]_select_empresa" ON [nom_taula]
    FOR SELECT
    USING (empresa_id IN (
        SELECT empresa_id FROM usuaris WHERE id = auth.uid()
    ));

CREATE POLICY "[taula]_insert_empresa" ON [nom_taula]
    FOR INSERT
    WITH CHECK (empresa_id IN (
        SELECT empresa_id FROM usuaris WHERE id = auth.uid()
    ));

CREATE POLICY "[taula]_update_empresa" ON [nom_taula]
    FOR UPDATE
    USING (empresa_id IN (
        SELECT empresa_id FROM usuaris WHERE id = auth.uid()
    ));

CREATE POLICY "[taula]_delete_empresa" ON [nom_taula]
    FOR DELETE
    USING (empresa_id IN (
        SELECT empresa_id FROM usuaris WHERE id = auth.uid()
    ));

-- 5. Trigger updated_at
CREATE TRIGGER update_[taula]_updated_at
    BEFORE UPDATE ON [nom_taula]
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Quan usar
Per a cada nova taula al schema.

---

## Skill: pydantic_validator

### Descripció
Validació complexa de models Pydantic amb cross-field validation.

### Exemple

```python
from pydantic import BaseModel, Field, model_validator
from typing import Optional
from decimal import Decimal

class FeinaCreate(BaseModel):
    client_id: str = Field(..., description="ID del client")
    titol: str = Field(..., min_length=3, max_length=200)
    tipus: str = Field(..., pattern=r"^(jardineria|muntatge|manteniment)$")
    data_programada: str = Field(..., description="YYYY-MM-DD")
    hores_estimades: Optional[Decimal] = Field(None, ge=0.5, le=24)
    percentatge_incidencia_estimat: Optional[Decimal] = Field(0, ge=0, le=100)

    @model_validator(mode='after')
    def validar_dates(self):
        # Validar que data_programada >= avui
        return self

    @model_validator(mode='after')
    def validar_material(self):
        # Si tipus és 'muntatge', hores_estimades obligatori
        return self
```

### Quan usar
Quan hi ha lògica de negoci que depèn de múltiples camps.

---

## Skill: offline_sync

### Descripció
Sincronització offline-first per a PWA amb IndexedDB i cua de sync.

### Fitxer: `pwa/lib/offline.ts`

```typescript
// Schema IndexedDB
const DB_NAME = 'campopro_offline';
const DB_VERSION = 1;

interface SyncOperation {
  id: string;
  endpoint: string;
  method: 'POST' | 'PATCH';
  payload: any;
  timestamp: number;
  retry_count: number;
}

export async function initOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('feines', { keyPath: 'id' });
      db.createObjectStore('sync_queue', { keyPath: 'id' });
      db.createObjectStore('fotos_pendents', { keyPath: 'id' });
    };
  });
}

export async function queueOperation(op: Omit<SyncOperation, 'id' | 'timestamp' | 'retry_count'>): Promise<void> {
  const db = await initOfflineDB();
  const tx = db.transaction('sync_queue', 'readwrite');
  const store = tx.objectStore('sync_queue');

  await store.add({
    id: crypto.randomUUID(),
    ...op,
    timestamp: Date.now(),
    retry_count: 0,
  });
}

export async function syncQueue(supabase: any): Promise<{ success: string[]; failed: string[] }> {
  const db = await initOfflineDB();
  const tx = db.transaction('sync_queue', 'readonly');
  const store = tx.objectStore('sync_queue');
  const ops: SyncOperation[] = await store.getAll();

  const success: string[] = [];
  const failed: string[] = [];

  for (const op of ops) {
    try {
      const response = await fetch(op.endpoint, {
        method: op.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(op.payload),
      });

      if (response.ok) {
        success.push(op.id);
        const deleteTx = db.transaction('sync_queue', 'readwrite');
        await deleteTx.objectStore('sync_queue').delete(op.id);
      } else {
        failed.push(op.id);
      }
    } catch (e) {
      failed.push(op.id);
    }
  }

  return { success, failed };
}
```

### Quan usar
Per a la PWA de l'operari.

---

## Skill: ocr_openrouter

### Descripció
Pipeline OCR via OpenRouter visió per a tiquets de compra.

### Fitxer: `backend/app/services/ocr_service.py`

```python
import base64
import json
from typing import List, Dict
from app.core.openrouter_client import OpenRouterClient

class OCRService:
    def __init__(self):
        self.client = OpenRouterClient()

    async def processar_tiquet(self, image_base64: str) -> List[Dict]:
        prompt = (
            "Analitza aquest tiquet de compra i extreu tots els productes. "
            "Per cada producte, retorna: nom, quantitat, unitat, preu_unitari, preu_total. "
            "Retorna SEMPRE un JSON amb aquesta estructura exacta: "
            '{"productes": [{"nom": "...", "quantitat": X, "unitat": "...", "preu_unitari": X.XX, "preu_total": X.XX}]} '
            'Si no pots llegir el tiquet, retorna {"productes": [], "error": "descripcio"}'
        )

        response = await self.client.vision_request(
            image_base64=image_base64,
            prompt=prompt,
            model="kimi/k2-vision"
        )

        try:
            content = response["choices"][0]["message"]["content"]
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            data = json.loads(content[json_start:json_end])
            return data.get("productes", [])
        except (json.JSONDecodeError, KeyError) as e:
            raise ValueError(f"No s'ha pogut parsejar la resposta OCR: {e}")
```

### Quan usar
Per al dashboard de magatzem (entrada de tiquets).

---

## Skill: telegram_handler

### Descripció
Handlers aiogram 3.x amb botons inline i callbacks.

### Fitxer template: `bot/handlers/_template.py`

```python
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import Command
from aiogram.utils.keyboard import InlineKeyboardBuilder

from bot.config import settings
from bot.services.faq_service import FAQService

router = Router()
faq_service = FAQService()

@router.message(Command("start"))
async def cmd_start(message: Message):
    builder = InlineKeyboardBuilder()
    builder.button(text="📅 Horari", callback_data="faq_horari")
    builder.button(text="📸 Fotos", callback_data="faq_fotos")
    builder.button(text="⚠️ Problema", callback_data="faq_problema")
    builder.button(text="📞 Contactar", callback_data="faq_contactar")
    builder.adjust(2)

    await message.answer(
        "Benvingut a CampoPro! Com puc ajudar-te?",
        reply_markup=builder.as_markup()
    )

@router.callback_query(F.data.startswith("faq_"))
async def process_faq(callback: CallbackQuery):
    faq_key = callback.data.replace("faq_", "")
    resposta = await faq_service.get_resposta(faq_key, callback.from_user.id)

    await callback.message.edit_text(resposta)
    await callback.answer()

@router.message()
async def fallback_message(message: Message):
    await message.answer(
        "No he entès la teva pregunta. "
        "Et connectaré amb l'equip de CampoPro."
    )
```

### Quan usar
Per al bot de Telegram del client.

---

## Skill: pdf_reportlab

### Descripció
Generació PDF amb ReportLab per a informes i pre-factures.

### Fitxer template: `backend/app/services/pdf_service.py`

```python
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm

class PDFService:
    def __init__(self):
        self.styles = getSampleStyleSheet()

    def generar_prefactura(self, prefactura_data: dict, empresa_data: dict, client_data: dict) -> bytes:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm)

        elements = []

        # Capçalera empresa
        elements.append(Paragraph(f"<b>{empresa_data['nom']}</b>", self.styles['Heading1']))
        elements.append(Paragraph(f"NIF: {empresa_data['nif']}", self.styles['Normal']))
        elements.append(Paragraph(empresa_data['adreca'], self.styles['Normal']))
        elements.append(Spacer(1, 0.5*cm))

        # Dades client
        elements.append(Paragraph(f"<b>CLIENT:</b> {client_data['nom']}", self.styles['Heading2']))
        elements.append(Paragraph(f"{client_data['adreca']}", self.styles['Normal']))
        elements.append(Spacer(1, 0.5*cm))

        # Taula desglossament
        data = [['Concepte', 'Quantitat', 'Preu', 'Total']]

        table = Table(data, colWidths=[8*cm, 3*cm, 3*cm, 3*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2E7D32')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elements.append(table)

        doc.build(elements)
        buffer.seek(0)
        return buffer.read()
```

### Quan usar
Per a informes de feina i pre-factures.

---

## Skill: openrouter_client

### Descripció
Client reutilitzable per a OpenRouter amb retry i fallback de model.

### Fitxer: `backend/app/core/openrouter_client.py`

```python
import httpx
from typing import Optional, Dict, Any
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings

class OpenRouterClient:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.APP_URL,
            "X-Title": "CampoPro",
        }

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def chat_request(self, messages: list, model: Optional[str] = None) -> Dict[str, Any]:
        model = model or settings.OPENROUTER_MODEL_DEFAULT

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": 0.3,
                    "max_tokens": 2000,
                },
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def vision_request(self, image_base64: str, prompt: str, model: Optional[str] = None) -> Dict[str, Any]:
        model = model or settings.OPENROUTER_MODEL_VISION

        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}},
                ],
            }
        ]

        return await self.chat_request(messages, model)

    async def fallback_request(self, messages: list) -> Dict[str, Any]:
        models = [
            settings.OPENROUTER_MODEL_DEFAULT,
            "deepseek/deepseek-chat",
            "anthropic/claude-3-haiku",
        ]

        for model in models:
            try:
                return await self.chat_request(messages, model)
            except Exception:
                continue

        raise Exception("Tots els models han fallat")
```

### Quan usar
Per a TOTES les crides a IA (OCR, resum, predicció, etc.).

---

## Skill: pytest_fixture

### Descripció
Fixtures per a tests amb DB, auth i mocks.

### Fitxer: `backend/tests/conftest.py`

```python
import pytest
import pytest_asyncio
from httpx import AsyncClient

from app.main import app
from app.core.supabase_client import get_supabase

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest_asyncio.fixture
async def operari_auth(client):
    response = await client.post("/api/auth/login-pin", json={
        "telefon": "612345678",
        "pin": "1234"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest_asyncio.fixture
async def empresari_auth(client):
    response = await client.post("/api/auth/login-email", json={
        "email": "maria@exemple.com",
        "password": "password123"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def mock_openrouter(monkeypatch):
    async def mock_vision_request(*args, **kwargs):
        return {
            "choices": [{
                "message": {
                    "content": '{"productes": [{"nom": "Tub PVC 25mm", "quantitat": 5, "unitat": "metres", "preu_unitari": 2.50, "preu_total": 12.50}]}'
                }
            }]
        }

    monkeypatch.setattr("app.services.ocr_service.OCRService.processar_tiquet", mock_vision_request)
```

### Quan usar
Per a tots els tests del backend.

---

## Skill: supabase_edge

### Descripció
Edge Function amb Deno, typesafe per a cron jobs i webhooks.

### Fitxer template: `supabase/functions/_template/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface RequestBody {
  // Definir schema
}

serve(async (req: Request) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase.from("feines")
      .select("*")
      .eq("estat", "finalitzada")
      .gte("created_at", new Date(Date.now() - 86400000).toISOString());

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, count: data.length }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
```

### Quan usar
Per a batch nocturn IA, export Verifactu, webhook Telegram.
