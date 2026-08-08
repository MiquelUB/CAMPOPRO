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
CREATE POLICY categoria_producte_empresa_policy ON public.categoria_producte
    FOR ALL
    USING (empresa_id = current_setting('app.current_empresa_id', TRUE)::UUID)
    WITH CHECK (empresa_id = current_setting('app.current_empresa_id', TRUE)::UUID);

-- Polítiques de Seguretat per producte
CREATE POLICY producte_empresa_policy ON public.producte
    FOR ALL
    USING (empresa_id = current_setting('app.current_empresa_id', TRUE)::UUID)
    WITH CHECK (empresa_id = current_setting('app.current_empresa_id', TRUE)::UUID);

-- Polítiques de Seguretat per moviment_magatzem
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
CREATE TRIGGER update_categoria_producte_modtime
    BEFORE UPDATE ON public.categoria_producte
    FOR EACH ROW
    EXECUTE FUNCTION update_actualitzat_a_column();

CREATE TRIGGER update_producte_modtime
    BEFORE UPDATE ON public.producte
    FOR EACH ROW
    EXECUTE FUNCTION update_actualitzat_a_column();

-- Índexs
CREATE INDEX idx_categoria_producte_empresa ON public.categoria_producte(empresa_id);
CREATE INDEX idx_producte_empresa_categoria ON public.producte(empresa_id, categoria_id);
CREATE INDEX idx_moviment_magatzem_producte ON public.moviment_magatzem(producte_id);
CREATE INDEX idx_moviment_magatzem_data ON public.moviment_magatzem(data_moviment);
