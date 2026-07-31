# Skill: PostgreSQL Row Level Security (RLS) en Self-hosted

## Descripció
Aquesta skill conté un template per configurar la Seguretat a Nivell de Fila (RLS) en PostgreSQL self-hosted, emulant l'experiència de Supabase però utilitzant variables d'entorn locals al context de la connexió (via `SET LOCAL app.current_empresa_id = '...'`).

## Template

```sql
-- 1. Crear taula amb UUID PK, FK, i timestamps
CREATE TABLE public.[NOM_TAULA] (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empreses(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    -- [ALTRES_CAMPS]
    actiu BOOLEAN DEFAULT true,
    creat_el TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualitzat_el TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear índexos
CREATE INDEX idx_[NOM_TAULA]_empresa_id ON public.[NOM_TAULA](empresa_id);

-- 3. Trigger d'actualització de timestamps
CREATE OR REPLACE FUNCTION update_actualitzat_el_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualitzat_el = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_update_[NOM_TAULA]_actualitzat_el
    BEFORE UPDATE ON public.[NOM_TAULA]
    FOR EACH ROW
    EXECUTE FUNCTION update_actualitzat_el_column();

-- 4. Activar RLS
ALTER TABLE public.[NOM_TAULA] ENABLE ROW LEVEL SECURITY;

-- 5. Polítiques RLS utilitzant app.current_empresa_id
-- NOTA: Al backend FastAPI caldrà fer `await conn.execute("SET LOCAL app.current_empresa_id = $1", empresa_id)` abans de la transacció

CREATE POLICY "Usuaris poden veure només registres de la seva empresa"
ON public.[NOM_TAULA]
FOR SELECT
USING (
    empresa_id::text = current_setting('app.current_empresa_id', true)
    OR current_setting('app.is_super_admin', true) = 'true'
);

CREATE POLICY "Usuaris poden inserir registres a la seva empresa"
ON public.[NOM_TAULA]
FOR INSERT
WITH CHECK (
    empresa_id::text = current_setting('app.current_empresa_id', true)
    OR current_setting('app.is_super_admin', true) = 'true'
);

CREATE POLICY "Usuaris poden actualitzar registres de la seva empresa"
ON public.[NOM_TAULA]
FOR UPDATE
USING (
    empresa_id::text = current_setting('app.current_empresa_id', true)
    OR current_setting('app.is_super_admin', true) = 'true'
);

CREATE POLICY "Usuaris poden esborrar registres de la seva empresa"
ON public.[NOM_TAULA]
FOR DELETE
USING (
    empresa_id::text = current_setting('app.current_empresa_id', true)
    OR current_setting('app.is_super_admin', true) = 'true'
);

-- 6. Opcional: Trigger per auditoria
CREATE TABLE public.auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taula_nom TEXT NOT NULL,
    registre_id UUID NOT NULL,
    accio TEXT NOT NULL,
    usuari_id UUID,
    dades_antigues JSONB,
    dades_noves JSONB,
    creat_el TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
    curr_user_id UUID;
BEGIN
    -- Intentem obtenir l'ID de l'usuari actual de les variables d'entorn locals
    BEGIN
        curr_user_id := current_setting('app.current_user_id', true)::UUID;
    EXCEPTION WHEN OTHERS THEN
        curr_user_id := NULL;
    END;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.auditoria (taula_nom, registre_id, accio, usuari_id, dades_noves)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', curr_user_id, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.auditoria (taula_nom, registre_id, accio, usuari_id, dades_antigues, dades_noves)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', curr_user_id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.auditoria (taula_nom, registre_id, accio, usuari_id, dades_antigues)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', curr_user_id, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_[NOM_TAULA]
    AFTER INSERT OR UPDATE OR DELETE ON public.[NOM_TAULA]
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

## Exemple d'ús
En la lògica de la BD (per exemple, dins un middleware o de dependències de FastAPI), s'ha de configurar la variable de la connexió abans de fer queries de l'aplicació, preferiblement dintre d'una transacció:
```python
async with db.acquire() as conn:
    async with conn.transaction():
        await conn.execute("SET LOCAL app.current_empresa_id = $1", user['empresa_id'])
        if user.get('is_super_admin'):
            await conn.execute("SET LOCAL app.is_super_admin = 'true'")
        # Executar les consultes. L'RLS farà el filtrat.
        result = await conn.fetch("SELECT * FROM clients")
```

## Validació
- Utilitza diferents valors d'`app.current_empresa_id` i verifica que un SELECT només retorna dades de la seva empresa.
- Prova de fer un INSERT amb un `empresa_id` que no concorda amb l'`app.current_empresa_id`. S'hauria de denegar (Policy check failed).

## Errors comuns
- Oblidar usar `SET LOCAL`. Si fas un `SET` normal, l'opció persistirà per a aquella connexió al pool, la qual cosa pot causar filtracions de dades quan la connexió es reutilitzi per a un altre usuari.
- Confiar que el middleware sempre farà el `SET LOCAL` i no provar què passa fora de la transacció.
- Oblidar el paràmetre `true` a `current_setting('app.current_empresa_id', true)` i obtenir errors quan la variable no està definida.
