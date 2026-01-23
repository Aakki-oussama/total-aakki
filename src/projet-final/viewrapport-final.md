-- ============================================
-- VIEWS V2 - RAPPORTS
-- Pour tables AVANCE et GASOIL séparées
-- ============================================

-- ============================================
-- VIEW 1: Liste clients avec solde
-- ============================================

CREATE OR REPLACE VIEW view_clients_avec_solde AS
SELECT 
    c.id as client_id,
    c.nom,
    c.prenom,
    CONCAT(c.nom, ' ', c.prenom) as nom_complet,
    COALESCE(s.total_avances, 0) as total_avances,
    COALESCE(s.total_gasoil, 0) as total_gasoil,
    COALESCE(s.solde_actuel, 0) as solde,
    CASE 
        WHEN COALESCE(s.solde_actuel, 0) < 0 THEN 'CREDIT'
        WHEN COALESCE(s.solde_actuel, 0) > 0 THEN 'AVANCE'
        ELSE 'EQUILIBRE'
    END as statut,
    c.created_at,
    c.updated_at
FROM client c
LEFT JOIN solde s ON s.client_id = c.id
WHERE c.deleted_at IS NULL;

-- ============================================
-- VIEW 2: Liste sociétés avec solde
-- ============================================

CREATE OR REPLACE VIEW view_societes_avec_solde AS
SELECT 
    soc.id as societe_id,
    soc.nom_societe,
    COALESCE(s.total_avances, 0) as total_avances,
    COALESCE(s.total_gasoil, 0) as total_gasoil,
    COALESCE(s.solde_actuel, 0) as solde,
    CASE 
        WHEN COALESCE(s.solde_actuel, 0) < 0 THEN 'CREDIT'
        WHEN COALESCE(s.solde_actuel, 0) > 0 THEN 'AVANCE'
        ELSE 'EQUILIBRE'
    END as statut,
    COUNT(DISTINCT e.id) as nombre_employes,
    soc.created_at,
    soc.updated_at
FROM societe soc
LEFT JOIN solde s ON s.societe_id = soc.id
LEFT JOIN employe e ON e.societe_id = soc.id AND e.deleted_at IS NULL
WHERE soc.deleted_at IS NULL
GROUP BY soc.id, soc.nom_societe, s.total_avances, s.total_gasoil, s.solde_actuel, soc.created_at, soc.updated_at;

-- ============================================
-- VIEW 3: IMPAYÉS (solde négatif)
-- ============================================

CREATE OR REPLACE VIEW view_impayes AS
SELECT 
    s.id as solde_id,
    CASE 
        WHEN s.client_id IS NOT NULL THEN 'CLIENT'
        WHEN s.societe_id IS NOT NULL THEN 'SOCIETE'
    END as type_entite,
    COALESCE(CONCAT(c.nom, ' ', c.prenom), soc.nom_societe) as nom,
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
-- VIEW 4: Historique AVANCES avec détails
-- ============================================

CREATE OR REPLACE VIEW view_historique_avances AS
SELECT 
    a.id,
    a.montant,
    a.mode_paiement,
    a.numero_cheque,
    a.date_avance,
    CASE 
        WHEN a.client_id IS NOT NULL THEN 'CLIENT'
        WHEN a.societe_id IS NOT NULL THEN 'SOCIETE'
    END as type_entite,
    a.client_id,
    a.societe_id,
    COALESCE(CONCAT(c.nom, ' ', c.prenom), s.nom_societe) as nom_entite,
    a.created_at,
    a.deleted_at
FROM avance a
LEFT JOIN client c ON a.client_id = c.id
LEFT JOIN societe s ON a.societe_id = s.id
WHERE a.deleted_at IS NULL
ORDER BY a.date_avance DESC;

-- ============================================
-- VIEW 5: Historique GASOIL avec détails
-- ============================================

CREATE OR REPLACE VIEW view_historique_gasoil AS
SELECT 
    g.id,
    g.montant,
    g.date_gasoil,
    CASE 
        WHEN g.client_id IS NOT NULL THEN 'CLIENT'
        WHEN g.societe_id IS NOT NULL THEN 'SOCIETE'
    END as type_entite,
    g.client_id,
    g.societe_id,
    COALESCE(CONCAT(c.nom, ' ', c.prenom), s.nom_societe) as nom_entite,
    g.employe_id,
    CONCAT(e.nom, ' ', e.prenom) as nom_employe,
    CONCAT(e.nom, ' ', e.prenom) as nom_employe,
    g.created_at,
    g.deleted_at
FROM gasoil g
LEFT JOIN client c ON g.client_id = c.id
LEFT JOIN societe s ON g.societe_id = s.id
LEFT JOIN employe e ON g.employe_id = e.id
WHERE g.deleted_at IS NULL
ORDER BY g.date_gasoil DESC;

-- ============================================
-- VIEW 6: Total AVANCES par JOUR
-- ============================================

CREATE OR REPLACE VIEW view_avances_par_jour AS
SELECT 
    DATE(date_avance) as jour,
    COUNT(*) as nombre_avances,
    SUM(CASE WHEN mode_paiement = 'CASH' THEN montant ELSE 0 END) as total_cash,
    SUM(CASE WHEN mode_paiement = 'CHEQUE' THEN montant ELSE 0 END) as total_cheque,
    SUM(montant) as total_avances
FROM avance
WHERE deleted_at IS NULL
GROUP BY DATE(date_avance)
ORDER BY jour DESC;

-- ============================================
-- VIEW 7: Total AVANCES par SEMAINE
-- ============================================

CREATE OR REPLACE VIEW view_avances_par_semaine AS
SELECT 
    DATE_TRUNC('week', date_avance) as semaine,
    COUNT(*) as nombre_avances,
    SUM(CASE WHEN mode_paiement = 'CASH' THEN montant ELSE 0 END) as total_cash,
    SUM(CASE WHEN mode_paiement = 'CHEQUE' THEN montant ELSE 0 END) as total_cheque,
    SUM(montant) as total_avances
FROM avance
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('week', date_avance)
ORDER BY semaine DESC;

-- ============================================
-- VIEW 8: Total AVANCES par MOIS
-- ============================================

CREATE OR REPLACE VIEW view_avances_par_mois AS
SELECT 
    DATE_TRUNC('month', date_avance) as mois,
    TO_CHAR(date_avance, 'YYYY-MM') as mois_format,
    COUNT(*) as nombre_avances,
    SUM(CASE WHEN mode_paiement = 'CASH' THEN montant ELSE 0 END) as total_cash,
    SUM(CASE WHEN mode_paiement = 'CHEQUE' THEN montant ELSE 0 END) as total_cheque,
    SUM(montant) as total_avances
FROM avance
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('month', date_avance), TO_CHAR(date_avance, 'YYYY-MM')
ORDER BY mois DESC;

-- ============================================
-- VIEW 9: Total GASOIL par JOUR
-- ============================================

CREATE OR REPLACE VIEW view_gasoil_par_jour AS
SELECT 
    DATE(date_gasoil) as jour,
    COUNT(*) as nombre_transactions,
    SUM(montant) as total_gasoil
FROM gasoil
WHERE deleted_at IS NULL
GROUP BY DATE(date_gasoil)
ORDER BY jour DESC;

-- ============================================
-- VIEW 10: Total GASOIL par SEMAINE
-- ============================================

CREATE OR REPLACE VIEW view_gasoil_par_semaine AS
SELECT 
    DATE_TRUNC('week', date_gasoil) as semaine,
    COUNT(*) as nombre_transactions,
    SUM(montant) as total_gasoil
FROM gasoil
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('week', date_gasoil)
ORDER BY semaine DESC;

-- ============================================
-- VIEW 11: Total GASOIL par MOIS
-- ============================================

CREATE OR REPLACE VIEW view_gasoil_par_mois AS
SELECT 
    DATE_TRUNC('month', date_gasoil) as mois,
    TO_CHAR(date_gasoil, 'YYYY-MM') as mois_format,
    COUNT(*) as nombre_transactions,
    SUM(montant) as total_gasoil
FROM gasoil
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('month', date_gasoil), TO_CHAR(date_gasoil, 'YYYY-MM')
ORDER BY mois DESC;



-- ============================================
-- VIEW 13: Consommation par EMPLOYÉ
-- ============================================

CREATE OR REPLACE VIEW view_consommation_employe AS
SELECT 
    e.id as employe_id,
    CONCAT(e.nom, ' ', e.prenom) as nom_employe,
    s.nom_societe,
    DATE(g.date_gasoil) as jour,
    DATE_TRUNC('week', g.date_gasoil) as semaine,
    DATE_TRUNC('month', g.date_gasoil) as mois,
    COUNT(*) as nombre_transactions,
    SUM(g.montant) as total_gasoil
FROM employe e
JOIN societe s ON s.id = e.societe_id
JOIN gasoil g ON g.employe_id = e.id
WHERE e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND g.deleted_at IS NULL
GROUP BY e.id, e.nom, e.prenom, s.nom_societe, DATE(g.date_gasoil),
         DATE_TRUNC('week', g.date_gasoil),
         DATE_TRUNC('month', g.date_gasoil)
ORDER BY jour DESC;



-- ============================================
-- VIEW 15: TOP 5 Employés (mois en cours)
-- ============================================

CREATE OR REPLACE VIEW view_top_employes_mois AS
SELECT 
    e.id as employe_id,
    CONCAT(e.nom, ' ', e.prenom) as nom_employe,
    s.nom_societe,
    COUNT(*) as nombre_transactions,
    SUM(g.montant) as total_gasoil
FROM employe e
JOIN societe s ON s.id = e.societe_id
JOIN gasoil g ON g.employe_id = e.id
WHERE e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND g.deleted_at IS NULL
  AND DATE_TRUNC('month', g.date_gasoil) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY e.id, e.nom, e.prenom, s.nom_societe
ORDER BY total_gasoil DESC
LIMIT 5;

-- ============================================
-- VIEW 16: Recherche par numéro de chèque
-- ============================================

CREATE OR REPLACE VIEW view_recherche_cheques AS
SELECT 
    a.id as avance_id,
    a.numero_cheque,
    a.montant,
    a.date_avance,
    CASE 
        WHEN a.client_id IS NOT NULL THEN 'CLIENT'
        WHEN a.societe_id IS NOT NULL THEN 'SOCIETE'
    END as type_entite,
    COALESCE(CONCAT(c.nom, ' ', c.prenom), s.nom_societe) as nom,
    a.created_at
FROM avance a
LEFT JOIN client c ON a.client_id = c.id
LEFT JOIN societe s ON a.societe_id = s.id
WHERE a.mode_paiement = 'CHEQUE'
  AND a.deleted_at IS NULL
ORDER BY a.date_avance DESC;

-- ============================================
-- VIEW 17: Dashboard global
-- ============================================

CREATE OR REPLACE VIEW view_dashboard_global AS
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
-- FIN VIEWS V2
-- ============================================