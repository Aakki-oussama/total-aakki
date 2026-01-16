-- ============================================
-- VIEWS RAPPORTS
-- Filtres et statistiques (jour/semaine/mois)
-- ============================================

-- ============================================
-- VIEW 1: Liste complète des clients avec leur solde
-- ============================================

CREATE OR REPLACE VIEW view_clients_avec_solde AS
SELECT 
    c.id as client_id,
    c.nom,
    c.prenom,
    CONCAT(c.nom, ' ', c.prenom) as nom_complet,
    COALESCE(a.solde_actuel, 0) as solde,
    CASE 
        WHEN COALESCE(a.solde_actuel, 0) < 0 THEN 'CREDIT'
        WHEN COALESCE(a.solde_actuel, 0) > 0 THEN 'AVANCE'
        ELSE 'EQUILIBRE'
    END as statut,
    c.created_at,
    c.updated_at
FROM client c
LEFT JOIN avance a ON a.client_id = c.id
WHERE c.deleted_at IS NULL;

-- ============================================
-- VIEW 2: Liste complète des sociétés avec leur solde
-- ============================================

CREATE OR REPLACE VIEW view_societes_avec_solde AS
SELECT 
    s.id as societe_id,
    s.nom_societe,
    COALESCE(a.solde_actuel, 0) as solde,
    CASE 
        WHEN COALESCE(a.solde_actuel, 0) < 0 THEN 'CREDIT'
        WHEN COALESCE(a.solde_actuel, 0) > 0 THEN 'AVANCE'
        ELSE 'EQUILIBRE'
    END as statut,
    COUNT(DISTINCT v.id) as nombre_vehicules,
    COUNT(DISTINCT e.id) as nombre_employes,
    s.created_at,
    s.updated_at
FROM societe s
LEFT JOIN avance a ON a.societe_id = s.id
LEFT JOIN vehicule v ON v.societe_id = s.id AND v.deleted_at IS NULL
LEFT JOIN employe e ON e.societe_id = s.id AND e.deleted_at IS NULL
WHERE s.deleted_at IS NULL
GROUP BY s.id, s.nom_societe, a.solde_actuel, s.created_at, s.updated_at;

-- ============================================
-- VIEW 3: IMPAYÉS - Tous les clients/sociétés avec solde négatif
-- ============================================

CREATE OR REPLACE VIEW view_impayes AS
SELECT 
    a.id as avance_id,
    CASE 
        WHEN a.client_id IS NOT NULL THEN 'CLIENT'
        WHEN a.societe_id IS NOT NULL THEN 'SOCIETE'
    END as type_entite,
    COALESCE(CONCAT(c.nom, ' ', c.prenom), s.nom_societe) as nom,
    a.solde_actuel as montant_du,
    ABS(a.solde_actuel) as montant_du_positif,
    a.updated_at as derniere_modification
FROM avance a
LEFT JOIN client c ON a.client_id = c.id
LEFT JOIN societe s ON a.societe_id = s.id
WHERE a.solde_actuel < 0
ORDER BY a.solde_actuel ASC;

-- ============================================
-- VIEW 4: Total AVANCES par JOUR
-- ============================================

CREATE OR REPLACE VIEW view_avances_par_jour AS
SELECT 
    DATE(t.date_transaction) as jour,
    COUNT(*) as nombre_avances,
    SUM(CASE WHEN t.mode_paiement = 'CASH' THEN t.montant ELSE 0 END) as total_cash,
    SUM(CASE WHEN t.mode_paiement = 'CHEQUE' THEN t.montant ELSE 0 END) as total_cheque,
    SUM(t.montant) as total_avances
FROM transaction t
WHERE t.type_transaction = 'AVANCE'
  AND t.deleted_at IS NULL
GROUP BY DATE(t.date_transaction)
ORDER BY jour DESC;

-- ============================================
-- VIEW 5: Total AVANCES par SEMAINE
-- ============================================

CREATE OR REPLACE VIEW view_avances_par_semaine AS
SELECT 
    DATE_TRUNC('week', t.date_transaction) as semaine,
    COUNT(*) as nombre_avances,
    SUM(CASE WHEN t.mode_paiement = 'CASH' THEN t.montant ELSE 0 END) as total_cash,
    SUM(CASE WHEN t.mode_paiement = 'CHEQUE' THEN t.montant ELSE 0 END) as total_cheque,
    SUM(t.montant) as total_avances
FROM transaction t
WHERE t.type_transaction = 'AVANCE'
  AND t.deleted_at IS NULL
GROUP BY DATE_TRUNC('week', t.date_transaction)
ORDER BY semaine DESC;

-- ============================================
-- VIEW 6: Total AVANCES par MOIS
-- ============================================

CREATE OR REPLACE VIEW view_avances_par_mois AS
SELECT 
    DATE_TRUNC('month', t.date_transaction) as mois,
    TO_CHAR(t.date_transaction, 'YYYY-MM') as mois_format,
    COUNT(*) as nombre_avances,
    SUM(CASE WHEN t.mode_paiement = 'CASH' THEN t.montant ELSE 0 END) as total_cash,
    SUM(CASE WHEN t.mode_paiement = 'CHEQUE' THEN t.montant ELSE 0 END) as total_cheque,
    SUM(t.montant) as total_avances
FROM transaction t
WHERE t.type_transaction = 'AVANCE'
  AND t.deleted_at IS NULL
GROUP BY DATE_TRUNC('month', t.date_transaction), TO_CHAR(t.date_transaction, 'YYYY-MM')
ORDER BY mois DESC;

-- ============================================
-- VIEW 7: Total CRÉDITS (gasoil) par JOUR
-- ============================================

CREATE OR REPLACE VIEW view_credits_par_jour AS
SELECT 
    DATE(t.date_transaction) as jour,
    COUNT(*) as nombre_transactions,
    ABS(SUM(t.montant)) as total_gasoil
FROM transaction t
WHERE t.type_transaction = 'GASOIL'
  AND t.deleted_at IS NULL
GROUP BY DATE(t.date_transaction)
ORDER BY jour DESC;

-- ============================================
-- VIEW 8: Total CRÉDITS (gasoil) par SEMAINE
-- ============================================

CREATE OR REPLACE VIEW view_credits_par_semaine AS
SELECT 
    DATE_TRUNC('week', t.date_transaction) as semaine,
    COUNT(*) as nombre_transactions,
    ABS(SUM(t.montant)) as total_gasoil
FROM transaction t
WHERE t.type_transaction = 'GASOIL'
  AND t.deleted_at IS NULL
GROUP BY DATE_TRUNC('week', t.date_transaction)
ORDER BY semaine DESC;

-- ============================================
-- VIEW 9: Total CRÉDITS (gasoil) par MOIS
-- ============================================

CREATE OR REPLACE VIEW view_credits_par_mois AS
SELECT 
    DATE_TRUNC('month', t.date_transaction) as mois,
    TO_CHAR(t.date_transaction, 'YYYY-MM') as mois_format,
    COUNT(*) as nombre_transactions,
    ABS(SUM(t.montant)) as total_gasoil
FROM transaction t
WHERE t.type_transaction = 'GASOIL'
  AND t.deleted_at IS NULL
GROUP BY DATE_TRUNC('month', t.date_transaction), TO_CHAR(t.date_transaction, 'YYYY-MM')
ORDER BY mois DESC;

-- ============================================
-- VIEW 10: Consommation par CLIENT (avec période)
-- ============================================

CREATE OR REPLACE VIEW view_consommation_client AS
SELECT 
    c.id as client_id,
    CONCAT(c.nom, ' ', c.prenom) as nom_client,
    DATE(t.date_transaction) as jour,
    DATE_TRUNC('week', t.date_transaction) as semaine,
    DATE_TRUNC('month', t.date_transaction) as mois,
    COUNT(*) as nombre_transactions,
    ABS(SUM(CASE WHEN t.type_transaction = 'GASOIL' THEN t.montant ELSE 0 END)) as total_gasoil,
    SUM(CASE WHEN t.type_transaction = 'AVANCE' THEN t.montant ELSE 0 END) as total_avances
FROM client c
JOIN avance a ON a.client_id = c.id
JOIN transaction t ON t.avance_id = a.id
WHERE c.deleted_at IS NULL
  AND t.deleted_at IS NULL
GROUP BY c.id, c.nom, c.prenom, DATE(t.date_transaction), 
         DATE_TRUNC('week', t.date_transaction), 
         DATE_TRUNC('month', t.date_transaction)
ORDER BY jour DESC;

-- ============================================
-- VIEW 11: Consommation par SOCIÉTÉ (avec période)
-- ============================================

CREATE OR REPLACE VIEW view_consommation_societe AS
SELECT 
    s.id as societe_id,
    s.nom_societe,
    DATE(t.date_transaction) as jour,
    DATE_TRUNC('week', t.date_transaction) as semaine,
    DATE_TRUNC('month', t.date_transaction) as mois,
    COUNT(*) as nombre_transactions,
    ABS(SUM(CASE WHEN t.type_transaction = 'GASOIL' THEN t.montant ELSE 0 END)) as total_gasoil,
    SUM(CASE WHEN t.type_transaction = 'AVANCE' THEN t.montant ELSE 0 END) as total_avances
FROM societe s
JOIN avance a ON a.societe_id = s.id
JOIN transaction t ON t.avance_id = a.id
WHERE s.deleted_at IS NULL
  AND t.deleted_at IS NULL
GROUP BY s.id, s.nom_societe, DATE(t.date_transaction), 
         DATE_TRUNC('week', t.date_transaction), 
         DATE_TRUNC('month', t.date_transaction)
ORDER BY jour DESC;

-- ============================================
-- VIEW 12: Consommation par VÉHICULE
-- ============================================

CREATE OR REPLACE VIEW view_consommation_vehicule AS
SELECT 
    v.id as vehicule_id,
    v.matricule,
    s.nom_societe,
    DATE(t.date_transaction) as jour,
    DATE_TRUNC('week', t.date_transaction) as semaine,
    DATE_TRUNC('month', t.date_transaction) as mois,
    COUNT(*) as nombre_transactions,
    ABS(SUM(t.montant)) as total_gasoil
FROM vehicule v
JOIN societe s ON s.id = v.societe_id
JOIN transaction t ON t.vehicule_id = v.id
WHERE v.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND t.deleted_at IS NULL
  AND t.type_transaction = 'GASOIL'
GROUP BY v.id, v.matricule, s.nom_societe, DATE(t.date_transaction),
         DATE_TRUNC('week', t.date_transaction),
         DATE_TRUNC('month', t.date_transaction)
ORDER BY jour DESC;

-- ============================================
-- VIEW 13: Consommation par EMPLOYÉ
-- ============================================

CREATE OR REPLACE VIEW view_consommation_employe AS
SELECT 
    e.id as employe_id,
    CONCAT(e.nom, ' ', e.prenom) as nom_employe,
    s.nom_societe,
    DATE(t.date_transaction) as jour,
    DATE_TRUNC('week', t.date_transaction) as semaine,
    DATE_TRUNC('month', t.date_transaction) as mois,
    COUNT(*) as nombre_transactions,
    ABS(SUM(t.montant)) as total_gasoil
FROM employe e
JOIN societe s ON s.id = e.societe_id
JOIN transaction t ON t.employe_id = e.id
WHERE e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND t.deleted_at IS NULL
  AND t.type_transaction = 'GASOIL'
GROUP BY e.id, e.nom, e.prenom, s.nom_societe, DATE(t.date_transaction),
         DATE_TRUNC('week', t.date_transaction),
         DATE_TRUNC('month', t.date_transaction)
ORDER BY jour DESC;

-- ============================================
-- VIEW 14: TOP 5 Véhicules qui consomment le plus (mois en cours)
-- ============================================

CREATE OR REPLACE VIEW view_top_vehicules_mois AS
SELECT 
    v.id as vehicule_id,
    v.matricule,
    s.nom_societe,
    COUNT(*) as nombre_transactions,
    ABS(SUM(t.montant)) as total_gasoil
FROM vehicule v
JOIN societe s ON s.id = v.societe_id
JOIN transaction t ON t.vehicule_id = v.id
WHERE v.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND t.deleted_at IS NULL
  AND t.type_transaction = 'GASOIL'
  AND DATE_TRUNC('month', t.date_transaction) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY v.id, v.matricule, s.nom_societe
ORDER BY total_gasoil DESC
LIMIT 5;

-- ============================================
-- VIEW 15: TOP 5 Employés qui consomment le plus (mois en cours)
-- ============================================

CREATE OR REPLACE VIEW view_top_employes_mois AS
SELECT 
    e.id as employe_id,
    CONCAT(e.nom, ' ', e.prenom) as nom_employe,
    s.nom_societe,
    COUNT(*) as nombre_transactions,
    ABS(SUM(t.montant)) as total_gasoil
FROM employe e
JOIN societe s ON s.id = e.societe_id
JOIN transaction t ON t.employe_id = e.id
WHERE e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND t.deleted_at IS NULL
  AND t.type_transaction = 'GASOIL'
  AND DATE_TRUNC('month', t.date_transaction) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY e.id, e.nom, e.prenom, s.nom_societe
ORDER BY total_gasoil DESC
LIMIT 5;

-- ============================================
-- VIEW 16: Recherche par numéro de chèque
-- ============================================

CREATE OR REPLACE VIEW view_recherche_cheques AS
SELECT 
    t.id as transaction_id,
    t.numero_cheque,
    t.montant,
    t.date_transaction,
    CASE 
        WHEN a.client_id IS NOT NULL THEN 'CLIENT'
        WHEN a.societe_id IS NOT NULL THEN 'SOCIETE'
    END as type_entite,
    COALESCE(CONCAT(c.nom, ' ', c.prenom), s.nom_societe) as nom,
    t.created_at
FROM transaction t
JOIN avance a ON t.avance_id = a.id
LEFT JOIN client c ON a.client_id = c.id
LEFT JOIN societe s ON a.societe_id = s.id
WHERE t.mode_paiement = 'CHEQUE'
  AND t.deleted_at IS NULL
ORDER BY t.date_transaction DESC;

-- ============================================
-- VIEW 17: Résumé global (Dashboard)
-- ============================================

CREATE OR REPLACE VIEW view_dashboard_global AS
SELECT 
    -- Total clients
    (SELECT COUNT(*) FROM client WHERE deleted_at IS NULL) as total_clients,
    
    -- Total sociétés
    (SELECT COUNT(*) FROM societe WHERE deleted_at IS NULL) as total_societes,
    
    -- Total impayés
    (SELECT COUNT(*) FROM avance WHERE solde_actuel < 0) as total_impayes,
    
    -- Montant total impayés
    (SELECT COALESCE(ABS(SUM(solde_actuel)), 0) FROM avance WHERE solde_actuel < 0) as montant_total_impayes,
    
    -- Total avances du jour
    (SELECT COALESCE(SUM(montant), 0) 
     FROM transaction 
     WHERE type_transaction = 'AVANCE' 
       AND DATE(date_transaction) = CURRENT_DATE
       AND deleted_at IS NULL) as avances_aujourdhui,
    
    -- Total gasoil du jour
    (SELECT COALESCE(ABS(SUM(montant)), 0) 
     FROM transaction 
     WHERE type_transaction = 'GASOIL' 
       AND DATE(date_transaction) = CURRENT_DATE
       AND deleted_at IS NULL) as gasoil_aujourdhui,
    
    -- Total avances du mois
    (SELECT COALESCE(SUM(montant), 0) 
     FROM transaction 
     WHERE type_transaction = 'AVANCE' 
       AND DATE_TRUNC('month', date_transaction) = DATE_TRUNC('month', CURRENT_DATE)
       AND deleted_at IS NULL) as avances_mois,
    
    -- Total gasoil du mois
    (SELECT COALESCE(ABS(SUM(montant)), 0) 
     FROM transaction 
     WHERE type_transaction = 'GASOIL' 
       AND DATE_TRUNC('month', date_transaction) = DATE_TRUNC('month', CURRENT_DATE)
       AND deleted_at IS NULL) as gasoil_mois;

-- ============================================
-- FIN VIEWS RAPPORTS
-- ============================================

-- ============================================
-- EXEMPLES D'UTILISATION:
-- ============================================
--
-- Tous les impayés:
-- SELECT * FROM view_impayes;
--
-- Avances du mois de janvier 2026:
-- SELECT * FROM view_avances_par_mois WHERE mois_format = '2026-01';
--
-- Consommation d'un client spécifique par semaine:
-- SELECT * FROM view_consommation_client WHERE client_id = 'xxx' ORDER BY semaine DESC;
--
-- Top véhicules du mois:
-- SELECT * FROM view_top_vehicules_mois;
--
-- Dashboard:
-- SELECT * FROM view_dashboard_global;
--
-- ============================================