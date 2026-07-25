-- ============================================================
-- Migration NutriScoop — Étape 4
-- Mise à jour des barèmes daily_tracking :
--   repas : 0–40 | hydratation : 0–20 | sport : 0–40
--   score_total calculé côté serveur (max 100)
-- ============================================================

-- 1. Supprimer la colonne générée pour la recréer en colonne standard
ALTER TABLE daily_tracking DROP COLUMN score_total;

-- 2. Modifier les CHECK constraints des scores
ALTER TABLE daily_tracking
    ALTER COLUMN score_petit_dej   TYPE INTEGER,
    ADD CONSTRAINT chk_petit_dej   CHECK (score_petit_dej   BETWEEN 0 AND 40);

ALTER TABLE daily_tracking
    ALTER COLUMN score_dej         TYPE INTEGER,
    ADD CONSTRAINT chk_dej         CHECK (score_dej         BETWEEN 0 AND 40);

ALTER TABLE daily_tracking
    ALTER COLUMN score_diner       TYPE INTEGER,
    ADD CONSTRAINT chk_diner       CHECK (score_diner       BETWEEN 0 AND 40);

ALTER TABLE daily_tracking
    ALTER COLUMN score_hydratation TYPE INTEGER,
    ADD CONSTRAINT chk_hydratation CHECK (score_hydratation BETWEEN 0 AND 20);

ALTER TABLE daily_tracking
    ALTER COLUMN score_sport       TYPE INTEGER,
    ADD CONSTRAINT chk_sport       CHECK (score_sport       BETWEEN 0 AND 40);

-- 3. Ajouter score_total comme colonne standard (calculé côté serveur)
ALTER TABLE daily_tracking
    ADD COLUMN score_total INTEGER NOT NULL DEFAULT 0
    CHECK (score_total BETWEEN 0 AND 100);

-- Note : les contraintes CHECK existantes pour note_sommeil et note_stress
-- (0–10) restent inchangées.