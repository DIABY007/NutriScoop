-- ============================================================
-- Migration Phase 3 : Table evaluations_initiales
-- Stocke les données d'évaluation nutritionnelle détaillée
-- Les champs JSONB évitent de multiplier les colonnes
-- ============================================================

CREATE TABLE evaluations_initiales (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id      UUID NOT NULL UNIQUE REFERENCES participants(id) ON DELETE CASCADE,
    objectifs           TEXT,
    profession          VARCHAR(200),
    historique_poids    JSONB,
    etat_sante          JSONB,
    digestion_habitudes JSONB,
    sommeil_stress      TEXT,
    mensurations        JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_evaluations_participant ON evaluations_initiales (participant_id);

-- RLS
ALTER TABLE evaluations_initiales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_evaluations" ON evaluations_initiales FOR ALL TO public USING (true) WITH CHECK (true);

-- ============================================================
-- Ajout colonnes suivi quotidien : poids + tour de taille
-- ============================================================
ALTER TABLE daily_tracking
    ADD COLUMN poids_du_jour     DECIMAL(5,2) CHECK (poids_du_jour > 0 AND poids_du_jour < 999.99),
    ADD COLUMN tour_taille_du_jour INTEGER  CHECK (tour_taille_du_jour > 0 AND tour_taille_du_jour < 300);