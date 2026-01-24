-- ============================================
-- DASHBOARD PACK FINAL - ONE CALL FOR ALL
-- Optimisation: Un seul appel API (RPC) pour tout charger
-- ============================================

CREATE OR REPLACE FUNCTION get_dashboard_pack()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    WITH 
    stats AS (
        SELECT * FROM view_dashboard_global LIMIT 1
    ),
    debts AS (
        SELECT json_agg(t) FROM (
            SELECT * FROM view_impayes 
            ORDER BY montant_du ASC 
            LIMIT 5
        ) t
    ),
    split AS (
        SELECT json_build_object(
            'clients', json_build_object(
                'count', COUNT(*) FILTER (WHERE type_entite = 'CLIENT'),
                'amount', COALESCE(SUM(montant_du_positif) FILTER (WHERE type_entite = 'CLIENT'), 0)
            ),
            'societes', json_build_object(
                'count', COUNT(*) FILTER (WHERE type_entite = 'SOCIETE'),
                'amount', COALESCE(SUM(montant_du_positif) FILTER (WHERE type_entite = 'SOCIETE'), 0)
            ),
            'total', COALESCE(SUM(montant_du_positif), 0)
        ) FROM view_impayes
    ),
    timeline AS (
        SELECT json_agg(t) FROM (
            SELECT * FROM view_timeline_activite 
            LIMIT 10
        ) t
    )
    SELECT json_build_object(
        'stats', (SELECT row_to_json(stats.*) FROM stats),
        'top_debts', (SELECT * FROM debts),
        'debt_split', (SELECT * FROM split),
        'timeline', (SELECT * FROM timeline)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- UTILISATION :
-- ============================================
-- SQL: SELECT get_dashboard_pack();
-- JS:  const { data, error } = await supabase.rpc('get_dashboard_pack');
-- ============================================
