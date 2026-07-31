from fastapi import APIRouter, Depends, HTTPException, status, Body
import asyncpg
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime, date
import json

from app.dependencies import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.get("/avui", response_model=List[Dict[str, Any]])
async def obtenir_feines_avui(
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    """
    Obtenir les feines assignades a l'operari per al dia actual.
    Si es passen coordenades (lat, lng), es pot calcular o filtrar per proximitat si es vol.
    """
    # Check that user has current_empresa_id set
    empresa_id = user.get("empresa_id")
    if not empresa_id:
        raise HTTPException(status_code=400, detail="Usuari sense empresa")

    usuari_id = user["id"]
    avui = date.today()

    # Apply app.current_empresa_id for RLS
    await db.execute("SELECT set_config('app.current_empresa_id', $1, true)", str(empresa_id))

    query = """
        SELECT 
            f.id, f.codi, f.titol, f.descripcio, f.tipus, f.estat, f.prioritat,
            f.lat, f.lng, f.adreca, f.data_programada, f.hora_inici_prevista,
            f.hora_fi_prevista, f.hores_estimades, f.material_assignat, f.planol_id,
            a.rol_a_la_feina
        FROM feines f
        JOIN assignacions a ON f.id = a.feina_id
        WHERE a.usuari_id = $1 
          AND f.data_programada = $2
          AND f.actiu = true
    """
    # Order by distance if lat/lng are provided
    if lat is not None and lng is not None:
        query += """
            ORDER BY 
            (
                6371 * acos(
                    cos(radians($3)) * cos(radians(f.lat)) * cos(radians(f.lng) - radians($4)) + 
                    sin(radians($3)) * sin(radians(f.lat))
                )
            ) ASC
        """
        rows = await db.fetch(query, usuari_id, avui, lat, lng)
    else:
        query += " ORDER BY f.hora_inici_prevista ASC NULLS LAST"
        rows = await db.fetch(query, usuari_id, avui)

    result = []
    for r in rows:
        r_dict = dict(r)
        if r_dict.get('material_assignat'):
            r_dict['material_assignat'] = json.loads(r_dict['material_assignat'])
        else:
            r_dict['material_assignat'] = []
            
        # Parse dates/times properly for JSON
        if r_dict.get('data_programada'):
            r_dict['data_programada'] = str(r_dict['data_programada'])
        if r_dict.get('hora_inici_prevista'):
            r_dict['hora_inici_prevista'] = str(r_dict['hora_inici_prevista'])
        if r_dict.get('hora_fi_prevista'):
            r_dict['hora_fi_prevista'] = str(r_dict['hora_fi_prevista'])

        result.append(r_dict)

    return result

@router.post("/{feina_id}/estat")
async def actualitzar_estat(
    feina_id: UUID,
    estat: str = Body(..., embed=True),
    lat: Optional[float] = Body(None),
    lng: Optional[float] = Body(None),
    precisio_gps: Optional[float] = Body(None),
    user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    """
    Actualitzar l'estat d'una feina (iniciar, pausar, finalitzar) i registrar l'actuació amb GPS.
    """
    empresa_id = user.get("empresa_id")
    if not empresa_id:
        raise HTTPException(status_code=400, detail="Usuari sense empresa")

    await db.execute("SELECT set_config('app.current_empresa_id', $1, true)", str(empresa_id))

    estats_valids = ['pendent', 'en curs', 'pausada', 'finalitzada']
    if estat not in estats_valids:
        raise HTTPException(status_code=400, detail=f"Estat no vàlid. Vàlids: {estats_valids}")

    # Check if feina belongs to user (or just use RLS, but better to check assignation explicitly)
    feina = await db.fetchrow("SELECT id, estat FROM feines WHERE id = $1", feina_id)
    if not feina:
        raise HTTPException(status_code=404, detail="Feina no trobada")

    async with db.transaction():
        # Update feina state
        await db.execute(
            "UPDATE feines SET estat = $1, updated_at = now() WHERE id = $2",
            estat, feina_id
        )

        # Register actuacio
        tipus_actuacio = 'inici' if estat == 'en curs' else ('pausa' if estat == 'pausada' else 'fi')
        await db.execute(
            """
            INSERT INTO actuacions (feina_id, usuari_id, tipus, lat, lng, precisio_gps)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            feina_id, user["id"], tipus_actuacio, lat, lng, precisio_gps
        )

    return {"status": "ok", "message": f"Estat actualitzat a {estat}"}

@router.post("/sync-batch")
async def sync_batch(
    payload: Dict[str, Any] = Body(...),
    user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    """
    Endpoint per a processament en lot de les anotacions asíncrones offline de la PWA (IndexedDB).
    Rep un JSON complet amb les dades a sincronitzar.
    """
    empresa_id = user.get("empresa_id")
    if not empresa_id:
        raise HTTPException(status_code=400, detail="Usuari sense empresa")

    await db.execute("SELECT set_config('app.current_empresa_id', $1, true)", str(empresa_id))

    usuari_id = user["id"]
    accions = payload.get("accions", [])
    
    resultats = {
        "processats": 0,
        "errors": []
    }

    async with db.transaction():
        for accio in accions:
            tipus = accio.get("tipus")
            dades = accio.get("dades", {})
            local_id = accio.get("local_id")
            
            try:
                if tipus == "estat_feina":
                    feina_id = UUID(dades["feina_id"])
                    nou_estat = dades["estat"]
                    
                    await db.execute(
                        "UPDATE feines SET estat = $1, updated_at = now() WHERE id = $2",
                        nou_estat, feina_id
                    )
                    
                    tipus_actuacio = 'inici' if nou_estat == 'en curs' else ('pausa' if nou_estat == 'pausada' else 'fi')
                    await db.execute(
                        """
                        INSERT INTO actuacions (feina_id, usuari_id, tipus, lat, lng, precisio_gps, timestamp)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        """,
                        feina_id, usuari_id, tipus_actuacio, 
                        dades.get("lat"), dades.get("lng"), dades.get("precisio_gps"),
                        datetime.fromisoformat(dades.get("timestamp")) if dades.get("timestamp") else datetime.now()
                    )
                
                elif tipus == "consum_material":
                    feina_id = UUID(dades["feina_id"])
                    materials = json.dumps(dades.get("materials", []))
                    await db.execute(
                        "UPDATE feines SET material_consumit = $1::jsonb, updated_at = now() WHERE id = $2",
                        materials, feina_id
                    )

                elif tipus == "anotacio_planol":
                    planol_id = UUID(dades["planol_id"])
                    feina_id = UUID(dades["feina_id"])
                    await db.execute(
                        """
                        INSERT INTO anotacions_planol (planol_id, feina_id, operari_id, foto_url, nota_text, lat, lng)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        """,
                        planol_id, feina_id, usuari_id, dades.get("foto_url", ""), dades.get("nota_text", ""),
                        dades.get("lat"), dades.get("lng")
                    )
                
                elif tipus == "valoracio_resultat":
                    feina_id = UUID(dades["feina_id"])
                    await db.execute(
                        """
                        UPDATE feines 
                        SET resultat = $1, observacions = $2, valoracio_client = $3, updated_at = now()
                        WHERE id = $4
                        """,
                        dades.get("resultat"), dades.get("observacions"), dades.get("valoracio_client"), feina_id
                    )
                else:
                    raise Exception(f"Tipus d'acció desconegut: {tipus}")
                
                resultats["processats"] += 1
                
            except Exception as e:
                resultats["errors"].append({
                    "local_id": local_id,
                    "tipus": tipus,
                    "error": str(e)
                })

    return {"status": "ok", "resultats": resultats}
