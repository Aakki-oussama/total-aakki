-- ============================================
-- VIEWS FINAL - RAPPORTS (JOUR et MOIS seulement)
-- ============================================

-- ============================================
-- VIEW 1: Liste clients avec solde
-- ============================================

CREATE OR REPLACE VIEW view_clients_avec_solde 
WITH (security_invoker = true)
AS
SELECT 
    c.id,              -- Garder 'id' pour matcher le code actuel
    c.nom,
    c.prenom,
    CONCAT(c.nom, ' ', c.prenom) as nom_complet,
    COALESCE(s.total_avances, 0) as total_avances,
    COALESCE(s.total_gasoil, 0) as total_gasoil,
    COALESCE(s.solde_actuel, 0) as solde_actuel,  -- Nom exact de la colonne
    c.created_at,
    c.updated_at
FROM client c
LEFT JOIN solde s ON s.client_id = c.id
WHERE c.deleted_at IS NULL;

-- ============================================
-- VIEW 2: Liste sociétés avec solde
-- ============================================

CREATE OR REPLACE VIEW view_societes_avec_solde 
WITH (security_invoker = true)
AS
SELECT 
    soc.id,            -- Garder 'id' nature
    soc.nom_societe,
    COALESCE(s.total_avances, 0) as total_avances,
    COALESCE(s.total_gasoil, 0) as total_gasoil,
    COALESCE(s.solde_actuel, 0) as solde_actuel, -- Nom exact
    soc.created_at,
    soc.updated_at
FROM societe soc
LEFT JOIN solde s ON s.societe_id = soc.id
WHERE soc.deleted_at IS NULL;

-- ============================================
-- VIEW 3: IMPAYÉS (solde négatif)
-- ============================================

CREATE OR REPLACE VIEW view_impayes 
WITH (security_invoker = true)
AS
SELECT 
    s.id as solde_id,
    CASE 
        WHEN s.client_id IS NOT NULL THEN 'CLIENT'
        WHEN s.societe_id IS NOT NULL THEN 'SOCIETE'
    END as type_entite,
    CASE 
        WHEN s.client_id IS NOT NULL THEN CONCAT(c.nom, ' ', c.prenom)
        ELSE soc.nom_societe
    END as nom,
    s.total_avances,
    s.total_gasoil,
    s.solde_actuel as montant_du,
    ABS(s.solde_actuel) as montant_du_positif,
    s.updated_at as derniere_modification
FROM solde s
LEFT JOIN client c ON s.client_id = c.id
LEFT JOIN societe soc ON s.societe_id = soc.id
WHERE s.solde_actuel < 0
ORDER BY s.solde_actuel ASC;

-- ============================================
-- VIEW 4: Dashboard global
-- ============================================

CREATE OR REPLACE VIEW view_dashboard_global 
WITH (security_invoker = true)
AS
SELECT 
    (SELECT COUNT(*) FROM client WHERE deleted_at IS NULL) as total_clients,
    (SELECT COUNT(*) FROM societe WHERE deleted_at IS NULL) as total_societes,
    (SELECT COUNT(*) FROM solde WHERE solde_actuel < 0) as total_impayes,
    (SELECT COALESCE(ABS(SUM(solde_actuel)), 0) FROM solde WHERE solde_actuel < 0) as montant_total_impayes,
    
    (SELECT COALESCE(SUM(montant), 0) 
     FROM avance 
     WHERE DATE(date_avance) = CURRENT_DATE AND deleted_at IS NULL) as avances_aujourdhui,
    
    (SELECT COALESCE(SUM(montant), 0) 
     FROM gasoil 
     WHERE DATE(date_gasoil) = CURRENT_DATE AND deleted_at IS NULL) as gasoil_aujourdhui,
    
    (SELECT COALESCE(SUM(montant), 0) 
     FROM avance 
     WHERE DATE_TRUNC('month', date_avance) = DATE_TRUNC('month', CURRENT_DATE) 
     AND deleted_at IS NULL) as avances_mois,
    
    (SELECT COALESCE(SUM(montant), 0) 
     FROM gasoil 
     WHERE DATE_TRUNC('month', date_gasoil) = DATE_TRUNC('month', CURRENT_DATE) 
     AND deleted_at IS NULL) as gasoil_mois;

-- ============================================
-- FIN VIEWS FINAL
-- ============================================