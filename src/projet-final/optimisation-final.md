-- ============================================
-- OPTIMIZATION V2 - MATERIALIZED VIEWS
-- Performance pour 100,000+ transactions
-- ============================================

-- ============================================
-- MATVIEW 1: Total AVANCES par JOUR
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mat_avances_par_jour AS
SELECT 
    DATE(date_avance) as jour,
    COUNT(*) as nombre_avances,
    SUM(CASE WHEN mode_paiement = 'CASH' THEN montant ELSE 0 END) as total_cash,
    SUM(CASE WHEN mode_paiement = 'CHEQUE' THEN montant ELSE 0 END) as total_cheque,
    SUM(montant) as total_avances
FROM avance
WHERE deleted_at IS NULL
GROUP BY DATE(date_avance);

CREATE UNIQUE INDEX idx_mat_avances_jour ON mat_avances_par_jour(jour);

-- ============================================
-- MATVIEW 2: Total AVANCES par SEMAINE
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mat_avances_par_semaine AS
SELECT 
    DATE_TRUNC('week', date_avance) as semaine,
    COUNT(*) as nombre_avances,
    SUM(CASE WHEN mode_paiement = 'CASH' THEN montant ELSE 0 END) as total_cash,
    SUM(CASE WHEN mode_paiement = 'CHEQUE' THEN montant ELSE 0 END) as total_cheque,
    SUM(montant) as total_avances
FROM avance
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('week', date_avance);

CREATE UNIQUE INDEX idx_mat_avances_semaine ON mat_avances_par_semaine(semaine);

-- ============================================
-- MATVIEW 3: Total AVANCES par MOIS
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mat_avances_par_mois AS
SELECT 
    DATE_TRUNC('month', date_avance) as mois,
    TO_CHAR(date_avance, 'YYYY-MM') as mois_format,
    COUNT(*) as nombre_avances,
    SUM(CASE WHEN mode_paiement = 'CASH' THEN montant ELSE 0 END) as total_cash,
    SUM(CASE WHEN mode_paiement = 'CHEQUE' THEN montant ELSE 0 END) as total_cheque,
    SUM(montant) as total_avances
FROM avance
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('month', date_avance), TO_CHAR(date_avance, 'YYYY-MM');

CREATE UNIQUE INDEX idx_mat_avances_mois ON mat_avances_par_mois(mois);

-- ============================================
-- MATVIEW 4: Total GASOIL par JOUR
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mat_gasoil_par_jour AS
SELECT 
    DATE(date_gasoil) as jour,
    COUNT(*) as nombre_transactions,
    SUM(montant) as total_gasoil
FROM gasoil
WHERE deleted_at IS NULL
GROUP BY DATE(date_gasoil);

CREATE UNIQUE INDEX idx_mat_gasoil_jour ON mat_gasoil_par_jour(jour);

-- ============================================
-- MATVIEW 5: Total GASOIL par SEMAINE
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mat_gasoil_par_semaine AS
SELECT 
    DATE_TRUNC('week', date_gasoil) as semaine,
    COUNT(*) as nombre_transactions,
    SUM(montant) as total_gasoil
FROM gasoil
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('week', date_gasoil);

CREATE UNIQUE INDEX idx_mat_gasoil_semaine ON mat_gasoil_par_semaine(semaine);

-- ============================================
-- MATVIEW 6: Total GASOIL par MOIS
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mat_gasoil_par_mois AS
SELECT 
    DATE_TRUNC('month', date_gasoil) as mois,
    TO_CHAR(date_gasoil, 'YYYY-MM') as mois_format,
    COUNT(*) as nombre_transactions,
    SUM(montant) as total_gasoil
FROM gasoil
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('month', date_gasoil), TO_CHAR(date_gasoil, 'YYYY-MM');

CREATE UNIQUE INDEX idx_mat_gasoil_mois ON mat_gasoil_par_mois(mois);



-- ============================================
-- MATVIEW 8: Consommation EMPLOYÉ par MOIS
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mat_consommation_employe_mois AS
SELECT 
    e.id as employe_id,
    e.nom,
    e.prenom,
    s.id as societe_id,
    s.nom_societe,
    DATE_TRUNC('month', g.date_gasoil) as mois,
    TO_CHAR(g.date_gasoil, 'YYYY-MM') as mois_format,
    COUNT(*) as nombre_transactions,
    SUM(g.montant) as total_gasoil
FROM employe e
JOIN societe s ON s.id = e.societe_id
JOIN gasoil g ON g.employe_id = e.id
WHERE e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND g.deleted_at IS NULL
GROUP BY e.id, e.nom, e.prenom, s.id, s.nom_societe,
         DATE_TRUNC('month', g.date_gasoil),
         TO_CHAR(g.date_gasoil, 'YYYY-MM');

CREATE INDEX idx_mat_consommation_employe ON mat_consommation_employe_mois(employe_id, mois);
CREATE INDEX idx_mat_consommation_employe_societe ON mat_consommation_employe_mois(societe_id, mois);

-- ============================================
-- FONCTION: Refresh toutes les materialized views
-- ============================================

CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mat_avances_par_jour;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mat_avances_par_semaine;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mat_avances_par_mois;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mat_gasoil_par_jour;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mat_gasoil_par_semaine;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mat_gasoil_par_mois;

    REFRESH MATERIALIZED VIEW CONCURRENTLY mat_consommation_employe_mois;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEX SUPPLÉMENTAIRES pour performance
-- ============================================

-- Index composite pour recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_avance_date_client 
ON avance(date_avance, client_id) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_avance_date_societe 
ON avance(date_avance, societe_id) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_gasoil_date_employe
ON gasoil(date_gasoil, employe_id)
WHERE deleted_at IS NULL;



-- Index pour recherche par période
CREATE INDEX IF NOT EXISTS idx_avance_date_trunc_week
ON avance(DATE_TRUNC('week', date_avance))
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_avance_date_trunc_month
ON avance(DATE_TRUNC('month', date_avance))
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_gasoil_date_trunc_week
ON gasoil(DATE_TRUNC('week', date_gasoil))
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_gasoil_date_trunc_month
ON gasoil(DATE_TRUNC('month', date_gasoil))
WHERE deleted_at IS NULL;

-- ============================================
-- VIEW OPTIMISÉE: Dashboard avec matviews
-- ============================================

CREATE OR REPLACE VIEW view_dashboard_optimized AS
SELECT 
    (SELECT COUNT(*) FROM client WHERE deleted_at IS NULL) as total_clients,
    (SELECT COUNT(*) FROM societe WHERE deleted_at IS NULL) as total_societes,
    (SELECT COUNT(*) FROM solde WHERE solde_actuel < 0) as total_impayes,
    (SELECT COALESCE(ABS(SUM(solde_actuel)), 0) FROM solde WHERE solde_actuel < 0) as montant_total_impayes,
    
    -- Utilise materialized views (ultra rapide!)
    (SELECT COALESCE(total_avances, 0) FROM mat_avances_par_jour WHERE jour = CURRENT_DATE) as avances_aujourdhui,
    (SELECT COALESCE(total_gasoil, 0) FROM mat_gasoil_par_jour WHERE jour = CURRENT_DATE) as gasoil_aujourdhui,
    (SELECT COALESCE(total_avances, 0) FROM mat_avances_par_mois WHERE mois = DATE_TRUNC('month', CURRENT_DATE)) as avances_mois,
    (SELECT COALESCE(total_gasoil, 0) FROM mat_gasoil_par_mois WHERE mois = DATE_TRUNC('month', CURRENT_DATE)) as gasoil_mois;

-- ============================================
-- STRATÉGIE DE REFRESH (RECOMMANDATIONS)
-- ============================================
--
-- OPTION A: Refresh manuel (simple)
-- → Bouton dans l'interface : "Rafraîchir les rapports"
-- → Appelle: SELECT refresh_all_materialized_views();
--
-- OPTION B: Refresh planifié avec pg_cron (production)
-- → Toutes les 5 minutes
-- → Voir ci-dessous
--
-- ============================================

-- OPTION B: Planifier avec pg_cron (si disponible)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('refresh-matviews', '*/5 * * * *', 'SELECT refresh_all_materialized_views();');

-- ============================================
-- COMMANDES UTILES
-- ============================================

-- Refresh manuel:
-- SELECT refresh_all_materialized_views();

-- Vérifier taille des tables:
-- SELECT 
--     schemaname,
--     tablename,
--     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Analyser performance:
-- EXPLAIN ANALYZE SELECT * FROM mat_avances_par_mois;

-- ============================================
-- FIN OPTIMIZATION V2
-- ============================================

-- ============================================
-- PERFORMANCE ATTENDUE:
-- ============================================
-- 
-- Avec 100,000+ transactions:
-- - Requêtes normales: 1-3 secondes
-- - Avec materialized views: 10-50ms (100x plus rapide!)
--
-- Avec 1,000,000+ transactions:
-- - Materialized views: 50-200ms
--
-- ============================================