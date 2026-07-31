from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.incidencia import PressupostAddicional, Incidencia
from app.schemas.incidencia import PressupostAddicionalCreate, PressupostAddicionalInDB, PressupostAddicionalUpdate

router = APIRouter()

@router.post("/", response_model=PressupostAddicionalInDB, status_code=status.HTTP_201_CREATED)
def create_pressupost(pressupost: PressupostAddicionalCreate, db: Session = Depends(get_db)):
    db_incidencia = db.query(Incidencia).filter(Incidencia.id == pressupost.incidencia_id).first()
    if not db_incidencia:
        raise HTTPException(status_code=404, detail="Incidencia not found")
        
    db_pressupost = PressupostAddicional(**pressupost.model_dump())
    db.add(db_pressupost)
    db.commit()
    db.refresh(db_pressupost)
    return db_pressupost

@router.get("/", response_model=List[PressupostAddicionalInDB])
def read_pressupostos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    pressupostos = db.query(PressupostAddicional).offset(skip).limit(limit).all()
    return pressupostos

@router.get("/{pressupost_id}", response_model=PressupostAddicionalInDB)
def read_pressupost(pressupost_id: int, db: Session = Depends(get_db)):
    db_pressupost = db.query(PressupostAddicional).filter(PressupostAddicional.id == pressupost_id).first()
    if db_pressupost is None:
        raise HTTPException(status_code=404, detail="Pressupost not found")
    return db_pressupost

@router.put("/{pressupost_id}", response_model=PressupostAddicionalInDB)
def update_pressupost(pressupost_id: int, pressupost: PressupostAddicionalUpdate, db: Session = Depends(get_db)):
    db_pressupost = db.query(PressupostAddicional).filter(PressupostAddicional.id == pressupost_id).first()
    if db_pressupost is None:
        raise HTTPException(status_code=404, detail="Pressupost not found")
    
    update_data = pressupost.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_pressupost, key, value)
        
    db.add(db_pressupost)
    db.commit()
    db.refresh(db_pressupost)
    return db_pressupost

@router.delete("/{pressupost_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pressupost(pressupost_id: int, db: Session = Depends(get_db)):
    db_pressupost = db.query(PressupostAddicional).filter(PressupostAddicional.id == pressupost_id).first()
    if db_pressupost is None:
        raise HTTPException(status_code=404, detail="Pressupost not found")
    db.delete(db_pressupost)
    db.commit()
    return None
