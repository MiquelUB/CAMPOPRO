from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Text, text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from .base import Base

class Proveidor(Base):
    __tablename__ = "proveidors"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empresa.id", ondelete="CASCADE"), nullable=True)
    nif = Column(String(20), nullable=True)
    nom = Column(String(100), nullable=False)
    categoria = Column(String(100), nullable=True)
    contacte = Column(String(100), nullable=True)
    telefon = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    adreca = Column(Text, nullable=True)
    productes = Column(Text, nullable=True)
    descompte = Column(String(20), nullable=True)
    forma_pagament = Column(String(50), nullable=True)
    condicions_pagament = Column(String(50), nullable=True)
    iban = Column(String(50), nullable=True)
    creat_a = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    actualitzat_a = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.utcnow)
