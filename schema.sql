-- ============================================================
-- Schéma NutriScoop V2 — Architecture Challenges
-- Stack : Supabase (PostgreSQL)
-- ============================================================

-- ------------------------------------------------------------
-- 1. Table : challenges (cohortes)
-- ------------------------------------------------------------
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

CREATE INDEX idx_challenges_statut ON challenges (statut, created_at DESC);

-- ------------------------------------------------------------
-- 2. Table : participants (liée à un challenge)
-- ------------------------------------------------------------
CREATE TABLE participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id    UUID            NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    nom             VARCHAR(100)    NOT NULL,
    prenom          VARCHAR(100)    NOT NULL,
    age             INTEGER         NOT NULL CHECK (age > 0 AND age < 150),
    sexe            VARCHAR(10)     NOT NULL CHECK (sexe IN ('homme', 'femme', 'autre')),
    poids_initial   DECIMAL(5,2)    NOT NULL CHECK (poids_initial > 0),
    objectif        TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_participants_challenge ON participants (challenge_id, nom, prenom);

-- ------------------------------------------------------------
-- 3. Table : daily_tracking (inchangée, liée à participants)
-- ------------------------------------------------------------
CREATE TABLE daily_tracking (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id      UUID            NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    date                DATE            NOT NULL,
    score_petit_dej     INTEGER         CHECK (score_petit_dej BETWEEN 0 AND 40),
    score_dej           INTEGER         CHECK (score_dej BETWEEN 0 AND 40),
    score_diner         INTEGER         CHECK (score_diner BETWEEN 0 AND 40),
    score_hydratation   INTEGER         CHECK (score_hydratation BETWEEN 0 AND 20),
    score_sport         INTEGER         CHECK (score_sport BETWEEN 0 AND 40),
    note_sommeil        INTEGER         CHECK (note_sommeil BETWEEN 0 AND 10),
    note_stress         INTEGER         CHECK (note_stress BETWEEN 0 AND 10),
    score_total         INTEGER         NOT NULL DEFAULT 0 CHECK (score_total BETWEEN 0 AND 100),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (participant_id, date)
);

CREATE INDEX idx_daily_tracking_participant_date
    ON daily_tracking (participant_id, date DESC);

-- ------------------------------------------------------------
-- Politiques RLS (accès public)
-- ------------------------------------------------------------
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_challenges" ON challenges FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_participants" ON participants FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_daily_tracking" ON daily_tracking FOR ALL TO public USING (true) WITH CHECK (true);