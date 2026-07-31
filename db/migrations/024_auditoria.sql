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
