import json
import logging
from typing import Dict, Any, List, Optional
import asyncpg

logger = logging.getLogger(__name__)

async def cercar_feines_similars_tool(descripcio: str, empresa_id: str, db: asyncpg.Connection) -> List[Dict[str, Any]]:
    """
    Realitza una cerca per paraules clau sobre l'històric de feines.
    """
    # Create simple keyword search (split by spaces, filter short words)
    words = [w for w in descripcio.split() if len(w) > 3]
    if not words:
         return []
         
    # Build conditions
    conditions = []
    for i, word in enumerate(words):
         conditions.append(f"(titol ILIKE ${i+2} OR descripcio ILIKE ${i+2})")
         
    where_clause = " OR ".join(conditions)
    query = f"""
        SELECT codi, titol, descripcio, hores_reals, hores_estimades, material_consumit, material_assignat
        FROM feines
        WHERE empresa_id = $1 AND actiu = true AND ({where_clause})
        ORDER BY created_at DESC
        LIMIT 3
    """
    params = [empresa_id] + [f"%{w}%" for w in words]
    
    records = await db.fetch(query, *params)
    results = []
    for r in records:
        hores = float(r['hores_reals']) if r['hores_reals'] and r['hores_reals'] > 0 else float(r['hores_estimades'] or 0)
        # Handle material JSON safely
        try:
            material = json.loads(r['material_consumit']) if isinstance(r['material_consumit'], str) else r['material_consumit']
            if not material or len(material) == 0:
                material = json.loads(r['material_assignat']) if isinstance(r['material_assignat'], str) else r['material_assignat']
        except:
            material = []
            
        results.append({
            "codi": r['codi'],
            "titol": r['titol'],
            "hores": hores,
            "material": material
        })
    return results

async def consultar_magatzem_tool(materials_noms: List[str], empresa_id: str, db: asyncpg.Connection) -> List[Dict[str, Any]]:
    """
    Consulta l'estoc i preu de materials. Si no hi ha estoc, cerca productes similars de la mateixa categoria.
    """
    resultats = []
    for nom in materials_noms:
        # Cerca exacta o ILIKE
        query = """
            SELECT id, nom, preu_unitari, unitat_mesura, estoc_actual, categoria_id
            FROM producte
            WHERE empresa_id = $1 AND nom ILIKE $2
            LIMIT 1
        """
        record = await db.fetchrow(query, empresa_id, f"%{nom}%")
        
        if record:
            estoc = float(record['estoc_actual'])
            item = {
                "id": str(record['id']),
                "nom_demanat": nom,
                "nom_real": record['nom'],
                "preu_unitari": float(record['preu_unitari']),
                "unitat": record['unitat_mesura'],
                "estoc_disponible": estoc
            }
            if estoc <= 0 and record['categoria_id']:
                # Cercar substituts
                sub_query = """
                    SELECT id, nom, preu_unitari, estoc_actual
                    FROM producte
                    WHERE empresa_id = $1 AND categoria_id = $2 AND estoc_actual > 0 AND id != $3
                    LIMIT 3
                """
                subs = await db.fetch(sub_query, empresa_id, record['categoria_id'], record['id'])
                item["esgotat"] = True
                item["substitutius_recomanats"] = [
                    {"id": str(s['id']), "nom": s['nom'], "preu_unitari": float(s['preu_unitari']), "estoc_disponible": float(s['estoc_actual'])}
                    for s in subs
                ]
            else:
                item["esgotat"] = False
            resultats.append(item)
        else:
            resultats.append({
                "nom_demanat": nom,
                "trobat_a_magatzem": False
            })
    return resultats

async def consultar_eines_disponibles_tool(eines_noms: List[str], empresa_id: str, db: asyncpg.Connection) -> List[Dict[str, Any]]:
    """
    Comprova disponibilitat d'eines. Si no està disponible, retorna alternativa de la mateixa categoria.
    """
    resultats = []
    for nom in eines_noms:
        query = "SELECT id, nom, categoria, estat FROM eines WHERE empresa_id = $1 AND nom ILIKE $2 AND actiu = true LIMIT 1"
        record = await db.fetchrow(query, empresa_id, f"%{nom}%")
        
        if record:
            item = {
                "id": str(record['id']),
                "nom_demanat": nom,
                "nom_real": record['nom'],
                "estat": record['estat']
            }
            if record['estat'] != 'disponible' and record['categoria']:
                sub_query = "SELECT id, nom FROM eines WHERE empresa_id = $1 AND categoria = $2 AND estat = 'disponible' AND id != $3 LIMIT 2"
                subs = await db.fetch(sub_query, empresa_id, record['categoria'], record['id'])
                item["ocupada"] = True
                item["substitutives_lliures"] = [{"id": str(s['id']), "nom": s['nom']} for s in subs]
            else:
                item["ocupada"] = False
            resultats.append(item)
        else:
             resultats.append({"nom_demanat": nom, "trobada": False})
    return resultats

async def consultar_vehicles_disponibles_tool(tipus: Optional[str], empresa_id: str, db: asyncpg.Connection) -> List[Dict[str, Any]]:
    """
    Retorna vehicles lliures de cert tipus ('transport' o 'maquinària').
    """
    query = "SELECT id, nom, tipus, matricula FROM vehicles WHERE empresa_id = $1 AND estat = 'disponible' AND actiu = true"
    params = [empresa_id]
    
    if tipus:
         query += " AND tipus ILIKE $2"
         params.append(f"%{tipus}%")
         
    query += " LIMIT 5"
    
    records = await db.fetch(query, *params)
    return [
        {"id": str(r['id']), "nom": r['nom'], "tipus": r['tipus'], "matricula": r['matricula']}
        for r in records
    ]

async def consultar_operaris_disponibles_tool(habilitat: Optional[str], empresa_id: str, db: asyncpg.Connection) -> List[Dict[str, Any]]:
    """
    Busca operaris actius. (Nota: com que 'usuaris' no té camp 'habilitat' o 'especialitat', retorna operaris generals).
    """
    query = "SELECT id, nom FROM usuaris WHERE empresa_id = $1 AND rol = 'operari' AND actiu = true LIMIT 5"
    records = await db.fetch(query, empresa_id)
    return [
        {"id": str(r['id']), "nom": r['nom'], "notificacio": "L'usuari es troba disponible."}
        for r in records
    ]

async def consultar_planols_ubicacio_tool(client_id: str, empresa_id: str, db: asyncpg.Connection) -> List[Dict[str, Any]]:
    """
    Retorna plànols lligats al client
    """
    if not client_id or client_id == 'null' or client_id == 'None':
         return []
         
    query = "SELECT id, nom, tipus, ubicacio_municipal FROM planols WHERE empresa_id = $1 AND client_id = $2 AND actiu = true LIMIT 5"
    try:
        records = await db.fetch(query, empresa_id, client_id)
        return [
            {"id": str(r['id']), "nom": r['nom'], "tipus": r['tipus'], "ubicacio_municipal": r['ubicacio_municipal']}
            for r in records
        ]
    except Exception as e:
        logger.error(f"Error consulting planols: {e}")
        return []
