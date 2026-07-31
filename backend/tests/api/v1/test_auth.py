import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock
from app.main import app
from app.dependencies import get_db
from app.core.security import hash_password

client = TestClient(app)

@pytest.fixture
def mock_db():
    mock = AsyncMock()
    # Provide a fake user with hashed pin
    mock.fetchrow.return_value = {
        "id": "12345678-1234-5678-1234-567812345678",
        "empresa_id": "87654321-4321-8765-4321-876543210987",
        "rol": "operari",
        "pin_hash": hash_password("1234"),
        "actiu": True
    }
    return mock

def override_get_db(mock_db):
    async def _override():
        yield mock_db
    return _override

def test_login_pin_success(mock_db):
    app.dependency_overrides[get_db] = override_get_db(mock_db)
    
    response = client.post("/api/v1/auth/login/pin", json={
        "telefon": "600123456",
        "pin": "1234"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["rol"] == "operari"
    
    app.dependency_overrides.clear()

def test_login_pin_failure(mock_db):
    app.dependency_overrides[get_db] = override_get_db(mock_db)
    
    response = client.post("/api/v1/auth/login/pin", json={
        "telefon": "600123456",
        "pin": "9999" # Wrong PIN
    })
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Telèfon o PIN incorrecte"
    
    app.dependency_overrides.clear()
