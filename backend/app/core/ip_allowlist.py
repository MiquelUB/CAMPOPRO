from fastapi import Request, HTTPException, status

ALLOWED_SUPERADMIN_IPS = {
    "127.0.0.1",
    # Add other allowed IPs here
}

def verify_superadmin_ip(request: Request):
    """
    Dependency to verify that the request to a superadmin endpoint comes from an allowed IP.
    """
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "127.0.0.1"
        
    # Example logic: in production you might use ipaddress module for CIDR matching
    # and load ALLOWED_SUPERADMIN_IPS from settings
    if client_ip not in ALLOWED_SUPERADMIN_IPS:
        # We can also check if the environment is development and bypass
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: IP not in allowlist for Super Admin."
        )
