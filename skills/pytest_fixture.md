# Skill: Pytest Fixtures

## Descripció
Aquesta skill explica com preparar test fixtures per l'aplicació backend (FastAPI + PostgreSQL via asyncpg). Conté fixtures per al client HTTP, la connexió de Base de dades asíncrona (teardown netejat), usuaris/tokens de mock, i els mocks propis de serveis externs (OpenRouter).

## Template

```python
# conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
import asyncpg
from typing import AsyncGenerator

# Aquí hauries d'importar les teves coses, ex:
# from app.main import app
# from app.core.config import settings

# 1. Base de dades
@pytest_asyncio.fixture(scope="session")
async def db_pool() -> AsyncGenerator[asyncpg.Pool, None]:
    \"\"\"Estableix un Pool a la DB de test i el tanca al final.\"\"\"
    # Substitueix la DB per la de tests
    pool = await asyncpg.create_pool(dsn="postgresql://user:pass@localhost:5432/campopro_test")
    yield pool
    await pool.close()

@pytest_asyncio.fixture(autouse=True)
async def clear_db(db_pool: asyncpg.Pool):
    \"\"\"Neteja (TRUNCATE) les taules principals abans de cada test per tenir dades predecibles.\"\"\"
    async with db_pool.acquire() as conn:
        # ATENCIÓ: Assegura't de fer això només a la DB de test!
        await conn.execute("TRUNCATE TABLE usuaris, empreses, feines CASCADE")

# 2. Client HTTP
@pytest_asyncio.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    # Transport permet cridar directament a l'objecte app de FastAPI
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

# 3. Mocks per dades de tipus Facturació/Token
@pytest_asyncio.fixture
async def create_empresa(db_pool: asyncpg.Pool):
    async def _create_empresa(nom="Empresa Test SL"):
        async with db_pool.acquire() as conn:
            record = await conn.fetchrow(
                "INSERT INTO empreses (nom) VALUES ($1) RETURNING id", nom
            )
            return dict(record)
    return _create_empresa

@pytest_asyncio.fixture
async def admin_token(db_pool: asyncpg.Pool, create_empresa):
    \"\"\"Genera una empresa, un usuari admin i retorna un JWT per fer la crida.\"\"\"
    empresa = await create_empresa()
    # auth_service.create_token es la teva funció real o mock
    # token = create_access_token(data={"sub": "admin_user_id", "empresa_id": str(empresa['id'])})
    token = "fake_jwt_token_per_admin_de_" + str(empresa['id'])
    return {"Authorization": f"Bearer {token}", "empresa_id": empresa['id']}

# 4. Mocking de serveis (OpenRouter / S3)
@pytest.fixture
def mock_openrouter(mocker):
    \"\"\"Simula la resposta de la IA per a no gastar diners durant els tests.\"\"\"
    mock = mocker.patch("app.services.ai.AIClient.generate_completion", new_callable=mocker.AsyncMock)
    mock.return_value = "Resultat simulat de la IA"
    return mock
```

## Exemple d'ús
En un fitxer de tests, com `test_feines.py`:

```python
import pytest

@pytest.mark.asyncio
async def test_crear_feina_requereix_admin(async_client, admin_token):
    headers = {"Authorization": admin_token["Authorization"]}
    payload = {
        "tipus": "collita",
        "nif_client": "12345678Z",
        "telefon": "600100200",
        "hectarees": 1.5,
        "data_inici": "2026-07-31"
    }
    response = await async_client.post("/api/feines/", json=payload, headers=headers)
    
    assert response.status_code == 201
    data = response.json()
    assert data["empresa_id"] == str(admin_token["empresa_id"])
```

## Validació
- Llança `pytest -v` des d'una base de dades local de proves; si passa correctament significa que la inicialització i neteja funcionen.
- Afegeix un print o fa fallar el test expressament per assegurar que els `TRUNCATE CASCADE` de la fixture de dades estan buidant el context per evitar state sharing entre tests.

## Errors comuns
- Cridar `app` als tests utilitzant la DB de producció si el `settings.db_url` o l'entorn de tests no està correctament aïllat a pytest. (Aconsellable sobre-escriure env vars `DATABASE_URL` al principi).
- Oblidar afegir la marca `@pytest.mark.asyncio` a les funcions de test asíncrones.
- Retornar l'app en un thread per error amb httpx; si utilitzes FastAPI cal el `ASGITransport` (per HTTPX 0.24+) com a l'exemple superior.
