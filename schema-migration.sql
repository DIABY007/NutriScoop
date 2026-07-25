-- ============================================================
-- Migration V1 → V2 : Ajout de la table challenges
-- Exécuter DANS L'ORDRE dans Supabase
-- ============================================================

-- 1. Créer la table challenges
CREATE TABLE challenges (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom             VARCHAR(200)    NOT NULL,
    date_debut      DATE            NOT NULL,
    date_fin        DATE            NOT NULL,
    statut          VARCHAR(10)     NOT NULL DEFAULT 'actif'
                    CHECK (statut IN ('actif', 'termine')),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CHECK (date_fin >= date_debut)
);

-- 2. Ajouter la colonne challenge_id dans participants
ALTER TABLE participants ADD COLUMN challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE;

-- 3. Index
CREATE INDEX idx_challenges_statut ON challenges (statut, created_at DESC);
CREATE INDEX idx_participants_challenge ON participants (challenge_id, nom, prenom);

-- 4. RLS pour challenges
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_challenges" ON challenges FOR ALL TO public USING (true) WITH CHECK (true);

-- 5. Mettre à jour la RLS existante sur participants (si elle existe déjà)
-- Optionnel : supprimer les anciennes politiques et les recréer
DROP POLICY IF EXISTS "allow_insert_participants" ON participants;
DROP POLICY IF EXISTS "allow_select_participants" ON participants;
DROP POLICY IF EXISTS "allow_update_participants" ON participants;
DROP POLICY IF EXISTS "allow_delete_participants" ON participants;
CREATE POLICY "allow_all_participants" ON participants FOR ALL TO public USING (true) WITH CHECK (true);