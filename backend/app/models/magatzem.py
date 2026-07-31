from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class CategoriaProducte(Base):
    __tablename__ = "categoria_producte"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empresa.id", ondelete="CASCADE"), nullable=False)
    nom = Column(String(100), nullable=False)
    descripcio = Column(Text)
    creat_a = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    actualitzat_a = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.utcnow)

    productes = relationship("Producte", back_populates="categoria")


class Producte(Base):
    __tablename__ = "producte"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empresa.id", ondelete="CASCADE"), nullable=False)
    categoria_id = Column(UUID(as_uuid=True), ForeignKey("categoria_producte.id", ondelete="SET NULL"))
    nom = Column(String(100), nullable=False)
    codi_barres = Column(String(50))
    descripcio = Column(Text)
    preu_unitari = Column(Float, nullable=False, default=0.0)
    unitat_mesura = Column(String(20), nullable=False)
    estoc_minim = Column(Float, nullable=False, default=0.0)
    estoc_actual = Column(Float, nullable=False, default=0.0)
    creat_a = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    actualitzat_a = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.utcnow)

    categoria = relationship("CategoriaProducte", back_populates="productes")
    moviments = relationship("MovimentMagatzem", back_populates="producte")


class MovimentMagatzem(Base):
    __tablename__ = "moviment_magatzem"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empresa.id", ondelete="CASCADE"), nullable=False)
    producte_id = Column(UUID(as_uuid=True), ForeignKey("producte.id", ondelete="RESTRICT"), nullable=False)
    tipus = Column(String(20), nullable=False) # 'ENTRADA', 'SORTIDA', 'AJUST'
    quantitat = Column(Float, nullable=False)
    motiu = Column(Text)
    usuari_id = Column(UUID(as_uuid=True), ForeignKey("usuari.id", ondelete="RESTRICT"), nullable=False)
    data_moviment = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    producte = relationship("Producte", back_populates="moviments")
