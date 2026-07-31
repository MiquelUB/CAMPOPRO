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

CREATE POLICY "notificacions_select_policy" ON notificacions FOR SELECT
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "notificacions_insert_policy" ON notificacions FOR INSERT
WITH CHECK (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "notificacions_update_policy" ON notificacions FOR UPDATE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');

CREATE POLICY "notificacions_delete_policy" ON notificacions FOR DELETE
USING (empresa_id::text = current_setting('app.current_empresa_id', true) OR current_setting('app.is_super_admin', true) = 'true');
