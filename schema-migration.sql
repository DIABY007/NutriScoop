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