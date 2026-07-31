import httpx
import logging
from typing import Optional, Tuple
import asyncio
from app.config import get_settings

logger = logging.getLogger(__name__)

# Basic rate limiting for Nominatim (1 req/sec)
_last_request_time = 0.0
_lock = asyncio.Lock()

async def geocode_address(address: str) -> Tuple[Optional[float], Optional[float]]:
    """
    Geocodes an address using OpenStreetMap Nominatim.
    Returns a tuple (lat, lng).
    """
    global _last_request_time
    
    settings = get_settings()
    
    # Respect Nominatim usage policy (1 request per second)
    async with _lock:
        now = asyncio.get_event_loop().time()
        if now - _last_request_time < 1.1:
            await asyncio.sleep(1.1 - (now - _last_request_time))
        _last_request_time = asyncio.get_event_loop().time()

    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "limit": 1
    }
    headers = {
        "User-Agent": f"{settings.PROJECT_NAME}/{settings.VERSION} (Contact: support@{settings.PROJECT_NAME.lower()}.com)"
    }

    max_retries = 3
    base_delay = 2.0
    
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, headers=headers, timeout=10.0)
                
                if response.status_code == 429:
                    logger.warning(f"Rate limited by Nominatim. Attempt {attempt + 1}/{max_retries}")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(base_delay * (2 ** attempt))
                        continue
                        
                response.raise_for_status()
                
                data = response.json()
                if data and len(data) > 0:
                    lat = float(data[0]["lat"])
                    lng = float(data[0]["lon"])
                    return lat, lng
                return None, None
                
        except Exception as e:
            logger.error(f"Geocoding failed for address '{address}' on attempt {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(base_delay * (2 ** attempt))
            else:
                return None, None
                
    return None, None
