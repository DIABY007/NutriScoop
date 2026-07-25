-- ============================================================
-- Schéma de base de données NutriScoop — V1
-- Stack : Supabase (PostgreSQL)
-- ============================================================

-- ------------------------------------------------------------
-- 1. Table : participants
-- Stocke les informations de base de chaque participant au suivi
-- ------------------------------------------------------------
CREATE TABLE participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom             VARCHAR(100)    NOT NULL,
    prenom          VARCHAR(100)    NOT NULL,
    age             INTEGER         NOT NULL CHECK (age > 0 AND age < 150),
    sexe            VARCHAR(10)     NOT NULL CHECK (sexe IN ('homme', 'femme', 'autre')),
    poids_initial   DECIMAL(5,2)    NOT NULL CHECK (poids_initial > 0),
    objectif        TEXT,
    date_debut      DATE            NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Index pour faciliter la recherche par nom
CREATE INDEX idx_participants_nom ON participants (nom, prenom);

-- ------------------------------------------------------------
-- 2. Table : daily_tracking
-- Suivi quotidien : repas, hydratation, sport, sommeil, stress
-- Barèmes : repas /40 · hydratation /20 · sport /40
-- score_total calculé côté serveur (max 100) :
--   Score Nutrition = moyenne des 3 repas (max 40)
--   Score Total     = Nutrition + Hydratation + Sport (max 100)
-- note_sommeil et note_stress sont stockées séparément (/10)
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

    -- Un seul enregistrement par participant et par jour
    UNIQUE (participant_id, date)
);

-- Index pour les requêtes par participant et par date
CREATE INDEX idx_daily_tracking_participant_date
    ON daily_tracking (participant_id, date DESC);

-- Index pour les requêtes agrégées (moyennes, totaux)
CREATE INDEX idx_daily_tracking_date
    ON daily_tracking (date DESC);