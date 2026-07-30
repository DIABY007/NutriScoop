-- ============================================================
-- Migration V2 : Ajout colonne 'nom' aux suivis_nutritionnels
-- Permet de créer des dossiers nommés (comme les Challenges)
-- ============================================================

ALTER TABLE suivis_nutritionnels
  ADD COLUMN nom VARCHAR(200) NOT NULL DEFAULT '';

-- Index pour le listing et la recherche
CREATE INDEX idx_suivis_nutritionnels_nom ON suivis_nutritionnels (nom, created_at DESC);