-- ============================================================
-- Migration : Multi-participants dans les dossiers
-- Permet de lier plusieurs participants à un même dossier
-- de suivi nutritionnel, comme les challenges.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Table de liaison : dossier_participants
-- Chaque participant dans un dossier a son propre access_token
-- pour le portail patient.
-- ------------------------------------------------------------
CREATE TABLE dossier_participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dossier_id      UUID NOT NULL REFERENCES suivis_nutritionnels(id) ON DELETE CASCADE,
    participant_id  UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    access_token    UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (dossier_id, participant_id)
);

CREATE INDEX idx_dossier_participants_dossier      ON dossier_participants (dossier_id);
CREATE INDEX idx_dossier_participants_participant  ON dossier_participants (participant_id);
CREATE INDEX idx_dossier_participants_token        ON dossier_participants (access_token);

-- ------------------------------------------------------------
-- 2. Rendre challenge_id nullable dans participants
-- Un participant peut être créé directement dans un dossier
-- sans appartenir à un challenge.
-- ------------------------------------------------------------
ALTER TABLE participants ALTER COLUMN challenge_id DROP NOT NULL;

-- ------------------------------------------------------------
-- 3. Rendre participant_id nullable dans suivis_nutritionnels
-- Pour backward-compatibilité avec les données existantes
-- (la vraie relation est maintenant dans dossier_participants)
-- ------------------------------------------------------------
ALTER TABLE suivis_nutritionnels ALTER COLUMN participant_id DROP NOT NULL;

-- ------------------------------------------------------------
-- 4. Migrer les données existantes
-- Chaque dossier existant avec un participant_id et access_token
-- est migré vers la table dossier_participants.
-- ------------------------------------------------------------
INSERT INTO dossier_participants (dossier_id, participant_id, access_token)
SELECT id, participant_id, access_token
FROM suivis_nutritionnels
WHERE participant_id IS NOT NULL;

-- ------------------------------------------------------------
-- 5. RLS — accès public (comme les autres tables)
-- ------------------------------------------------------------
ALTER TABLE dossier_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_dossier_participants"
    ON dossier_participants
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- 6. Ajout des colonnes telephone et profession
-- ------------------------------------------------------------
ALTER TABLE participants ADD COLUMN IF NOT EXISTS telephone VARCHAR(20);
ALTER TABLE participants ADD COLUMN IF NOT EXISTS profession VARCHAR(200);

-- ------------------------------------------------------------
-- 7. Rendre sexe et poids_initial optionnels
-- ------------------------------------------------------------
ALTER TABLE participants ALTER COLUMN sexe DROP NOT NULL;
ALTER TABLE participants ALTER COLUMN poids_initial DROP NOT NULL;