import asyncio
import os
import sys

# Afegim l'arrel del backend al path per poder importar l'app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import db_pool
from app.core.security import hash_password
from app.config import get_settings

async def seed_users():
    print("Connectant a la base de dades...")
    settings = get_settings()
    await db_pool.connect()
    
    try:
        # Check si ja existeix algun usuari
        count = await db_pool.fetchval("SELECT count(*) FROM usuaris")
        if count > 0:
            print(f"Ja existeixen {count} usuaris a la base de dades. No es crearan usuaris per defecte.")
            return

        print("Creant empresa per defecte...")
        empresa_id = await db_pool.fetchval(
            """
            INSERT INTO empreses (nom, nif, adreca)
            VALUES ($1, $2, $3)
            RETURNING id
            """,
            "CampoPro Demo SL", "B12345678", "Carrer Fals 123"
        )

        print("Creant usuaris per defecte...")
        pass_hash = hash_password("admin123")
        pin_hash = hash_password("1234")

        # Superadmin (no té empresa_id associada normalment, però li posem)
        await db_pool.execute(
            """
            INSERT INTO usuaris (empresa_id, rol, nom, email, password_hash, actiu)
            VALUES ($1, 'super_admin', 'Super Administrador', 'super@campopro.cat', $2, true)
            """,
            None, pass_hash
        )

        # Empresari / Enginyer
        await db_pool.execute(
            """
            INSERT INTO usuaris (empresa_id, rol, nom, email, password_hash, actiu)
            VALUES ($1, 'empresari', 'Enginyer Principal', 'enginyer@campopro.cat', $2, true)
            """,
            empresa_id, pass_hash
        )

        # Operari
        await db_pool.execute(
            """
            INSERT INTO usuaris (empresa_id, rol, nom, telefon, pin_hash, actiu)
            VALUES ($1, 'operari', 'Operari de Camp', '600123456', $2, true)
            """,
            empresa_id, pin_hash
        )

        print("=========================================")
        print("Usuaris creats correctament!")
        print("=========================================")
        print("Portal SuperAdmin:")
        print("  Email: super@campopro.cat")
        print("  Password: admin123")
        print("-----------------------------------------")
        print("Portal Enginyer (Gestió):")
        print("  Email: enginyer@campopro.cat")
        print("  Password: admin123")
        print("-----------------------------------------")
        print("Portal Operari:")
        print("  Telèfon: 600123456")
        print("  PIN: 1234")
        print("=========================================")
        
    except Exception as e:
        print(f"Error creant usuaris: {e}")
    finally:
        await db_pool.disconnect()

if __name__ == "__main__":
    asyncio.run(seed_users())
