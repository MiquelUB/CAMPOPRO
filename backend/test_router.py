from fastapi import FastAPI, APIRouter
from fastapi.testclient import TestClient

app = FastAPI()

router = APIRouter(prefix="", tags=["users"])
@router.get("")
def get_users():
    return {"msg": "users"}

app.include_router(router, prefix="/api/v1/users")

client = TestClient(app)
print("GET /api/v1/users :", client.get("/api/v1/users").status_code)
print("GET /api/v1/users/ :", client.get("/api/v1/users/").status_code)
