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
