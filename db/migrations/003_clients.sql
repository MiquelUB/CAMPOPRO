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
CREATE POLICY "municipis_select_policy" ON municipis FOR SELECT
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "municipis_insert_policy" ON municipis FOR INSERT
WITH CHECK (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "municipis_update_policy" ON municipis FOR UPDATE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "municipis_delete_policy" ON municipis FOR DELETE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

-- Clients
CREATE POLICY "clients_select_policy" ON clients FOR SELECT
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "clients_insert_policy" ON clients FOR INSERT
WITH CHECK (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "clients_update_policy" ON clients FOR UPDATE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "clients_delete_policy" ON clients FOR DELETE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

-- Equipament
CREATE POLICY "equipament_select_policy" ON equipament_instal_lat FOR SELECT
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "equipament_insert_policy" ON equipament_instal_lat FOR INSERT
WITH CHECK (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "equipament_update_policy" ON equipament_instal_lat FOR UPDATE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "equipament_delete_policy" ON equipament_instal_lat FOR DELETE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');
