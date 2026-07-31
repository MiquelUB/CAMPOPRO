# PLA MESTRE DE DESENVOLUPAMENT — CampoPro MVP

> **Versió:** 1.0  
> **Data:** 2026-06-16  
> **Stack:** Supabase + Vercel + FastAPI + Next.js 14 + aiogram 3.x + OpenRouter  
> **Estat:** Nivell 0 llest per començar

---

## ÍNDEX

1. [Visió General](#1-visió-general)
2. [Arquitectura de Dades](#2-arquitectura-de-dades)
3. [Nivells de Desenvolupament](#3-nivells-de-desenvolupament)
4. [Prompts per Nivell](#4-prompts-pas-a-pas-per-nivell)
5. [Validació i Criteris d'Acceptació](#5-validació-i-criteris-dacceptació)

---

## 1. VISIÓ GENERAL

CampoPro és una aplicació de gestió de camp per a empreses de 6-10 treballadors que fan jardineria, muntatge i manteniment. L'empresari crea feines des del mòbil, els operaris les executen amb mínima fricció (3 botons + fotos), i tot es documenta automàticament.

### Flux de 30 segons (promesa)

```
EMPRESARI (matí, mòbil):
  Crea feina → Descripció + mapa + material + hores → ASSIGNA

OPERARI (al lloc, PWA):
  Rep feina → Foto INICIAL (geoloc auto) → Botó INICIAR (2s)
  Durante: Material +/-, Incidència foto+veu (si cal)
  Final: Foto FINAL → Signatura client QR (20s) → Botó FINALITZAR

AUTOMÀTIC (backend):
  Informe PDF + Pre-factura + Alerta estoc + Notificació Telegram
```

### Actors

| Actor | Rol | Dispositiu | Auth |
|-------|-----|------------|------|
| **Empresari** | Crea feines, controla, factura | Web admin (mòbil/desktop) | Email + contrasenya |
| **Operari** | Executa feines, reporta | PWA (mòbil) | PIN 4 dígits + telèfon |
| **Client** | Rep notificacions, signa, aprova | Telegram (no app) | N/A (rebre missatges) |

---

## 2. ARQUITECTURA DE DADES

### 2.1 Taules (16 taules)

#### Taula: `empreses`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `nom` | VARCHAR(200) | NO | — | Nom empresa |
| `nif` | VARCHAR(20) | NO | — | NIF/CIF |
| `adreca` | TEXT | SÍ | — | Adreça completa |
| `telefon` | VARCHAR(20) | SÍ | — | Telèfon contacte |
| `email` | VARCHAR(200) | SÍ | — | Email empresa |
| `logo_url` | VARCHAR(500) | SÍ | — | Logo per PDFs |
| `config_verifactu` | JSONB | SÍ | {} | Configuració Verifactu |
| `config_memorandum` | JSONB | SÍ | {} | Regles memòndum incidències |
| `config_plantilles` | JSONB | SÍ | {} | Plantilles de comunicació |
| `actiu` | BOOLEAN | NO | true | Soft delete |
| `created_at` | TIMESTAMPTZ | NO | now() | — |
| `updated_at` | TIMESTAMPTZ | NO | now() | — |

**RLS:** Només usuaris amb `empresa_id` = aquesta empresa poden llegir.

---

#### Taula: `usuaris`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK → empreses |
| `tipus` | VARCHAR(20) | NO | — | Enum: 'empresari', 'operari' |
| `nom` | VARCHAR(100) | NO | — | Nom complet |
| `telefon` | VARCHAR(20) | SÍ | — | Per login PIN |
| `email` | VARCHAR(200) | SÍ | — | Per login empresari |
| `pin_hash` | VARCHAR(255) | SÍ | — | Bcrypt del PIN (operaris) |
| `password_hash` | VARCHAR(255) | SÍ | — | Bcrypt contrasenya (empresari) |
| `vehicle_assignat` | VARCHAR(50) | SÍ | — | Matrícula vehicle |
| `rol` | VARCHAR(20) | NO | 'operari' | Enum: 'empresari', 'cap_quadrilla', 'operari' |
| `actiu` | BOOLEAN | NO | true | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

**RLS:** Usuaris veuen només usuaris de la seva empresa.

---

#### Taula: `clients`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK |
| `nom` | VARCHAR(200) | NO | — | Nom complet |
| `telefon` | VARCHAR(20) | NO | — | — |
| `email` | VARCHAR(200) | SÍ | — | — |
| `nif` | VARCHAR(20) | SÍ | — | — |
| `adreca` | TEXT | SÍ | — | Adreça completa |
| `lat` | DECIMAL(10,8) | SÍ | — | Geolocalització |
| `lng` | DECIMAL(11,8) | SÍ | — | Geolocalització |
| `preferencies` | JSONB | SÍ | {} | Horari, accés, gos, etc. |
| `notes` | TEXT | SÍ | — | Notes lliures |
| `percentatge_incidencia_historic` | DECIMAL(5,2) | SÍ | 0 | Calculat per IA |
| `actiu` | BOOLEAN | NO | true | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

**RLS:** Per empresa.

---

#### Taula: `equipament_instal.lat`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `client_id` | UUID | NO | — | FK → clients |
| `empresa_id` | UUID | NO | — | FK |
| `nom` | VARCHAR(200) | NO | — | Descripció equipament |
| `tipus` | VARCHAR(50) | NO | — | 'reg', 'electric', 'estructura', etc. |
| `marca` | VARCHAR(100) | SÍ | — | — |
| `model` | VARCHAR(100) | SÍ | — | — |
| `data_instal.lacio` | DATE | SÍ | — | — |
| `garantia_anys` | INTEGER | SÍ | — | — |
| `data_ultima_revisio` | DATE | SÍ | — | — |
| `notes` | TEXT | SÍ | — | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `magatzem`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK |
| `codi` | VARCHAR(50) | NO | — | Codi intern (pot ser codi de barres) |
| `nom` | VARCHAR(200) | NO | — | Nom del material |
| `descripcio` | TEXT | SÍ | — | — |
| `categoria` | VARCHAR(50) | SÍ | — | 'tub', 'valvula', 'eina', etc. |
| `unitat` | VARCHAR(20) | NO | 'unitat' | 'metres', 'unitats', 'kg', etc. |
| `quantitat` | DECIMAL(10,2) | NO | 0 | Stock actual |
| `quantitat_minima` | DECIMAL(10,2) | NO | 0 | Alerta sota mínim |
| `ubicacio` | VARCHAR(50) | SÍ | — | 'Prestatge A3', 'Vehicle Q-123' |
| `estat` | VARCHAR(20) | NO | 'disponible' | Enum: 'disponible', 'reservat', 'en_transit' |
| `preu_unitari` | DECIMAL(10,2) | SÍ | — | Preu de cost mitjà |
| `proveidor_habitual` | VARCHAR(100) | SÍ | — | — |
| `actiu` | BOOLEAN | NO | true | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `moviments_magatzem`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK |
| `material_id` | UUID | NO | — | FK → magatzem |
| `feina_id` | UUID | SÍ | — | FK → feines (si aplica) |
| `tipus` | VARCHAR(20) | NO | — | Enum: 'entrada', 'sortida', 'ajust' |
| `quantitat` | DECIMAL(10,2) | NO | — | Positiu entrada, negatiu sortida |
| `motiu` | TEXT | SÍ | — | — |
| `origen` | VARCHAR(50) | SÍ | — | 'magatzem', 'vehicle', 'compra' |
| `usuari_id` | UUID | NO | — | Qui ho va fer |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `feines`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK |
| `client_id` | UUID | NO | — | FK |
| `codi` | VARCHAR(20) | NO | — | Codi legible (F-2026-0034) |
| `titol` | VARCHAR(200) | NO | — | — |
| `descripcio` | TEXT | SÍ | — | — |
| `tipus` | VARCHAR(50) | NO | — | 'jardineria', 'muntatge', 'manteniment' |
| `estat` | VARCHAR(20) | NO | 'pendent' | Enum: 'pendent', 'assignada', 'en_curs', 'pausada', 'finalitzada', 'cancel.lada' |
| `prioritat` | INTEGER | NO | 2 | 1=urgent, 2=normal, 3=baixa |
| `lat` | DECIMAL(10,8) | SÍ | — | — |
| `lng` | DECIMAL(11,8) | SÍ | — | — |
| `adreca` | TEXT | SÍ | — | Adreça completa del lloc |
| `data_programada` | DATE | NO | — | — |
| `hora_inici_prevista` | TIME | SÍ | — | — |
| `hora_fi_prevista` | TIME | SÍ | — | — |
| `hores_estimades` | DECIMAL(4,1) | SÍ | — | — |
| `hores_reals` | DECIMAL(4,1) | SÍ | 0 | Calculat |
| `percentatge_incidencia_estimat` | DECIMAL(5,2) | SÍ | 0 | Editable per empresari |
| `material_assignat` | JSONB | SÍ | [] | Llista de {material_id, quantitat, origen} |
| `material_consumit` | JSONB | SÍ | [] | Llista de {material_id, quantitat} |
| `vehicle_assignat` | VARCHAR(50) | SÍ | — | — |
| `km_sortida` | DECIMAL(10,2) | SÍ | — | — |
| `km_arribada` | DECIMAL(10,2) | SÍ | — | — |
| `maquinaria_pesada` | BOOLEAN | NO | false | — |
| `hores_maquinaria` | DECIMAL(4,1) | SÍ | 0 | — |
| `plano_url` | VARCHAR(500) | SÍ | — | URL del plànol |
| `plano_descripcio_ia` | TEXT | SÍ | — | Descripció IA del plànol |
| `area_m2` | DECIMAL(10,2) | SÍ | — | Àrea calculada |
| `resultat` | TEXT | SÍ | — | Descripció del resultat |
| `observacions` | TEXT | SÍ | — | — |
| `valoracio_client` | INTEGER | SÍ | — | 1-5 estrelles |
| `actiu` | BOOLEAN | NO | true | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |
| `updated_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `assignacions`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `feina_id` | UUID | NO | — | FK |
| `usuari_id` | UUID | NO | — | FK → usuaris |
| `rol_a_la_feina` | VARCHAR(20) | NO | 'operari' | 'cap', 'operari' |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `actuacions`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `feina_id` | UUID | NO | — | FK |
| `usuari_id` | UUID | NO | — | FK |
| `tipus` | VARCHAR(20) | NO | — | Enum: 'inici', 'pausa', 'continuacio', 'finalitzacio' |
| `lat` | DECIMAL(10,8) | SÍ | — | GPS |
| `lng` | DECIMAL(11,8) | SÍ | — | GPS |
| `precisio_gps` | DECIMAL(6,1) | SÍ | — | Metres |
| `timestamp` | TIMESTAMPTZ | NO | now() | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `fotos`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `feina_id` | UUID | NO | — | FK |
| `usuari_id` | UUID | NO | — | FK |
| `url` | VARCHAR(500) | NO | — | URL Supabase Storage |
| `tipus` | VARCHAR(20) | NO | — | Enum: 'inicial', 'durant', 'final', 'incidencia', 'tiquet', 'plano' |
| `lat` | DECIMAL(10,8) | SÍ | — | — |
| `lng` | DECIMAL(11,8) | SÍ | — | — |
| `descripcio` | TEXT | SÍ | — | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `incidencies`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK |
| `feina_id` | UUID | NO | — | FK |
| `usuari_id` | UUID | NO | — | FK (qui la reporta) |
| `codi` | VARCHAR(20) | NO | — | INC-2026-0042 |
| `tipus` | VARCHAR(30) | NO | — | Enum: 'material_insuficient', 'client_absent', 'avaria', 'treball_extra', 'condicions_meteo', 'seguretat' |
| `gravetat` | VARCHAR(20) | NO | 'baixa' | Enum: 'baixa', 'mitjana', 'alta', 'critica' |
| `descripcio` | TEXT | SÍ | — | — |
| `descripcio_ia` | TEXT | SÍ | — | Resum IA de foto+veu |
| `foto_url` | VARCHAR(500) | SÍ | — | — |
| `audio_url` | VARCHAR(500) | SÍ | — | — |
| `cost_estimat` | DECIMAL(10,2) | SÍ | 0 | — |
| `estat` | VARCHAR(20) | NO | 'oberta' | Enum: 'oberta', 'en_revisio', 'auto_aprovada', 'escalada', 'resolta', 'cancel.lada' |
| `decisio` | VARCHAR(20) | SÍ | — | 'continuar', 'aturar', 'pressupost', 'escalar' |
| `decisio_memorandum` | BOOLEAN | NO | false | Si la va prendre el memòndum |
| `pressupost_addicional_id` | UUID | SÍ | — | FK |
| `resolucio` | TEXT | SÍ | — | — |
| `timestamp` | TIMESTAMPTZ | NO | now() | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `pressupostos_addicionals`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK |
| `feina_id` | UUID | NO | — | FK |
| `incidencia_id` | UUID | SÍ | — | FK |
| `codi` | VARCHAR(20) | NO | — | PA-2026-0012 |
| `concepte` | TEXT | NO | — | — |
| `desglossament` | JSONB | NO | [] | Llista de {concepte, quantitat, preu_unitari, total} |
| `total` | DECIMAL(10,2) | NO | 0 | — |
| `estat` | VARCHAR(20) | NO | 'pendent' | Enum: 'pendent', 'enviat_client', 'aprovat', 'rebutjat', 'caducat' |
| `data_enviat` | TIMESTAMPTZ | SÍ | — | — |
| `data_resposta` | TIMESTAMPTZ | SÍ | — | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `signatures`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `feina_id` | UUID | NO | — | FK |
| `tipus` | VARCHAR(20) | NO | 'client' | 'client', 'aparellador' |
| `nom_signant` | VARCHAR(200) | NO | — | — |
| `dni` | VARCHAR(20) | SÍ | — | — |
| `svg_data` | TEXT | NO | — | Traç SVG de la signatura |
| `ip` | VARCHAR(45) | SÍ | — | IP del dispositiu |
| `timestamp` | TIMESTAMPTZ | NO | now() | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `prefactures`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK |
| `feina_id` | UUID | NO | — | FK |
| `codi` | VARCHAR(20) | NO | — | PF-2026-0034 |
| `client_id` | UUID | NO | — | FK |
| `data` | DATE | NO | — | — |
| `concepte` | TEXT | NO | — | — |
| `material` | DECIMAL(10,2) | NO | 0 | — |
| `hores` | DECIMAL(10,2) | NO | 0 | — |
| `hores_maquinaria` | DECIMAL(10,2) | NO | 0 | — |
| `km` | DECIMAL(10,2) | NO | 0 | — |
| `extra` | DECIMAL(10,2) | NO | 0 | Incidències aprovades |
| `descompte` | DECIMAL(10,2) | NO | 0 | — |
| `base_imposable` | DECIMAL(10,2) | NO | 0 | Calculat |
| `iva_percentatge` | DECIMAL(5,2) | NO | 21 | — |
| `iva` | DECIMAL(10,2) | NO | 0 | Calculat |
| `total` | DECIMAL(10,2) | NO | 0 | Calculat |
| `verifactu_json` | JSONB | SÍ | — | JSON preparat |
| `verifactu_enviat` | BOOLEAN | NO | false | — |
| `estat` | VARCHAR(20) | NO | 'borrador' | Enum: 'borrador', 'enviada', 'pagada' |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `plantilles_material`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK |
| `tipus_feina` | VARCHAR(50) | NO | — | 'instal.lacio_reg', 'manteniment', etc. |
| `area_m2_min` | DECIMAL(10,2) | SÍ | — | Rang d'àrea |
| `area_m2_max` | DECIMAL(10,2) | SÍ | — | Rang d'àrea |
| `material_sugerit` | JSONB | NO | [] | Llista de {material_id, quantitat_per_m2, unitat} |
| `hores_per_m2` | DECIMAL(6,2) | SÍ | — | — |
| `percentatge_incidencia` | DECIMAL(5,2) | SÍ | 0 | — |
| `generat_per_ia` | BOOLEAN | NO | false | — |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `notificacions`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK |
| `destinatari_tipus` | VARCHAR(20) | NO | — | 'operari', 'empresari', 'client' |
| `destinatari_id` | UUID | SÍ | — | FK usuari o null per client |
| `destinatari_telefon` | VARCHAR(20) | SÍ | — | Per a clients |
| `tipus` | VARCHAR(30) | NO | — | 'confirmacio', 'arribada', 'incidencia', 'finalitzacio', 'pressupost' |
| `missatge` | TEXT | NO | — | — |
| `canal` | VARCHAR(20) | NO | 'telegram' | 'telegram', 'email' |
| `estat` | VARCHAR(20) | NO | 'pendent' | 'pendent', 'enviada', 'entregada', 'fallida' |
| `error` | TEXT | SÍ | — | Si falla |
| `created_at` | TIMESTAMPTZ | NO | now() | — |

---

#### Taula: `auditoria`

| Camp | Tipus | Nullable | Default | Descripció |
|------|-------|----------|---------|------------|
| `id` | UUID | NO | gen_random_uuid() | PK |
| `empresa_id` | UUID | NO | — | FK |
| `taula` | VARCHAR(50) | NO | — | Quina taula |
| `registre_id` | UUID | NO | — | Quin registre |
| `accio` | VARCHAR(20) | NO | — | 'INSERT', 'UPDATE', 'DELETE' |
| `usuari_id` | UUID | SÍ | — | Qui ho va fer |
| `dades_anteriors` | JSONB | SÍ | — | — |
| `dades_noves` | JSONB | SÍ | — | — |
| `timestamp` | TIMESTAMPTZ | NO | now() | — |

---

### 2.2 RLS Policies (per a TOTES les taules)

**Patró estàndard per a cada taula:**

```sql
-- Enable RLS
ALTER TABLE [taula] ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their company's data
CREATE POLICY "[taula]_empresa_isolation" ON [taula]
  FOR ALL
  USING (empresa_id IN (
    SELECT empresa_id FROM usuaris WHERE id = auth.uid()
  ));

-- Policy: allow insert/update/delete for authenticated users of the company
CREATE POLICY "[taula]_empresa_write" ON [taula]
  FOR ALL
  USING (empresa_id IN (
    SELECT empresa_id FROM usuaris WHERE id = auth.uid()
  ))
  WITH CHECK (empresa_id IN (
    SELECT empresa_id FROM usuaris WHERE id = auth.uid()
  ));
```

**Excepcions:**
- `empreses`: només el propi registre visible.
- `usuaris`: visibles dins la mateixa empresa, però només l'empresari pot modificar.
- `auditoria`: només empresari pot llegir.

---

### 2.3 Functions i Triggers

```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per a feines
CREATE TRIGGER update_feines_updated_at BEFORE UPDATE ON feines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generar codi de feina automàtic
CREATE OR REPLACE FUNCTION generar_codi_feina()
RETURNS TRIGGER AS $$
DECLARE
    any_actual TEXT;
    numero_sequencial INTEGER;
    nou_codi TEXT;
BEGIN
    any_actual := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;

    SELECT COALESCE(MAX(NULLIF(regexp_replace(codi, 'F-' || any_actual || '-', '', 'g'), '')), '0')::INTEGER
    INTO numero_sequencial
    FROM feines
    WHERE codi LIKE 'F-' || any_actual || '-%'
    AND empresa_id = NEW.empresa_id;

    nou_codi := 'F-' || any_actual || '-' || LPAD((numero_sequencial + 1)::TEXT, 4, '0');
    NEW.codi := nou_codi;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generar_codi_feina BEFORE INSERT ON feines
  FOR EACH ROW EXECUTE FUNCTION generar_codi_feina();

-- Generar codi d'incidència
CREATE OR REPLACE FUNCTION generar_codi_incidencia()
RETURNS TRIGGER AS $$
DECLARE
    any_actual TEXT;
    numero_sequencial INTEGER;
    nou_codi TEXT;
BEGIN
    any_actual := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;

    SELECT COALESCE(MAX(NULLIF(regexp_replace(codi, 'INC-' || any_actual || '-', '', 'g'), '')), '0')::INTEGER
    INTO numero_sequencial
    FROM incidencies
    WHERE codi LIKE 'INC-' || any_actual || '-%'
    AND empresa_id = NEW.empresa_id;

    nou_codi := 'INC-' || any_actual || '-' || LPAD((numero_sequencial + 1)::TEXT, 4, '0');
    NEW.codi := nou_codi;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generar_codi_incidencia BEFORE INSERT ON incidencies
  FOR EACH ROW EXECUTE FUNCTION generar_codi_incidencia();

-- Audit trigger (generico)
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO auditoria (empresa_id, taula, registre_id, accio, dades_anteriors)
        VALUES (OLD.empresa_id, TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO auditoria (empresa_id, taula, registre_id, accio, usuari_id, dades_anteriors, dades_noves)
        VALUES (NEW.empresa_id, TG_TABLE_NAME, NEW.id, 'UPDATE', auth.uid(), row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO auditoria (empresa_id, taula, registre_id, accio, usuari_id, dades_noves)
        VALUES (NEW.empresa_id, TG_TABLE_NAME, NEW.id, 'INSERT', auth.uid(), row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar audit a taules crítiques
CREATE TRIGGER audit_feines AFTER INSERT OR UPDATE OR DELETE ON feines
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_incidencies AFTER INSERT OR UPDATE OR DELETE ON incidencies
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_moviments_magatzem AFTER INSERT OR UPDATE OR DELETE ON moviments_magatzem
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

---

## 3. NIVELLS DE DESENVOLUPAMENT

### NIVELL 0: FUNDACIÓ — Setup i Estructura Base

**Objectiu:** Tenir el projecte creat, DB operativa, autenticació bàsica, i seed data.

**Entregables:**
- [ ] Repositori Git amb estructura de directoris
- [ ] Supabase projecte creat amb 16 taules + RLS + triggers
- [ ] Seed data: 1 empresa, 1 empresari, 2 operaris, 2 clients, 5 materials
- [ ] FastAPI base amb health check
- [ ] Next.js base amb Tailwind
- [ ] aiogram base amb /start
- [ ] `.env.example` complet
- [ ] `docker-compose.yml` per desenvolupament local

**Criteris d'acceptació:**
- `docker-compose up` aixeca backend + db
- `pytest` passa (encara que siguin tests buits)
- `supabase db reset` crea taules i seed
- PWA mostra "Hola CampoPro" a localhost:3000

---

### NIVELL 1: AUTH + USUARIS — Login Dual

**Objectiu:** Dos sistemes d'autenticació diferenciats: PIN ràpid per operaris, email segur per empresari.

**Entregables:**
- [ ] Auth PIN (operari): POST `/api/auth/login-pin` → telefon + PIN → JWT
- [ ] Auth email (empresari): POST `/api/auth/login-email` → email + password → JWT
- [ ] Refresh token per a tots dos
- [ ] Middleware FastAPI: validar JWT, extreure usuari, comprovar empresa
- [ ] PWA: pantalla login PIN (teclat gran, 4 dígits)
- [ ] Admin web: pantalla login email
- [ ] Taula `usuaris` amb camps vehicle, km, maquinaria

**Criteris d'acceptació:**
- Operari pot fer login amb PIN en < 5 segons
- Empresari pot fer login amb email
- JWT inclou `empresa_id`, `usuari_id`, `rol`
- RLS funciona: operari A no veu dades de l'empresa B

---

### NIVELL 2: CLIENTS + CRM — El Centre

**Objectiu:** Gestió completa de clients amb historial, equipament i preferències.

**Entregables:**
- [ ] CRUD clients (API + admin web)
- [ ] Taula `equipament_instal.lat` vinculada a client
- [ ] Pantalla client admin: veure totes les feines, qui les va fer, fotos
- [ ] Preferències JSONB editable (horari, accés, gos, al·lèrgies)
- [ ] Geocodificació adreça → lat/lng (Nominatim)
- [ ] API: historial complet per client

**Criteris d'acceptació:**
- Crear client amb adreça → sistema guarda lat/lng
- Veure client → veure totes les feines amb nom de l'operari
- Veure equipament instal·lat amb dates de garantia

---

### NIVELL 3: MAGATZEM + OCR — Stock Intel·ligent

**Objectiu:** Control de stock amb tres vies (codi de barres, foto tiquet, manual) i traçabilitat total.

**Entregables:**
- [ ] Dashboard magatzem (admin web): stock actual, alertes, moviments
- [ ] Entrada material: foto tiquet → OCR via OpenRouter → interpretació IA → confirmació
- [ ] Sortida material: automàtica quan operari consumeix a la feina
- [ ] Moviments traçabilitat: qui, quan, què, per quina feina
- [ ] Alertes sota mínim
- [ ] Comanda just-in-time: suggerir compra quan falta per a feina programada

**Criteris d'acceptació:**
- Foto de tiquet → OCR extreu productes en < 10 segons
- Stock s'actualitza automàticament
- Alerta quan material < mínim

---

### NIVELL 4: FEINES + CREACIÓ — El Nucli

**Objectiu:** Crear feines amb suggeriments IA, assignar-les, i preparar tot el material.

**Entregables:**
- [ ] Pantalla crear feina (admin): formulari amb tots els camps
- [ ] Suggeriments IA en temps real al crear:
  - Material segons tipus + àrea
  - Hores estimades segons historial
  - Percentatge incidència segons client + tipus
- [ ] Plantilles material (taules `plantilles_material` generades per IA batch)
- [ ] Assignació operari + vehicle
- [ ] Material necessari: del magatzem (reserva) o compra (comanda)
- [ ] Lectura planos: pujar PDF/JPG → visualitzar → IA descriu → material suggerit
- [ ] Camps vehicle: `vehicle_assignat`, `km_sortida`, `km_arribada`, `maquinaria_pesada`, `hores_maquinaria`

**Criteris d'acceptació:**
- Crear feina tipus "instal·lació reg 200m²" → sistema suggereix material i hores
- Assignar operari → rep notificació Telegram
- Pujar plànol → IA descriu contingut

---

### NIVELL 5: OPERARI + PWA — Execució al Camp

**Objectiu:** L'operari executa la feina amb mínima fricció, tot offline-first.

**Entregables:**
- [ ] PWA: pantalla "Feines avui" ordenades per proximitat geogràfica
- [ ] Botons grans: INICIAR, PAUSAR, CONTINUAR, FINALITZAR
- [ ] Foto abans/despres: càmera nativa + overlay geoloc + timestamp
- [ ] Material consumit: +1/-1, escaneig codi de barres (html5-qrcode) o selecció manual
- [ ] Incidència: selector tipus (6 opcions amb icones) + foto + gravació veu 30s
- [ ] Signatura client: canvas per dit + QR per a client (si prefereix signar al seu mòbil)
- [ ] Offline: IndexedDB per a dades, cua de sync, fotos en espera
- [ ] Sync automàtic quan recupera connexió

**Criteris d'acceptació:**
- Operari inicia feina en < 10 segons
- Foto amb geoloc automàtica
- Funciona sense connexió, sync quan torna

---

### NIVELL 6: INCIDÈNCIES + MEMÒNDUM — Decisions Automàtiques

**Objectiu:** Quan hi ha un problema, el sistema decideix ràpid segons regles predefinides.

**Entregables:**
- [ ] Crear incidència (API + PWA): tipus, foto, veu, gravetat
- [ ] IA analitza: resum de foto+veu, cost estimat, gravetat suggerida
- [ ] Motor memòndum JSON configurable per empresa:
  - `material_insuficient < 100€` → auto-aprovar
  - `treball_extra > 0€` → generar pressupost → enviar client
  - `seguretat` → aturar tot + alerta
- [ ] Notificacions Telegram segons decisió:
  - Operari: "Continua" / "Espera" / "Atura"
  - Empresari: resum + botons APROVAR/REBUTJAR (si escalat)
- [ ] Pressupost addicional: generar PDF → enviar client → esperar aprovació
- [ ] Client rep pressupost per Telegram amb botons APROVAR/REBUTJAR

**Criteris d'acceptació:**
- Incidència material < 100€ → aprovada en < 5 segons
- Incidència treball extra → pressupost generat i enviat en < 2 minuts
- Client pot aprovar/rebutjar des de Telegram

---

### NIVELL 7: BOT TELEGRAM CLIENT — Canal de Comunicació

**Objectiu:** El client interactua per Telegram, sense instal·lar res.

**Entregables:**
- [ ] Bot aiogram 3.x amb webhook
- [ ] Comandes: `/start`, `/horari`, `/qui`, `/fotos`, `/problema`, `/contactar`
- [ ] Botons inline: [📅 Horari] [📸 Fotos] [⚠️ Problema] [📞 Contactar]
- [ ] FAQ tancada (respostes predefinides):
  - "Quan arriben?" → "Entre {hora_inici} i {hora_fi}"
  - "Qui ve?" → "{nom_operari} i {nom_operari2}"
  - "Fins quan estaran?" → "Aproximadament {hora_fi_estimada}"
- [ ] Notificacions automàtiques:
  - 24h abans: confirmació visita
  - Arribada operari: "Hem arribat, iniciem la feina"
  - Incidència: "Hem detectat X, us enviem pressupost"
  - Finalització: "Feina completada, veure resultats: {link}"
- [ ] Reenviament a empresari: si el client escriu algo no previst → forward a Telegram intern
- [ ] Plantilles editables (Jinja2) per a cada tipus de missatge

**Criteris d'acceptació:**
- Client rep notificació en temps real
- Pot fer preguntes bàsiques sense esperar
- Fallback a contacte humà si no entén

---

### NIVELL 8: FINANCES + VERIFACTU — Facturació

**Objectiu:** Generar pre-factures automàtiques amb Verifactu preparat.

**Entregables:**
- [ ] Pre-factura automàtica quan feina finalitza:
  - Material consumit (cost)
  - Hores reals x tarifa
  - Hores maquinaria x tarifa
  - Km recorreguts x preu/km
  - Extras (incidències aprovades)
  - Descompte (si aplica)
  - IVA 21%
- [ ] PDF informe de feina (ReportLab):
  - Capçalera empresa (nom, NIF, adreça)
  - Dades client (nom, NIF, adreça)
  - Descripció feina
  - Fotos abans/despres
  - Actuacions (inici, pausa, final)
  - Material consumit
  - Signatura client
- [ ] Verifactu:
  - Generar JSON intern amb estructura correcta
  - Botó "Exportar Verifactu" (manual)
  - Guardar QR oficial quan es rebi
- [ ] Dashboard rendibilitat per feina: hores reals vs estimades, marge

**Criteris d'acceptació:**
- Pre-factura generada automàticament en < 30 segons després de finalitzar
- PDF amb totes les dades i fotos
- JSON Verifactu validable

---

### NIVELL 9: IA BATCH NOCTURN — Aprenentatge

**Objectiu:** El sistema aprèn de cada feina i suggereix millores.

**Entregables:**
- [ ] Edge Function `batch-ia` executada cada nit (pg_cron)
- [ ] Analitza feines finalitzades del dia anterior
- [ ] Per a cada tipus de feina:
  - Material consumit mitjà
  - Hores reals mitjanes
  - Incidències freqüents
- [ ] Actualitzar/crear `plantilles_material`
- [ ] Generar suggeriments per a feines futures

**Suggeriments:**
- Operatius: guardar a feines.suggeriments_operatius (JSONB)
- Executius: guardar a taula suggeriments_executius

**Criteris d'acceptació:**
- Batch executa sense errors cada nit
- Plantilles actualitzades
- Suggeriments visibles al crear nova feina

---

### NIVELL 10: POLISH + DEPLOY — Producció

**Objectiu:** Llest per a 6 treballadors reals.

**Entregables:**
- [ ] Tests d'integració complets (pytest)
- [ ] PWA: Lighthouse score > 80 (performance, accessibility, PWA)
- [ ] Prova amb 6 treballadors durant 1 setmana
- [ ] Documentació d'usuari (com usar la PWA, com crear feina)
- [ ] Monitoratge bàsic (logs, errors)
- [ ] Backup automàtic (Supabase snapshots)
- [ ] Guia de desplegament (Vercel + Supabase)

**Criteris d'acceptació:**
- 6 treballadors usen la app durant 5 dies
- 0 bloquejos crítics
- Temps mitjà reportar feina: < 30 segons

---

## 4. PROMPTS PAS A PAS PER NIVELL

### PROMPT N0.1: Setup Estructura Directoris

```
Crea l'estructura de directoris completa del projecte CampoPro segons
l'arquitectura definida a SISTEMA_PROMPT_MESTRE.md.

Requisits:
- Tots els fitxers __init__.py buits on calguin
- Fitxers base: README.md, .env.example, docker-compose.yml
- Fitxers de configuració: backend/requirements.txt, pwa/package.json, bot/requirements.txt
- Fitxers template per a skills: backend/app/api/_template_crud.py, supabase/migrations/_template_rls.sql
- No implementis lògica encara, només estructura

Validació:
- tree campopro/ mostra tots els directoris
- No hi ha fitxers .gitkeep innecessaris
```

### PROMPT N0.2: Migracions SQL Inicials

```
Crea les 16 migracions SQL per a Supabase seguint l'esquema detallat
a PLA_MESTRE.md secció 2.1.

Requisits:
- Ordre correcte de creació (taules base primer, FK després)
- Totes les taules amb ENABLE ROW LEVEL SECURITY
- Policies RLS per a cada taula segons patró estàndard
- Triggers per a: updated_at, codi auto (feines, incidencies), auditoria
- Índexos GIN per a camps JSONB, índexos geogràfics per a lat/lng
- Extensions necessàries: postgis (si cal), pg_trgm (full-text)

Validació:
- psql -f migrations/001_create_empreses.sql funciona
- Totes les FK apunten a taules existents
- No hi ha errors de sintaxi
```

### PROMPT N0.3: Seed Data

```
Crea seed.sql amb dades de prova per a desenvolupament:

- 1 empresa: "Jardineria Garcia SL", NIF B12345678
- 1 empresari: Maria Garcia, email maria@exemple.com
- 2 operaris: Joan (PIN 1234), Pere (PIN 5678)
- 2 clients: Client A (Barcelona), Client B (Sabadell)
- 5 materials: Tub PVC 25mm, Vàlvula 1", Programador, Sonda, Adob
- 1 feina de prova assignada a Joan
- Configuració memòndum bàsica

Validació:
- supabase db reset → seed aplicat correctament
- Es poden fer queries SELECT a totes les taules
```

### PROMPT N0.4: FastAPI Base

```
Implementa el backend FastAPI base amb:

- main.py amb FastAPI instance, CORS, health check /salut
- config.py amb Pydantic Settings (carrega de .env)
- core/supabase_client.py amb client Supabase async
- core/exceptions.py amb excepcions custom (NotFound, Forbidden, etc.)
- dependencies.py amb Depends per a: get_current_user, require_empresari, require_operari
- api/salut.py amb endpoint GET /api/salut

Validació:
- uvicorn app.main:app --reload funciona
- GET /api/salut retorna {"estat": "ok"}
- pytest tests/test_salut.py passa
```

### PROMPT N0.5: Next.js Base

```
Implementa el projecte Next.js 14 base amb:

- next.config.js amb output: 'standalone'
- tailwind.config.ts amb colors custom (verd corporatiu)
- app/layout.tsx amb providers (Supabase, geolocation)
- app/page.tsx amb landing simple "CampoPro - Carregant..."
- middleware.ts buit (preparat per a auth routing)
- lib/supabase.ts amb client Supabase (browser + server)
- globals.css amb Tailwind

Validació:
- npm run dev funciona a localhost:3000
- Mostra "CampoPro" a la pantalla
```

### PROMPT N0.6: aiogram Base

```
Implementa el bot Telegram base amb aiogram 3.x:

- config.py amb token i settings
- handlers/comandes.py amb /start i /ajuda
- keyboards/inline.py amb teclat bàsic
- main.py amb polling (development) o webhook (production)
- Dockerfile per al bot

Validació:
- python bot/main.py funciona en mode polling
- /start respon amb missatge de benvinguda
```

### PROMPT N1.1: Auth PIN (Operari)

```
Implementa l'autenticació per PIN per a operaris:

Backend:
- POST /api/auth/login-pin {telefon, pin} → valida contra usuaris.pin_hash → retorna JWT
- POST /api/auth/refresh-pin {refresh_token} → nou JWT
- PIN: 4 dígits, hash amb bcrypt

PWA:
- Pantalla /(operari)/login amb teclat numèric gran (botons 0-9)
- Input màscara (****)
- Submit → crida API → guarda JWT a localStorage
- Redirect a /(operari)/feines

Validació:
- Operari pot fer login amb PIN 1234
- JWT inclou empresa_id, usuari_id, rol
- Token refresh funciona
```

### PROMPT N1.2: Auth Email (Empresari)

```
Implementa l'autenticació per email per a empresari:

Backend:
- POST /api/auth/login-email {email, password} → valida → JWT
- POST /api/auth/refresh-email {refresh_token} → nou JWT
- Password: bcrypt, mínim 8 caràcters

Admin:
- Pantalla /(admin)/login amb formulari email + password
- Submit → crida API → guarda JWT a cookie (httpOnly)
- Redirect a /(admin)/dashboard

Validació:
- Empresari pot fer login
- No pot fer login amb credencials d'operari
- RLS funciona per a tots dos tipus
```

### PROMPT N2.1: CRUD Clients

```
Implementa el CRM de clients:

Backend:
- GET /api/clients → llista amb paginació, filtres (nom, telefon)
- GET /api/clients/{id} → detall complet + equipament + historial feines
- POST /api/clients → crear nou client
- PATCH /api/clients/{id} → actualitzar
- DELETE /api/clients/{id} → soft delete
- Geocodificació: adreça → lat/lng via Nominatim (OpenStreetMap)

Models Pydantic:
- ClientCreate, ClientUpdate, ClientResponse (amb historial)

Admin:
- Pantalla /(admin)/clients: taula amb filtres
- Pantalla /(admin)/clients/[id]: detall, pestanyes (dades, equipament, historial)
- Formulari crear/editar amb mapa OSM

Validació:
- Crear client amb adreça → lat/lng guardats
- Veure client → historial de feines amb nom operari
- Soft delete, no hard delete
```

### PROMPT N3.1: Dashboard Magatzem

```
Implementa el dashboard de magatzem:

Backend:
- GET /api/magatzem → llista amb filtres (categoria, ubicacio, estat)
- GET /api/magatzem/{id} → detall + historial moviments
- POST /api/magatzem/moviment → entrada/sortida/ajust
- GET /api/magatzem/alertes → sota mínim

Admin:
- Pantalla /(admin)/magatzem: taula stock, alertes destacades
- Pantalla /(admin)/magatzem/entrada: formulari entrada material
- Moviments: taula amb qui, quan, què, per quina feina

Validació:
- Stock s'actualitza amb cada moviment
- Alerta quan quantitat < quantitat_minima
- Traçabilitat completa
```

### PROMPT N3.2: OCR Tiquets via OpenRouter

```
Implementa el pipeline OCR per a tiquets de compra:

Backend:
- POST /api/magatzem/ocr-tiquet {foto_base64} → crida OpenRouter visió
- Prompt a OpenRouter: "Extreu tots els productes d'aquest tiquet. Per cada producte: nom, quantitat, unitat, preu unitari, preu total. Retorna JSON."
- Resposta: llista de {nom, quantitat, unitat, preu_unitari, preu_total}
- POST /api/magatzem/confirmar-ocr {productes} → crea moviments d'entrada

Service:
- ocr_service.py amb client OpenRouter per a visió
- Gestió d'errors: fallback a "no detectat", manual

Admin:
- Pantalla /(admin)/magatzem/entrada: càmera → OCR → llista editable → confirmar

Validació:
- Foto de tiquet → JSON amb productes en < 10s
- Confirmar → stock actualitzat
- Error si foto no és un tiquet
```

### PROMPT N4.1: Crear Feina amb Suggeriments

```
Implementa la pantalla de creació de feina amb suggeriments IA:

Backend:
- POST /api/feines → crear feina completa
- GET /api/feines/suggeriments?tipus=X&area=Y → retorna material i hores suggerides
- IA: consulta plantilles_material i historial del client

Admin:
- Pantalla /(admin)/feines/nova: formulari pas a pas
  1. Seleccionar client → mostrar preferències + historial
  2. Seleccionar tipus + àrea → sistema suggereix material i hores
  3. Assignar operari + vehicle
  4. Confirmar material: del magatzem o compra
  5. Revisar i crear
- Suggeriments visibles en temps real (loading state)

Validació:
- Crear feina tipus conegut → suggeriments automàtics
- Assignar operari → notificació Telegram
- Material del magatzem es reserva (estat: reservat)
```

### PROMPT N4.2: Lectura de Planos

```
Implementa la lectura de planols:

Backend:
- POST /api/feines/{id}/plano → pujar PDF/JPG a Supabase Storage
- POST /api/feines/{id}/plano/analitzar → crida OpenRouter visió
- Prompt: "Descriu aquest plànol. Quina àrea té? Quins elements detectes? Quin material es necessitaria per a una instal·lació de reg?"
- Guardar descripcio_ia i area_m2

Admin:
- Pantalla crear feina: secció "Plànol" → pujar → preview → descripció IA
- Material suggerit basat en plànol

Validació:
- Pujar plànol → preview visible
- Analitzar → descripció text + material suggerit
```

### PROMPT N5.1: PWA Operari — Feines Avui

```
Implementa la pantalla principal de l'operari:

PWA:
- Pantalla /(operari)/feines: llista de feines del dia
- Ordenades per proximitat geogràfica (Haversine formula)
- Cada tarjeta: client, adreça, hora, tipus, estat
- Botó per iniciar navegació (Google Maps/Waze)
- Offline: dades guardades a IndexedDB

Backend:
- GET /api/operari/feines-avui → feines assignades avui, ordenades per distància
- Lat/lng de l'operari des del client (GPS)

Validació:
- Operari veu feines del dia ordenades per distància
- Funciona offline (dades cachejades)
```

### PROMPT N5.2: PWA Operari — Accions Feina

```
Implementa els botons d'acció de la feina:

PWA:
- Pantalla /(operari)/feines/[id]: detall de la feina
- Botons grans: INICIAR (verd), PAUSAR (groc), CONTINUAR (blau), FINALITZAR (vermell)
- Cada botó: crida API amb geoloc + timestamp
- Seccions: material consumit, incidència, foto, signatura

Backend:
- POST /api/operari/feina/{id}/iniciar → crea actuació 'inici'
- POST /api/operari/feina/{id}/pausar → actuació 'pausa'
- POST /api/operari/feina/{id}/continuar → actuació 'continuacio'
- POST /api/operari/feina/{id}/finalitzar → actuació 'final' + genera pre-factura

Validació:
- Iniciar → geoloc guardada
- Pausar/continuar → temps real calculat
- Finalitzar → pre-factura generada
```

### PROMPT N5.3: PWA Operari — Offline Sync

```
Implementa la sincronització offline:

PWA:
- Service Worker per a cachejar assets
- IndexedDB amb schema: feines, actuacions, fotos_pendents, sync_queue
- Quan online: processa cua sync_queue → crides API batch
- Quan offline: guarda operacions a cua, mostra banner "Mode offline"
- Fotos: guardades localment, pujades en segon pla quan online

Backend:
- POST /api/operari/sync → rep array d'operacions, processa en transacció
- Resposta: quines han fallat, per què

Validació:
- Mode avió → operari pot fer accions
- Recuperar connexió → sync automàtic
- No es perden dades
```

### PROMPT N6.1: Motor Memòndum

```
Implementa el motor de memòndum per a incidències:

Backend:
- Configuració JSON a empreses.config_memorandum:
  {
    "material_insuficient": {"llindar": 100, "accio": "auto_aprovar"},
    "treball_extra": {"llindar": 0, "accio": "generar_pressupost"},
    "seguretat": {"accio": "aturar_tot"}
  }
- POST /api/incidencies → crear incidència
- IA analitza: resum foto+veu, cost estimat, gravetat
- Motor memòndum: llegeix config → decideix → aplica acció
- Accions possibles: auto_aprovar, escalat, generar_pressupost, aturar_tot

Notificacions:
- Telegram a operari segons decisió
- Telegram a empresari si escalat

Validació:
- Incidència material 50€ → auto-aprovada en < 5s
- Incidència seguretat → atura tot + alerta
```

### PROMPT N6.2: Pressupost Addicional

```
Implementa la generació i enviament de pressupostos addicionals:

Backend:
- POST /api/pressupostos → generar pressupost addicional
- Desglossament: concepte, quantitat, preu unitari, total
- PDF del pressupost (ReportLab)
- Enviar per Telegram al client (botó APROVAR/REBUTJAR)
- POST /api/pressupostos/{id}/resposta → client aprova/rebutja

Bot Telegram:
- Missatge amb desglossament i botons inline
- Callback: aprovar → notifica operari "continua"
- Callback: rebutjar → notifica operari "atura"

Validació:
- Generar pressupost → PDF + missatge Telegram
- Client aprova → operari rep notificació
- Client rebutja → feina marcada com a pendent
```

### PROMPT N7.1: Bot Telegram Client — FAQ

```
Implementa el bot de Telegram per a clients:

Bot:
- /start → benvinguda + botons inline [📅 Horari] [📸 Fotos] [⚠️ Problema] [📞 Contactar]
- Callback handlers per a cada botó
- FAQ tancada: respostes predefinides amb variables Jinja2
- Fallback: reenviar a empresari si no és FAQ

Notificacions automàtiques:
- Confirmació 24h abans
- Arribada operari
- Incidència detectada
- Feina finalitzada
- Pressupost addicional

Validació:
- Client rep notificació en temps real
- Pot fer preguntes bàsiques
- Fallback funciona
```

### PROMPT N8.1: Pre-factura i PDF

```
Implementa la generació de pre-factures i PDFs:

Backend:
- Trigger: quan feina passa a 'finalitzada' → genera prefactura
- Càlcul: material + hores + maquinaria + km + extra - descompte
- IVA 21%
- PDF amb ReportLab: capçalera, dades, taula, fotos, signatura
- GET /api/prefactures/{id}/pdf → descarregar

Admin:
- Pantalla /(admin)/finances: llista pre-factures
- Botó descarregar PDF
- Botó "Exportar Verifactu" → JSON

Validació:
- Finalitzar feina → pre-factura generada en < 30s
- PDF amb totes les dades
- JSON Verifactu correcte
```

### PROMPT N9.1: Batch IA Nocturn

```
Implementa el batch nocturn d'IA:

Edge Function (Deno):
- Executar cada nit a les 3:00 (pg_cron)
- Analitzar feines finalitzades del dia anterior
- Per a cada tipus de feina:
  - Material consumit mitjà
  - Hores reals mitjanes
  - Incidències freqüents
- Actualitzar/crear plantilles_material
- Generar suggeriments per a feines futures

Suggeriments:
- Operatius: guardar a feines.suggeriments_operatius (JSONB)
- Executius: guardar a taula suggeriments_executius

Validació:
- Batch executa sense errors
- Plantilles actualitzades
- Suggeriments visibles al crear nova feina
```

---

## 5. VALIDACIÓ I CRITERIS D'ACCEPTACIÓ

### Scripts de Validació

Fitxer: `backend/scripts/validate_api.py`
```python
import httpx
import sys
import asyncio

BASE_URL = "http://localhost:8000"
ENDPOINTS = [
    ("GET", "/api/salut"),
    ("POST", "/api/auth/login-pin"),
    ("POST", "/api/auth/login-email"),
    ("GET", "/api/clients"),
    ("GET", "/api/magatzem"),
    ("GET", "/api/feines"),
    ("GET", "/api/operari/feines-avui"),
    ("GET", "/api/incidencies"),
    ("GET", "/api/prefactures"),
]

async def main():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        for method, path in ENDPOINTS:
            try:
                if method == "GET":
                    r = await client.get(path)
                else:
                    r = await client.post(path, json={})
                status = "OK" if r.status_code < 500 else "FAIL"
                print(f"{status} {method} {path}: {r.status_code}")
            except Exception as e:
                print(f"FAIL {method} {path}: ERROR {e}")
                sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
```

### Checklist per Nivell

Abans de demanar OK per a cada nivell:

- [ ] Tots els fitxers creats segons estructura
- [ ] Codi segueix estàndards (PEP8, TypeScript strict)
- [ ] Tests passen (pytest -v)
- [ ] validate_api.py passa
- [ ] No hi ha secrets hardcodeats
- [ ] Documentació actualitzada (docs/ESTAT.md)
- [ ] Backlog actualitzat (docs/BACKLOG.md)

---

## HISTORIAL DE CANVIS

| Versió | Data | Canvis |
|--------|------|--------|
| 1.0 | 2026-06-16 | Versió inicial completa |
