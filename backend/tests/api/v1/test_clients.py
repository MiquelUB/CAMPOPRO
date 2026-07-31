import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock
from app.main import app
from app.dependencies import get_db
from app.core.security import get_current_user, TokenPayload

client = TestClient(app)

@pytest.fixture
def mock_db():
    mock = AsyncMock()
    return mock

def override_get_db(mock_db):
    async def _override():
        yield mock_db
    return _override

def override_get_current_user_empresa1():
    return TokenPayload(
        sub="11111111-1111-1111-1111-111111111111",
        empresa_id="empresa-1-id",
        rol="empresari"
    )

def override_get_current_user_empresa2():
    return TokenPayload(
        sub="22222222-2222-2222-2222-222222222222",
        empresa_id="empresa-2-id",
        rol="empresari"
    )

def test_crud_clients_empresa_isolation(mock_db):
    # App overrides for company 1
    app.dependency_overrides[get_db] = override_get_db(mock_db)
    app.dependency_overrides[get_current_user] = override_get_current_user_empresa1
    
    # Test GET list passes current_user.empresa_id (empresa-1-id)
    mock_db.fetch.return_value = []
    
    response = client.get("/api/v1/clients/")
    assert response.status_code == 200
    
    # Check that the first argument to db.fetch includes 'empresa-1-id'
    args = mock_db.fetch.call_args[0]
    assert "empresa-1-id" in args
    
    # Switch to company 2
    app.dependency_overrides[get_current_user] = override_get_current_user_empresa2
    
    response = client.get("/api/v1/clients/")
    assert response.status_code == 200
    
    # Check that it uses company 2 ID
    args = mock_db.fetch.call_args[0]
    assert "empresa-2-id" in args

    # Test GET detail, patch, delete passes current_user.empresa_id
    # mock fetchrow to return none simulating isolation
    mock_db.fetchrow.return_value = None
    
    response = client.get("/api/v1/clients/some-client-id")
    assert response.status_code == 404
    args = mock_db.fetchrow.call_args[0]
    assert "empresa-2-id" in args
    
    # Cleanup
    app.dependency_overrides.clear()
