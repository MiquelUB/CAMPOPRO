from sqlalchemy import Column, String, Text, Boolean, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .base import Base
import uuid

class Planol(Base):
    __tablename__ = "planols"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empreses.id", ondelete="CASCADE"), nullable=False)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    municipi_id = Column(UUID(as_uuid=True), ForeignKey("municipis.id", ondelete="SET NULL"))
    ubicacio_municipal = Column(String(200))
    nom = Column(String(200), nullable=False)
    tipus = Column(String(50), nullable=False)
    versio = Column(Integer, nullable=False, default=1)
    versio_anterior_id = Column(UUID(as_uuid=True), ForeignKey("planols.id", ondelete="SET NULL"))
    fitxer_original_url = Column(String(500), nullable=False)
    imatge_renderitzada_url = Column(String(500))
    bounds_json = Column(JSON)
    opacitat_defecte = Column(Float, default=0.7)
    canvis_descripcio = Column(Text)
    descripcio_ia = Column(Text)
    feina_origen_id = Column(UUID(as_uuid=True), ForeignKey("feines.id", ondelete="SET NULL"))
    creat_per_id = Column(UUID(as_uuid=True), ForeignKey("usuaris.id", ondelete="CASCADE"), nullable=False)
    actiu = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
