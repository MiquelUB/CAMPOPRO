from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import get_settings
from app.core.database import db_pool
from app.core.rate_limit import setup_rate_limiting, limiter

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to database
    await db_pool.connect()
    yield
    # Shutdown: disconnect from database
    await db_pool.disconnect()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

from app.api.v1.auth import router as auth_router
from app.api.v1.clients import router as clients_router
from app.api.v1.municipis import router as municipis_router
from app.api.v1.equipament import router as equipament_router
from app.api.v1.magatzem import router as magatzem_router
from app.api.v1.ocr import router as ocr_router
from app.api.v1.eines import router as eines_router
from app.api.v1.vehicles import router as vehicles_router
from app.api.v1.feines import router as feines_router
from app.api.v1.feines_operari import router as feines_operari_router
from app.api.v1.planols import router as planols_router
from app.api.v1.ai_suggestions import router as ai_suggestions_router
from app.api.v1.incidencies import router as incidencies_router
from app.api.v1.pressupostos import router as pressupostos_router
from app.api.v1.ai_evaluator import router as ai_evaluator_router
from app.api.v1.notificacions import router as notificacions_router

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(clients_router, prefix=f"{settings.API_V1_STR}")
app.include_router(municipis_router, prefix=f"{settings.API_V1_STR}")
app.include_router(equipament_router, prefix=f"{settings.API_V1_STR}")
app.include_router(magatzem_router, prefix=f"{settings.API_V1_STR}/magatzem", tags=["magatzem"])
app.include_router(ocr_router, prefix=f"{settings.API_V1_STR}/ocr", tags=["ocr"])
app.include_router(eines_router, prefix=f"{settings.API_V1_STR}/eines", tags=["eines"])
app.include_router(vehicles_router, prefix=f"{settings.API_V1_STR}/vehicles", tags=["vehicles"])
app.include_router(feines_router, prefix=f"{settings.API_V1_STR}/feines", tags=["feines"])
app.include_router(feines_operari_router, prefix=f"{settings.API_V1_STR}/feines-operari", tags=["feines-operari"])
app.include_router(planols_router, prefix=f"{settings.API_V1_STR}/planols", tags=["planols"])
app.include_router(ai_suggestions_router, prefix=f"{settings.API_V1_STR}/ai-suggestions", tags=["ai-suggestions"])
app.include_router(incidencies_router, prefix=f"{settings.API_V1_STR}/incidencies", tags=["incidencies"])
app.include_router(pressupostos_router, prefix=f"{settings.API_V1_STR}/pressupostos", tags=["pressupostos"])
app.include_router(ai_evaluator_router, prefix=f"{settings.API_V1_STR}/ai-evaluator", tags=["ai-evaluator"])
app.include_router(notificacions_router, prefix=f"{settings.API_V1_STR}/notificacions", tags=["notificacions"])

setup_rate_limiting(app)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*",  # Permet qualsevol domini HTTP/HTTPS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@limiter.exempt
async def health_check(request: Request):
    return {"status": "ok", "version": settings.VERSION}
