from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.incidencia import Incidencia
from app.schemas.incidencia import IncidenciaCreate, IncidenciaInDB, IncidenciaUpdate

router = APIRouter()

@router.post("/", response_model=IncidenciaInDB, status_code=status.HTTP_201_CREATED)
def create_incidencia(incidencia: IncidenciaCreate, db: Session = Depends(get_db)):
    db_incidencia = Incidencia(**incidencia.model_dump())
    db.add(db_incidencia)
    db.commit()
    db.refresh(db_incidencia)
    return db_incidencia

@router.get("/", response_model=List[IncidenciaInDB])
def read_incidencies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    incidencies = db.query(Incidencia).offset(skip).limit(limit).all()
    return incidencies

@router.get("/{incidencia_id}", response_model=IncidenciaInDB)
def read_incidencia(incidencia_id: int, db: Session = Depends(get_db)):
    db_incidencia = db.query(Incidencia).filter(Incidencia.id == incidencia_id).first()
    if db_incidencia is None:
        raise HTTPException(status_code=404, detail="Incidencia not found")
    return db_incidencia

@router.put("/{incidencia_id}", response_model=IncidenciaInDB)
def update_incidencia(incidencia_id: int, incidencia: IncidenciaUpdate, db: Session = Depends(get_db)):
    db_incidencia = db.query(Incidencia).filter(Incidencia.id == incidencia_id).first()
    if db_incidencia is None:
        raise HTTPException(status_code=404, detail="Incidencia not found")
    
    update_data = incidencia.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_incidencia, key, value)
        
    db.add(db_incidencia)
    db.commit()
    db.refresh(db_incidencia)
    return db_incidencia

@router.delete("/{incidencia_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_incidencia(incidencia_id: int, db: Session = Depends(get_db)):
    db_incidencia = db.query(Incidencia).filter(Incidencia.id == incidencia_id).first()
    if db_incidencia is None:
        raise HTTPException(status_code=404, detail="Incidencia not found")
    db.delete(db_incidencia)
    db.commit()
    return None
