-- 006_feines.sql

CREATE TABLE IF NOT EXISTS planols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    municipi_id UUID REFERENCES municipis(id) ON DELETE SET NULL,
    ubicacio_municipal VARCHAR(200),
    nom VARCHAR(200) NOT NULL,
    tipus VARCHAR(50) NOT NULL,
    versio INTEGER NOT NULL DEFAULT 1,
    versio_anterior_id UUID REFERENCES planols(id) ON DELETE SET NULL,
    fitxer_original_url VARCHAR(500) NOT NULL,
    imatge_renderitzada_url VARCHAR(500),
    bounds_json JSONB,
    opacitat_defecte DECIMAL(3,2) DEFAULT 0.7,
    canvis_descripcio TEXT,
    descripcio_ia TEXT,
    creat_per_id UUID NOT NULL REFERENCES usuaris(id) ON DELETE CASCADE,
    actiu BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    codi VARCHAR(20) NOT NULL,
    titol VARCHAR(200) NOT NULL,
    descripcio TEXT,
    tipus VARCHAR(50) NOT NULL,
    estat VARCHAR(20) NOT NULL DEFAULT 'pendent',
    prioritat INTEGER NOT NULL DEFAULT 2,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    adreca TEXT,
    data_programada DATE NOT NULL,
    hora_inici_prevista TIME,
    hora_fi_prevista TIME,
    hores_estimades DECIMAL(4,1),
    hores_reals DECIMAL(4,1) DEFAULT 0,
    percentatge_incidencia_estimat DECIMAL(5,2) DEFAULT 0,
    material_assignat JSONB DEFAULT '[]'::jsonb,
    material_consumit JSONB DEFAULT '[]'::jsonb,
    planol_id UUID REFERENCES planols(id) ON DELETE SET NULL,
    area_m2 DECIMAL(10,2),
    resultat TEXT,
    observacions TEXT,
    valoracio_client INTEGER,
    actiu BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(empresa_id, codi)
);

ALTER TABLE planols ADD COLUMN IF NOT EXISTS feina_origen_id UUID REFERENCES feines(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS assignacions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feina_id UUID NOT NULL REFERENCES feines(id) ON DELETE CASCADE,
    usuari_id UUID NOT NULL REFERENCES usuaris(id) ON DELETE CASCADE,
    rol_a_la_feina VARCHAR(20) NOT NULL DEFAULT 'operari',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS actuacions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feina_id UUID NOT NULL REFERENCES feines(id) ON DELETE CASCADE,
    usuari_id UUID NOT NULL REFERENCES usuaris(id) ON DELETE CASCADE,
    tipus VARCHAR(20) NOT NULL,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    precisio_gps DECIMAL(6,1),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fotos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feina_id UUID NOT NULL REFERENCES feines(id) ON DELETE CASCADE,
    usuari_id UUID NOT NULL REFERENCES usuaris(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    tipus VARCHAR(20) NOT NULL,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    descripcio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS anotacions_planol (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planol_id UUID NOT NULL REFERENCES planols(id) ON DELETE CASCADE,
    feina_id UUID NOT NULL REFERENCES feines(id) ON DELETE CASCADE,
    operari_id UUID NOT NULL REFERENCES usuaris(id) ON DELETE CASCADE,
    foto_url VARCHAR(500) NOT NULL,
    nota_text TEXT NOT NULL,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS

ALTER TABLE planols ENABLE ROW LEVEL SECURITY;
ALTER TABLE feines ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignacions ENABLE ROW LEVEL SECURITY;
ALTER TABLE actuacions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE anotacions_planol ENABLE ROW LEVEL SECURITY;

-- Polítiques d'aïllament per empresa

DROP POLICY IF EXISTS planols_empresa_policy ON planols;
CREATE POLICY planols_empresa_policy ON planols
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid);

DROP POLICY IF EXISTS feines_empresa_policy ON feines;
CREATE POLICY feines_empresa_policy ON feines
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid);

-- Assignacions hereten empresa_id per join (o directament, si afegim empresa_id, però podem fer JOIN)
-- Com que no tenen empresa_id en la taula, fem JOIN o subquery.
DROP POLICY IF EXISTS assignacions_empresa_policy ON assignacions;
CREATE POLICY assignacions_empresa_policy ON assignacions
    USING (feina_id IN (SELECT id FROM feines WHERE empresa_id = current_setting('app.current_empresa_id')::uuid));

DROP POLICY IF EXISTS actuacions_empresa_policy ON actuacions;
CREATE POLICY actuacions_empresa_policy ON actuacions
    USING (feina_id IN (SELECT id FROM feines WHERE empresa_id = current_setting('app.current_empresa_id')::uuid));

DROP POLICY IF EXISTS fotos_empresa_policy ON fotos;
CREATE POLICY fotos_empresa_policy ON fotos
    USING (feina_id IN (SELECT id FROM feines WHERE empresa_id = current_setting('app.current_empresa_id')::uuid));

DROP POLICY IF EXISTS anotacions_planol_empresa_policy ON anotacions_planol;
CREATE POLICY anotacions_planol_empresa_policy ON anotacions_planol
    USING (planol_id IN (SELECT id FROM planols WHERE empresa_id = current_setting('app.current_empresa_id')::uuid));
