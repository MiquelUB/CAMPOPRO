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

