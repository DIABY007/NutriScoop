-- ============================================================
-- Fix RLS : passage des policies de authenticated → public
-- Les autres tables du projet utilisent TO public
-- ============================================================

-- Supprimer les anciennes policies (authenticated)
DROP POLICY IF EXISTS "allow_select_suivis_nutritionnels" ON suivis_nutritionnels;
DROP POLICY IF EXISTS "allow_insert_suivis_nutritionnels" ON suivis_nutritionnels;
DROP POLICY IF EXISTS "allow_update_suivis_nutritionnels" ON suivis_nutritionnels;
DROP POLICY IF EXISTS "allow_delete_suivis_nutritionnels" ON suivis_nutritionnels;

-- Créer une policy unique pour le public
CREATE POLICY "allow_all_suivis_nutritionnels"
    ON suivis_nutritionnels
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);