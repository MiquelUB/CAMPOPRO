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
CREATE INDEX idx_usuaris_email ON usuaris(email) WHERE email IS NOT NULL;
CREATE INDEX idx_usuaris_telefon ON usuaris(telefon) WHERE telefon IS NOT NULL;
CREATE INDEX idx_usuaris_empresa ON usuaris(empresa_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_usuaris_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_usuaris_updated_at
BEFORE UPDATE ON usuaris
FOR EACH ROW
EXECUTE FUNCTION update_usuaris_updated_at();
