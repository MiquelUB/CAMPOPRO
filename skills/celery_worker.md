# Skill: Celery + Redis Task Template

## Descripció
Aquesta skill serveix per a tasques en segon pla utilitzant Celery i Redis com a broker, per substituir el sistema de Supabase Edge Functions que s'utilitzava anteriorment. S'inclouen patrons com el "retry" o l'enllaç de tasques (chaining).

## Template

```python
# worker.py
from celery import Celery
from celery.schedules import crontab
from decouple import config
import time
import logging

logger = logging.getLogger(__name__)

# Configuració base de Celery
celery_app = Celery(
    "campopro_tasks",
    broker=config("REDIS_URL", default="redis://localhost:6379/0"),
    backend=config("REDIS_URL", default="redis://localhost:6379/1")
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Europe/Madrid',
    enable_utc=True,
    task_track_started=True,
)

# 1. Exemple de tasca asíncrona normal
@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def generate_pdf_report(self, report_id: str, data: dict):
    \"\"\"Generació de PDF i pujada a S3.\"\"\"
    try:
        logger.info(f"Generant PDF per a {report_id}...")
        # Lògica pesada (ReportLab, etc)
        # s3.upload_file(pdf_bytes, report_id)
        return {"status": "success", "report_id": report_id}
    except Exception as e:
        logger.error(f"Error a generate_pdf_report: {e}")
        raise self.retry(exc=e)

# 2. Exemple de processament OCR
@celery_app.task(bind=True, max_retries=5, default_retry_delay=10 * 60) # Backoff de 10 minuts
def process_ocr_receipt(self, image_url: str):
    \"\"\"Processar rebut via OCR. Retry per problemes de xarxa/API.\"\"\"
    try:
        logger.info("Processant OCR...")
        # trucada openrouter
        return {"extracted_total": 100.50}
    except Exception as e:
        raise self.retry(exc=e)

# 3. Notificacions Telegram
@celery_app.task(bind=True)
def send_telegram_notification(self, chat_id: str, message: str):
    \"\"\"Envia un missatge al Telegram del treballador.\"\"\"
    logger.info(f"Enviant telegram a {chat_id}: {message}")
    # aiogram logic / API call
    return True

# 4. Tasques periòdiques (Celery Beat)
@celery_app.task
def nightly_ai_batch_processing():
    \"\"\"Procés nocturn per actualitzar models AI.\"\"\"
    logger.info("Executant el procés nocturn AI...")
    return True

celery_app.conf.beat_schedule = {
    'processament-nocturn': {
        'task': 'worker.nightly_ai_batch_processing',
        'schedule': crontab(hour=3, minute=0), # Cada dia a les 3:00 AM
    },
}
```

## Exemple d'ús (Chaining)

Pots cridar aquestes funcions de la següent manera al backend:

```python
from celery import chain
from worker import process_ocr_receipt, send_telegram_notification

def handle_receipt_upload(image_url: str, chat_id: str):
    # Enllaçar tasques: l'output de la primera es passa a la segona
    workflow = chain(
        process_ocr_receipt.s(image_url),
        send_telegram_notification.s(chat_id)
    )
    workflow.apply_async()
```
Nota: Per al "chaining", assegura't que `send_telegram_notification` accepti el resultat de la primera tasca com un dels seus paràmetres, o fes servir `.si()` en comptes de `.s()` si vols invocar la segona funció ignorant el retorn de la primera.

## Validació
- Llança el worker i el beat amb els valors per defecte de Redis.
  - `celery -A worker worker --loglevel=info`
  - `celery -A worker beat --loglevel=info`
- Executa una tasca que falli intencionadament i mira els logs per comprovar que el "retry" s'aplica i finalment es queda en `FAILED`.

## Errors comuns
- Emmagatzemar objectes no serialitzables (ex. connexions a base de dades) en l'argument de les tasques (Pydantic objects han de ser passats com a `.model_dump()`).
- No definir timeouts. Es recomana usar soft_time_limit/time_limit per evitar que el worker quedi bloquejat si la tasca no acaba.
