-- ============================================================
-- Politiques RLS — NutriScoop V1
-- Application sans authentification : accès public en lecture/écriture
-- ============================================================

-- ------------------------------------------------------------
-- 1. Table : participants
-- ------------------------------------------------------------
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Permettre l'insertion depuis l'application (Server Action)
CREATE POLICY "allow_insert_participants"
    ON participants
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Permettre la lecture depuis l'application (Server Components)
CREATE POLICY "allow_select_participants"
    ON participants
    FOR SELECT
    TO public
    USING (true);

-- Permettre la mise à jour (pour plus tard)
CREATE POLICY "allow_update_participants"
    ON participants
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Permettre la suppression (pour plus tard)
CREATE POLICY "allow_delete_participants"
    ON participants
    FOR DELETE
    TO public
    USING (true);

-- ------------------------------------------------------------
-- 2. Table : daily_tracking
-- ------------------------------------------------------------
ALTER TABLE daily_tracking ENABLE ROW LEVEL SECURITY;

-- Permettre l'insertion depuis l'application (Server Action)
CREATE POLICY "allow_insert_daily_tracking"
    ON daily_tracking
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Permettre la lecture depuis l'application (Server Components)
CREATE POLICY "allow_select_daily_tracking"
    ON daily_tracking
    FOR SELECT
    TO public
    USING (true);

-- Permettre la mise à jour (pour plus tard)
CREATE POLICY "allow_update_daily_tracking"
    ON daily_tracking
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Permettre la suppression (pour plus tard)
CREATE POLICY "allow_delete_daily_tracking"
    ON daily_tracking
    FOR DELETE
    TO public
    USING (true);