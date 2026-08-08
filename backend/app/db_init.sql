-- 001_empreses.sql
-- Taula principal d'Empreses (Multitenant)

CREATE TABLE IF NOT EXISTS empreses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    nif VARCHAR(20),
    adreca TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE empreses ENABLE ROW LEVEL SECURITY;

-- Funció genèrica per actualitzar updated_at automàticament
-- Utilitzada per triggers a múltiples taules (magatzem, etc.)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS usuaris (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empreses(id), -- NULL for super_admin
    rol VARCHAR(20) NOT NULL DEFAULT 'operari' CHECK (rol IN ('super_admin', 'empresari', 'cap_quadrilla', 'operari')),
    nom VARCHAR(100) NOT NULL,
    telefon VARCHAR(20),
    email VARCHAR(200),
    pin_hash VARCHAR(255),
    password_hash VARCHAR(255),
    totp_secret VARCHAR(64),
    totp_activat BOOLEAN NOT NULL DEFAULT false,
    ip_allowlist TEXT[],
    vehicle_assignat VARCHAR(50),
    actiu BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for authentication lookups
CREATE INDEX IF NOT EXISTS idx_usuaris_email ON usuaris(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_usuaris_telefon ON usuaris(telefon) WHERE telefon IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_usuaris_empresa ON usuaris(empresa_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_usuaris_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_usuaris_updated_at ON usuaris;
CREATE TRIGGER trigger_update_usuaris_updated_at
    BEFORE UPDATE ON usuaris
FOR EACH ROW
EXECUTE FUNCTION update_usuaris_updated_at();
-- Migration: 003_clients
-- Description: Creates municipis, clients, and equipament_instal_lat tables

CREATE TABLE IF NOT EXISTS municipis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    nom VARCHAR(200) NOT NULL,
    comarca VARCHAR(100),
    provincia VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    nom VARCHAR(200) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    email VARCHAR(200),
    nif VARCHAR(20),
    adreca TEXT,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    tipus VARCHAR(20) NOT NULL DEFAULT 'particular',
    municipi_id UUID REFERENCES municipis(id) ON DELETE SET NULL,
    preferencies JSONB DEFAULT '{}',
    notes TEXT,
    percentatge_incidencia_historic DECIMAL(5,2) DEFAULT 0,
    actiu BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipament_instal_lat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    nom VARCHAR(200) NOT NULL,
    tipus VARCHAR(50) NOT NULL,
    marca VARCHAR(100),
    model VARCHAR(100),
    data_instal_lacio DATE,
    garantia_anys INTEGER,
    data_ultima_revisio DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS Policies
ALTER TABLE municipis ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipament_instal_lat ENABLE ROW LEVEL SECURITY;

-- Standard RLS following postgresql_rls.md skill
-- Municipis
DROP POLICY IF EXISTS "municipis_select_policy" ON municipis;
CREATE POLICY "municipis_select_policy" ON municipis FOR SELECT
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "municipis_insert_policy" ON municipis;
CREATE POLICY "municipis_insert_policy" ON municipis FOR INSERT
WITH CHECK (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "municipis_update_policy" ON municipis;
CREATE POLICY "municipis_update_policy" ON municipis FOR UPDATE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "municipis_delete_policy" ON municipis;
CREATE POLICY "municipis_delete_policy" ON municipis FOR DELETE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

-- Clients
DROP POLICY IF EXISTS "clients_select_policy" ON clients;
CREATE POLICY "clients_select_policy" ON clients FOR SELECT
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "clients_insert_policy" ON clients;
CREATE POLICY "clients_insert_policy" ON clients FOR INSERT
WITH CHECK (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "clients_update_policy" ON clients;
CREATE POLICY "clients_update_policy" ON clients FOR UPDATE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "clients_delete_policy" ON clients;
CREATE POLICY "clients_delete_policy" ON clients FOR DELETE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

-- Equipament
DROP POLICY IF EXISTS "equipament_select_policy" ON equipament_instal_lat;
CREATE POLICY "equipament_select_policy" ON equipament_instal_lat FOR SELECT
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "equipament_insert_policy" ON equipament_instal_lat;
CREATE POLICY "equipament_insert_policy" ON equipament_instal_lat FOR INSERT
WITH CHECK (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "equipament_update_policy" ON equipament_instal_lat;
CREATE POLICY "equipament_update_policy" ON equipament_instal_lat FOR UPDATE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "equipament_delete_policy" ON equipament_instal_lat;
CREATE POLICY "equipament_delete_policy" ON equipament_instal_lat FOR DELETE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');
-- Migració 004: Magatzem i Inventari

-- Taula de Categories de Producte
CREATE TABLE IF NOT EXISTS public.categoria_producte (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    descripcio TEXT,
    creat_a TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualitzat_a TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, nom)
);

-- Taula de Productes
CREATE TABLE IF NOT EXISTS public.producte (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES public.categoria_producte(id) ON DELETE SET NULL,
    nom VARCHAR(100) NOT NULL,
    codi_barres VARCHAR(50),
    descripcio TEXT,
    preu_unitari DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    unitat_mesura VARCHAR(20) NOT NULL, -- kg, L, u, etc.
    estoc_minim DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    estoc_actual DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    creat_a TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualitzat_a TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, codi_barres)
);

-- Taula de Moviments de Magatzem
CREATE TABLE IF NOT EXISTS public.moviment_magatzem (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    producte_id UUID NOT NULL REFERENCES public.producte(id) ON DELETE RESTRICT,
    tipus VARCHAR(20) NOT NULL CHECK (tipus IN ('ENTRADA', 'SORTIDA', 'AJUST')),
    quantitat DECIMAL(10, 2) NOT NULL,
    motiu TEXT,
    usuari_id UUID NOT NULL REFERENCES usuaris(id) ON DELETE RESTRICT,
    data_moviment TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.categoria_producte ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producte ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moviment_magatzem ENABLE ROW LEVEL SECURITY;

-- Polítiques de Seguretat per categoria_producte
DROP POLICY IF EXISTS categoria_producte_empresa_policy ON categoria_producte;
CREATE POLICY categoria_producte_empresa_policy ON public.categoria_producte
    FOR ALL
    USING (empresa_id = current_setting('app.current_empresa_id', TRUE)::UUID)
    WITH CHECK (empresa_id = current_setting('app.current_empresa_id', TRUE)::UUID);

-- Polítiques de Seguretat per producte
DROP POLICY IF EXISTS producte_empresa_policy ON producte;
CREATE POLICY producte_empresa_policy ON public.producte
    FOR ALL
    USING (empresa_id = current_setting('app.current_empresa_id', TRUE)::UUID)
    WITH CHECK (empresa_id = current_setting('app.current_empresa_id', TRUE)::UUID);

-- Polítiques de Seguretat per moviment_magatzem
DROP POLICY IF EXISTS moviment_magatzem_empresa_policy ON moviment_magatzem;
CREATE POLICY moviment_magatzem_empresa_policy ON public.moviment_magatzem
    FOR ALL
    USING (empresa_id = current_setting('app.current_empresa_id', TRUE)::UUID)
    WITH CHECK (empresa_id = current_setting('app.current_empresa_id', TRUE)::UUID);

-- Funció específica per actualitzat_a (magatzem usa aquest nom de columna)
CREATE OR REPLACE FUNCTION update_actualitzat_a_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualitzat_a = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers per actualitzat_a
DROP TRIGGER IF EXISTS update_categoria_producte_modtime ON public.categoria_producte;
CREATE TRIGGER update_categoria_producte_modtime
    BEFORE UPDATE ON public.categoria_producte
    FOR EACH ROW
    EXECUTE FUNCTION update_actualitzat_a_column();

DROP TRIGGER IF EXISTS update_producte_modtime ON public.producte;
CREATE TRIGGER update_producte_modtime
    BEFORE UPDATE ON public.producte
    FOR EACH ROW
    EXECUTE FUNCTION update_actualitzat_a_column();

-- Índexs
CREATE INDEX IF NOT EXISTS idx_categoria_producte_empresa ON public.categoria_producte(empresa_id);
CREATE INDEX IF NOT EXISTS idx_producte_empresa_categoria ON public.producte(empresa_id, categoria_id);
CREATE INDEX IF NOT EXISTS idx_moviment_magatzem_producte ON public.moviment_magatzem(producte_id);
CREATE INDEX IF NOT EXISTS idx_moviment_magatzem_data ON public.moviment_magatzem(data_moviment);
-- 005_flota.sql
-- Models de Flota i Maquinària

CREATE TABLE IF NOT EXISTS eines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    codi VARCHAR(50),
    nom VARCHAR(200) NOT NULL,
    categoria VARCHAR(50),
    marca VARCHAR(100),
    model VARCHAR(100),
    numero_serie VARCHAR(100),
    data_compra DATE,
    preu_compra DECIMAL(10,2),
    estat VARCHAR(20) NOT NULL DEFAULT 'disponible',
    ubicacio_actual VARCHAR(100),
    operari_actual_id UUID REFERENCES usuaris(id) ON DELETE SET NULL,
    ultima_revisio DATE,
    propera_revisio DATE,
    notes_manteniment TEXT,
    actiu BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignacio_eines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feina_id UUID, -- Deixat null fins que creem la taula de feines
    eina_id UUID NOT NULL REFERENCES eines(id) ON DELETE CASCADE,
    assignada BOOLEAN NOT NULL DEFAULT false,
    recollida BOOLEAN NOT NULL DEFAULT false,
    retornada BOOLEAN NOT NULL DEFAULT false,
    hora_recollida TIMESTAMPTZ,
    hora_retorn TIMESTAMPTZ,
    estat_retorn VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    tipus VARCHAR(20) NOT NULL DEFAULT 'vehicle_km',
    nom VARCHAR(200) NOT NULL,
    matricula VARCHAR(20),
    marca VARCHAR(100),
    model VARCHAR(100),
    any_fabricacio INTEGER,
    km_actual DECIMAL(10,2) DEFAULT 0,
    hores_acumulades DECIMAL(10,1) DEFAULT 0,
    itv_data_caducitat DATE,
    seguro_polissa VARCHAR(100),
    seguro_companyia VARCHAR(100),
    seguro_data_caducitat DATE,
    ultima_revisio DATE,
    propera_revisio DATE,
    interval_revisio_km DECIMAL(10,2),
    interval_revisio_hores DECIMAL(10,1),
    estat VARCHAR(20) NOT NULL DEFAULT 'disponible',
    ubicacio_actual TEXT,
    operari_actual_id UUID REFERENCES usuaris(id) ON DELETE SET NULL,
    actiu BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS registres_us_vehicle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    feina_id UUID,
    operari_id UUID NOT NULL REFERENCES usuaris(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    km_inici DECIMAL(10,2),
    km_fi DECIMAL(10,2),
    km_total DECIMAL(10,2),
    hores_inici DECIMAL(10,1),
    hores_fi DECIMAL(10,1),
    hores_total DECIMAL(10,1),
    litres_combustible DECIMAL(10,2),
    cost_combustible DECIMAL(10,2),
    foto_comptador_inici VARCHAR(500),
    foto_comptador_fi VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS estricte
ALTER TABLE eines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignacio_eines ENABLE ROW LEVEL SECURITY;
ALTER TABLE registres_us_vehicle ENABLE ROW LEVEL SECURITY;

-- Polítiques (simplified, Agent Seguretat will expand)
DROP POLICY IF EXISTS eines_all ON eines;
CREATE POLICY eines_all ON eines USING (empresa_id = current_setting('app.current_empresa_id', true)::UUID);
DROP POLICY IF EXISTS vehicles_all ON vehicles;
CREATE POLICY vehicles_all ON vehicles USING (empresa_id = current_setting('app.current_empresa_id', true)::UUID);

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

DROP POLICY IF EXISTS "Usuaris veuen incidencies de la seva empresa" ON incidencies;
CREATE POLICY "Usuaris veuen incidencies de la seva empresa"
    ON incidencies FOR SELECT
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid);

DROP POLICY IF EXISTS "Operaris poden crear incidencies a la seva empresa" ON incidencies;
CREATE POLICY "Operaris poden crear incidencies a la seva empresa"
    ON incidencies FOR INSERT
    WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::uuid);

DROP POLICY IF EXISTS "Superadmins poden fer tot amb incidencies de la seva empresa" ON incidencies;
CREATE POLICY "Superadmins poden fer tot amb incidencies de la seva empresa"
    ON incidencies FOR ALL
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid AND current_setting('app.current_rol') = 'super_admin');

DROP POLICY IF EXISTS "Usuaris veuen pressupostos de la seva empresa" ON pressupostos;
CREATE POLICY "Usuaris veuen pressupostos de la seva empresa"
    ON pressupostos FOR SELECT
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid);

DROP POLICY IF EXISTS "Enginyers i superadmins poden crear pressupostos a la seva empresa" ON pressupostos;
CREATE POLICY "Enginyers i superadmins poden crear pressupostos a la seva empresa"
    ON pressupostos FOR INSERT
    WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::uuid AND current_setting('app.current_rol') IN ('enginyer', 'super_admin'));

DROP POLICY IF EXISTS "Enginyers i superadmins poden editar pressupostos a la seva empresa" ON pressupostos;
CREATE POLICY "Enginyers i superadmins poden editar pressupostos a la seva empresa"
    ON pressupostos FOR UPDATE
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid AND current_setting('app.current_rol') IN ('enginyer', 'super_admin'));

DROP POLICY IF EXISTS "Superadmins poden eliminar pressupostos a la seva empresa" ON pressupostos;
CREATE POLICY "Superadmins poden eliminar pressupostos a la seva empresa"
    ON pressupostos FOR DELETE
    USING (empresa_id = current_setting('app.current_empresa_id')::uuid AND current_setting('app.current_rol') = 'super_admin');
-- Migration: 008_notificacions
-- Description: Creates notificacions table and adds telegram_chat_id to clients

ALTER TABLE clients ADD COLUMN IF NOT EXISTS telegram_chat_id VARCHAR(50);

CREATE TABLE IF NOT EXISTS notificacions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empreses(id) ON DELETE CASCADE,
    destinatari_tipus VARCHAR(20) NOT NULL,
    destinatari_id UUID,
    destinatari_telefon VARCHAR(20),
    tipus VARCHAR(30) NOT NULL,
    missatge TEXT NOT NULL,
    canal VARCHAR(20) NOT NULL DEFAULT 'telegram',
    estat VARCHAR(20) NOT NULL DEFAULT 'pendent',
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS Policies
ALTER TABLE notificacions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notificacions_select_policy" ON notificacions;
CREATE POLICY "notificacions_select_policy" ON notificacions FOR SELECT
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "notificacions_insert_policy" ON notificacions;
CREATE POLICY "notificacions_insert_policy" ON notificacions FOR INSERT
WITH CHECK (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "notificacions_update_policy" ON notificacions;
CREATE POLICY "notificacions_update_policy" ON notificacions FOR UPDATE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

DROP POLICY IF EXISTS "notificacions_delete_policy" ON notificacions;
CREATE POLICY "notificacions_delete_policy" ON notificacions FOR DELETE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');
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
-- 024_auditoria.sql
CREATE TABLE IF NOT EXISTS auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID,
    taula VARCHAR(50) NOT NULL,
    registre_id UUID NOT NULL,
    accio VARCHAR(20) NOT NULL,
    usuari_id UUID,
    session_type VARCHAR(20) DEFAULT 'normal',
    ip VARCHAR(45),
    dades_anteriors JSONB,
    dades_noves JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Funció de trigger per auditar canvis
CREATE OR REPLACE FUNCTION trigger_audit_log()
RETURNS trigger AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
    v_empresa_id UUID;
    v_session_type VARCHAR(20);
    v_user_id UUID;
    v_ip VARCHAR(45);
BEGIN
    -- Obtenir variables de sessió si existeixen (configurades pel backend)
    BEGIN
        v_session_type := current_setting('app.session_type', true);
        v_user_id := nullif(current_setting('app.current_user_id', true), '')::uuid;
        v_ip := current_setting('app.client_ip', true);
    EXCEPTION WHEN OTHERS THEN
        v_session_type := 'normal';
    END;

    IF v_session_type IS NULL OR v_session_type = '' THEN
        v_session_type := 'normal';
    END IF;

    IF TG_OP = 'INSERT' THEN
        v_new_data := row_to_json(NEW);
        
        -- Intentar extreure empresa_id si existeix
        BEGIN
            v_empresa_id := NEW.empresa_id;
        EXCEPTION WHEN OTHERS THEN
            v_empresa_id := NULL;
        END;

        INSERT INTO auditoria (
            empresa_id, taula, registre_id, accio, usuari_id, 
            session_type, ip, dades_noves
        ) VALUES (
            v_empresa_id, TG_TABLE_NAME, NEW.id, 'INSERT', v_user_id, 
            v_session_type, v_ip, v_new_data
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        v_old_data := row_to_json(OLD);
        v_new_data := row_to_json(NEW);
        
        BEGIN
            v_empresa_id := NEW.empresa_id;
        EXCEPTION WHEN OTHERS THEN
            v_empresa_id := NULL;
        END;

        INSERT INTO auditoria (
            empresa_id, taula, registre_id, accio, usuari_id, 
            session_type, ip, dades_anteriors, dades_noves
        ) VALUES (
            v_empresa_id, TG_TABLE_NAME, NEW.id, 'UPDATE', v_user_id, 
            v_session_type, v_ip, v_old_data, v_new_data
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        v_old_data := row_to_json(OLD);
        
        BEGIN
            v_empresa_id := OLD.empresa_id;
        EXCEPTION WHEN OTHERS THEN
            v_empresa_id := NULL;
        END;

        INSERT INTO auditoria (
            empresa_id, taula, registre_id, accio, usuari_id, 
            session_type, ip, dades_anteriors
        ) VALUES (
            v_empresa_id, TG_TABLE_NAME, OLD.id, 'DELETE', v_user_id, 
            v_session_type, v_ip, v_old_data
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Habilitar triggers per taules importants, exemple usuaris (més taules afegides si cal)
-- Això captura canvis quan Super Admin impersona o fa canvis
-- Es pot estendre la crida a CREATE TRIGGER... a totes les taules rellevants.
CREATE TABLE IF NOT EXISTS proveidors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID,
    nif VARCHAR(20),
    nom VARCHAR(100) NOT NULL,
    categoria VARCHAR(100),
    contacte VARCHAR(100),
    telefon VARCHAR(20),
    email VARCHAR(100),
    adreca TEXT,
    productes TEXT,
    descompte VARCHAR(20),
    forma_pagament VARCHAR(50),
    condicions_pagament VARCHAR(50),
    iban VARCHAR(50),
    creat_a TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualitzat_a TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
