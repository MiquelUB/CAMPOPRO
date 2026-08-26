import asyncio
import json
import urllib.request
import urllib.error

data = {
    "nom": "Test User",
    "rol": "OPERARI",
    "telefon": "123456789",
    "actiu": True
}
req = urllib.request.Request(
    'https://campopro-backend.80opze.easypanel.host/api/v1/users/',
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
try:
    with urllib.request.urlopen(req) as response:
        print("Success:", response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTPError {e.code}:", e.read().decode())
except Exception as e:
    print("Error:", str(e))
