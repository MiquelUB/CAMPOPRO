from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base

class Incidencia(Base):
    __tablename__ = "incidencies"

    id = Column(Integer, primary_key=True, index=True)
    feina_id = Column(Integer, ForeignKey("feines.id"), nullable=False)
    operari_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transcripcio_audio = Column(Text, nullable=True)
    foto_url = Column(String, nullable=True)
    memondum = Column(JSON, nullable=True)
    requires_budget = Column(Boolean, default=False)
    estat = Column(String, default="Pendent") # Pendent, Aprovat, Resolta, etc.
    data_creacio = Column(DateTime, default=datetime.utcnow)

    # relacions (assumint que Feina i User tenen la relacio de tornada)
    # feina = relationship("Feina", back_populates="incidencies")
    # operari = relationship("User", back_populates="incidencies_creades")
    pressupostos = relationship("PressupostAddicional", back_populates="incidencia", cascade="all, delete-orphan")


class PressupostAddicional(Base):
    __tablename__ = "pressupostos_addicionals"

    id = Column(Integer, primary_key=True, index=True)
    incidencia_id = Column(Integer, ForeignKey("incidencies.id"), nullable=False)
    import_estimat = Column(Float, nullable=False)
    detalls = Column(Text, nullable=True)
    estat = Column(String, default="Pendent") # Pendent, Aprovat, Rebutjat
    data_creacio = Column(DateTime, default=datetime.utcnow)

    incidencia = relationship("Incidencia", back_populates="pressupostos")
