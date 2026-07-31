from sqlalchemy import Column, String, Text, Boolean, Integer, Float, Date, Time, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .base import Base
import uuid

class Feina(Base):
    __tablename__ = "feines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empreses.id", ondelete="CASCADE"), nullable=False)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    codi = Column(String(20), nullable=False)
    titol = Column(String(200), nullable=False)
    descripcio = Column(Text)
    tipus = Column(String(50), nullable=False)
    estat = Column(String(20), nullable=False, default="pendent")
    prioritat = Column(Integer, nullable=False, default=2)
    lat = Column(Float)
    lng = Column(Float)
    adreca = Column(Text)
    data_programada = Column(Date, nullable=False)
    hora_inici_prevista = Column(Time)
    hora_fi_prevista = Column(Time)
    hores_estimades = Column(Float)
    hores_reals = Column(Float, default=0)
    percentatge_incidencia_estimat = Column(Float, default=0)
    material_assignat = Column(JSON, default=list)
    material_consumit = Column(JSON, default=list)
    planol_id = Column(UUID(as_uuid=True), ForeignKey("planols.id", ondelete="SET NULL"))
    area_m2 = Column(Float)
    resultat = Column(Text)
    observacions = Column(Text)
    valoracio_client = Column(Integer)
    actiu = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
