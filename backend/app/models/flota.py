from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Date, Text, text, Boolean, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class Eina(Base):
    __tablename__ = "eines"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empreses.id", ondelete="CASCADE"), nullable=False)
    codi = Column(String(50))
    nom = Column(String(200), nullable=False)
    categoria = Column(String(50))
    marca = Column(String(100))
    model = Column(String(100))
    numero_serie = Column(String(100))
    data_compra = Column(Date)
    preu_compra = Column(Numeric(10, 2))
    estat = Column(String(20), nullable=False, default="disponible")
    ubicacio_actual = Column(String(100))
    operari_actual_id = Column(UUID(as_uuid=True), ForeignKey("usuaris.id", ondelete="SET NULL"))
    ultima_revisio = Column(Date)
    propera_revisio = Column(Date)
    notes_manteniment = Column(Text)
    actiu = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.utcnow)

    assignacions = relationship("AssignacioEina", back_populates="eina")

class AssignacioEina(Base):
    __tablename__ = "assignacio_eines"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    feina_id = Column(UUID(as_uuid=True))
    eina_id = Column(UUID(as_uuid=True), ForeignKey("eines.id", ondelete="CASCADE"), nullable=False)
    assignada = Column(Boolean, nullable=False, default=False)
    recollida = Column(Boolean, nullable=False, default=False)
    retornada = Column(Boolean, nullable=False, default=False)
    hora_recollida = Column(DateTime(timezone=True))
    hora_retorn = Column(DateTime(timezone=True))
    estat_retorn = Column(String(20))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.utcnow)

    eina = relationship("Eina", back_populates="assignacions")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empreses.id", ondelete="CASCADE"), nullable=False)
    tipus = Column(String(20), nullable=False, default="vehicle_km")
    nom = Column(String(200), nullable=False)
    matricula = Column(String(20))
    marca = Column(String(100))
    model = Column(String(100))
    any_fabricacio = Column(Integer)
    km_actual = Column(Numeric(10, 2), default=0)
    hores_acumulades = Column(Numeric(10, 1), default=0)
    itv_data_caducitat = Column(Date)
    seguro_polissa = Column(String(100))
    seguro_companyia = Column(String(100))
    seguro_data_caducitat = Column(Date)
    ultima_revisio = Column(Date)
    propera_revisio = Column(Date)
    interval_revisio_km = Column(Numeric(10, 2))
    interval_revisio_hores = Column(Numeric(10, 1))
    estat = Column(String(20), nullable=False, default="disponible")
    ubicacio_actual = Column(Text)
    operari_actual_id = Column(UUID(as_uuid=True), ForeignKey("usuaris.id", ondelete="SET NULL"))
    actiu = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.utcnow)

    registres_us = relationship("RegistreUsVehicle", back_populates="vehicle")

class RegistreUsVehicle(Base):
    __tablename__ = "registres_us_vehicle"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False)
    feina_id = Column(UUID(as_uuid=True))
    operari_id = Column(UUID(as_uuid=True), ForeignKey("usuaris.id", ondelete="CASCADE"), nullable=False)
    data = Column(Date, nullable=False)
    km_inici = Column(Numeric(10, 2))
    km_fi = Column(Numeric(10, 2))
    km_total = Column(Numeric(10, 2))
    hores_inici = Column(Numeric(10, 1))
    hores_fi = Column(Numeric(10, 1))
    hores_total = Column(Numeric(10, 1))
    litres_combustible = Column(Numeric(10, 2))
    cost_combustible = Column(Numeric(10, 2))
    foto_comptador_inici = Column(String(500))
    foto_comptador_fi = Column(String(500))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="registres_us")
