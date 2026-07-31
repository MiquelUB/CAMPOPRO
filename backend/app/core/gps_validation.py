import math

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) in meters.
    """
    # Convert decimal degrees to radians 
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula 
    dlat = lat2 - lat1 
    dlon = lon2 - lon1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371000 # Radius of earth in meters
    return c * r

def validate_gps_coordinates(mobile_lat: float, mobile_lon: float, farm_lat: float, farm_lon: float, max_distance_meters: float = 100.0) -> bool:
    """
    Validates that the mobile coordinates are within a certain distance from the farm coordinates.
    Prevents GPS spoofing or wrong check-ins.
    """
    distance = haversine(mobile_lat, mobile_lon, farm_lat, farm_lon)
    return distance <= max_distance_meters
