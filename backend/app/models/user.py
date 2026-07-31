from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base # Assuming a base exists

class Usuari(Base):
    __tablename__ = "usuaris"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empreses.id"), nullable=True)
    rol = Column(String(20), nullable=False, default="operari")
    nom = Column(String(100), nullable=False)
    telefon = Column(String(20), nullable=True)
    email = Column(String(200), nullable=True)
    pin_hash = Column(String(255), nullable=True)
    password_hash = Column(String(255), nullable=True)
    totp_secret = Column(String(64), nullable=True)
    totp_activat = Column(Boolean, nullable=False, default=False)
    ip_allowlist = Column(ARRAY(String), nullable=True)
    vehicle_assignat = Column(String(50), nullable=True)
    actiu = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
