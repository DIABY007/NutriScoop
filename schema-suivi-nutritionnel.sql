-- ============================================================
-- Migration : Table suivis_nutritionnels
-- Module "Suivi nutritionnel" avancé
-- Stack : Supabase (PostgreSQL)
-- ============================================================

-- ------------------------------------------------------------
-- Table : suivis_nutritionnels
-- Lien vers un participant existant, avec un niveau de suivi
-- et des données d'évaluation / programme nutritionnel.
-- ------------------------------------------------------------
CREATE TABLE suivis_nutritionnels (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id          UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    niveau_suivi            VARCHAR(20) NOT NULL DEFAULT 'ESSENTIELLE'
                            CHECK (niveau_suivi IN ('ESSENTIELLE', 'RENFORCEE', 'INTENSE', 'CLINIQUE')),
    evaluation_nutritionnelle JSONB,
    programme_nutritionnel  TEXT,
    access_token            UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_suivis_nutritionnels_participant ON suivis_nutritionnels (participant_id);
CREATE INDEX idx_suivis_nutritionnels_niveau ON suivis_nutritionnels (niveau_suivi, created_at DESC);
CREATE INDEX idx_suivis_nutritionnels_token ON suivis_nutritionnels (access_token);

-- ------------------------------------------------------------
-- Trigger : mise à jour automatique de updated_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_suivis_nutritionnels_updated_at
    BEFORE UPDATE ON suivis_nutritionnels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------
-- RLS — accès réservé aux utilisateurs authentifiés
-- ------------------------------------------------------------
ALTER TABLE suivis_nutritionnels ENABLE ROW LEVEL SECURITY;

-- Lecture : utilisateur authentifié
CREATE POLICY "allow_select_suivis_nutritionnels"
    ON suivis_nutritionnels
    FOR SELECT
    TO authenticated
    USING (true);

-- Insertion : utilisateur authentifié
CREATE POLICY "allow_insert_suivis_nutritionnels"
    ON suivis_nutritionnels
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Mise à jour : utilisateur authentifié
CREATE POLICY "allow_update_suivis_nutritionnels"
    ON suivis_nutritionnels
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Suppression : utilisateur authentifié
CREATE POLICY "allow_delete_suivis_nutritionnels"
    ON suivis_nutritionnels
    FOR DELETE
    TO authenticated
    USING (true);