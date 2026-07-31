-- 007_incidencies.sql
-- Taules per a Incidències i Pressupostos
-- Afegim polítiques RLS (Row Level Security) estrictes

CREATE TABLE IF NOT EXISTS incidencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    feina_id UUID NOT NULL REFERENCES feines(id) ON DELETE CASCADE,
    usuari_id UUID NOT NULL REFERENCES usuaris(id) ON DELETE CASCADE,
    tipus VARCHAR(50) NOT NULL,
    estat VARCHAR(20) NOT NULL DEFAULT 'pendent',
    descripcio_text TEXT,
    audio_url VARCHAR(500),
    foto_url VARCHAR(500),
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    veredict_ia_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pressupostos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    incidencia_id UUID NOT NULL REFERENCES incidencies(id) ON DELETE CASCADE,
    estat VARCHAR(20) NOT NULL DEFAULT 'esborrany',
    import_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    detalls JSONB,
    creat_per_id UUID NOT NULL REFERENCES usuaris(id) ON DELETE CASCADE,
    aprovat_per_id UUID REFERENCES usuaris(id) ON DELETE SET NULL,
    data_aprovacio TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE incidencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE pressupostos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuaris veuen incidencies de la seva empresa"
    ON incidencies FOR SELECT
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid);

CREATE POLICY "Operaris poden crear incidencies a la seva empresa"
    ON incidencies FOR INSERT
    WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::uuid);

CREATE POLICY "Superadmins poden fer tot amb incidencies de la seva empresa"
    ON incidencies FOR ALL
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid AND current_setting('app.current_rol') = 'super_admin');

CREATE POLICY "Usuaris veuen pressupostos de la seva empresa"
    ON pressupostos FOR SELECT
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid);

CREATE POLICY "Enginyers i superadmins poden crear pressupostos a la seva empresa"
    ON pressupostos FOR INSERT
    WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::uuid AND current_setting('app.current_rol') IN ('enginyer', 'super_admin'));

CREATE POLICY "Enginyers i superadmins poden editar pressupostos a la seva empresa"
    ON pressupostos FOR UPDATE
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid AND current_setting('app.current_rol') IN ('enginyer', 'super_admin'));

CREATE POLICY "Superadmins poden eliminar pressupostos a la seva empresa"
    ON pressupostos FOR DELETE
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid AND current_setting('app.current_rol') = 'super_admin');
