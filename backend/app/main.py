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

import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to database
    await db_pool.connect()
    
    # Run migrations
    try:
        init_file = os.path.join(os.path.dirname(__file__), "db_init.sql")
        if os.path.exists(init_file):
            logger.info("Running database migrations...")
            with open(init_file, "r") as f:
                sql = f.read()
            # asyncpg execute can run multiple statements separated by semicolons
            async with db_pool.pool.acquire() as conn:
                await conn.execute(sql)
            logger.info("Database migrations completed successfully.")
    except Exception as e:
        logger.error(f"Error running database migrations: {e}")

    # Remove role constraint dynamically to allow frontend custom roles
    try:
        async with db_pool.pool.acquire() as conn:
            await conn.execute("""
                DO $$ 
                DECLARE 
                    constname text; 
                    constdef text;
                BEGIN 
                    SELECT conname, pg_get_constraintdef(oid) INTO constname, constdef 
                    FROM pg_constraint 
                    WHERE conrelid = 'usuaris'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) ILIKE '%rol%'; 
                    
                    IF constname IS NOT NULL AND constdef NOT ILIKE '%ENGINYER_SUPERVISOR%' THEN 
                        EXECUTE 'ALTER TABLE usuaris DROP CONSTRAINT ' || constname; 
                        EXECUTE 'ALTER TABLE usuaris ADD CONSTRAINT usuaris_rol_check CHECK (rol IN (''super_admin'', ''empresari'', ''cap_quadrilla'', ''operari'', ''ENGINYER_SUPERVISOR'', ''CAP_PERSONAL'', ''COMPTABILITAT'', ''SECRETARI'', ''CAP_GRUP_OPERARI'', ''OPERARI_PWA''))';
                    END IF; 
                END $$;
            """)
            logger.info("Checked and updated usuaris_rol constraint if needed.")
            
            # Auto-migrate new columns
            await conn.execute("""
                ALTER TABLE usuaris ADD COLUMN IF NOT EXISTS especialitat VARCHAR(100);
                ALTER TABLE usuaris ADD COLUMN IF NOT EXISTS cap_de_grup_id UUID REFERENCES usuaris(id);
            """)
            logger.info("Auto-migrated especialitat and cap_de_grup_id columns.")
    except Exception as e:
        logger.error(f"Error checking/updating DB constraints and columns: {e}")
        
    yield
    # Shutdown: disconnect from database
    await db_pool.disconnect()

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error on {request.method} {request.url}")
    logger.error(f"Body: {exc.body}")
    logger.error(f"Errors: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body}
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "msg": str(exc)}
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
from app.api.v1.users import router as users_router
from app.api.v1.proveidors import router as proveidors_router

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users_router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(proveidors_router, prefix=f"{settings.API_V1_STR}/proveidors", tags=["proveidors"])
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
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@limiter.exempt
async def health_check(request: Request):
    return {"status": "ok", "version": settings.VERSION}
