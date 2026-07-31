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
CREATE POLICY eines_all ON eines USING (empresa_id = current_setting('app.current_empresa_id', true)::UUID);
CREATE POLICY vehicles_all ON vehicles USING (empresa_id = current_setting('app.current_empresa_id', true)::UUID);

