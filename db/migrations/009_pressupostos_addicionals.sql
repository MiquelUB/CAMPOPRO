-- 009_pressupostos_addicionals.sql
-- Taula de pressupostos addicionals requerida per l'API de pressupostos

CREATE TABLE IF NOT EXISTS pressupostos_addicionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    incidencia_id UUID NOT NULL REFERENCES incidencies(id) ON DELETE CASCADE,
    descripcio TEXT,
    import_estimat DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    estat VARCHAR(20) NOT NULL DEFAULT 'pendent',
    creat_per_id UUID NOT NULL REFERENCES usuaris(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE pressupostos_addicionals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuaris veuen pressupostos_addicionals de la seva empresa" ON pressupostos_addicionals;
CREATE POLICY "Usuaris veuen pressupostos_addicionals de la seva empresa"
    ON pressupostos_addicionals FOR SELECT
    USING (empresa_id = current_setting('app.current_empresa_id', TRUE)::uuid);

DROP POLICY IF EXISTS "Usuaris insereixen pressupostos_addicionals a la seva empresa" ON pressupostos_addicionals;
CREATE POLICY "Usuaris insereixen pressupostos_addicionals a la seva empresa"
    ON pressupostos_addicionals FOR INSERT
    WITH CHECK (empresa_id = current_setting('app.current_empresa_id', TRUE)::uuid);
