-- ============================================
-- FUNCTIONS V2 - CALCUL SOLDE
-- Pour tables AVANCE et GASOIL séparées
-- ============================================

-- ============================================
-- FUNCTION 1: Créer ou récupérer le solde pour un client
-- ============================================

CREATE OR REPLACE FUNCTION get_or_create_solde_client(p_client_id UUID)
RETURNS UUID AS $$
DECLARE
    v_solde_id UUID;
BEGIN
    -- Chercher le solde existant
    SELECT id INTO v_solde_id
    FROM solde
    WHERE client_id = p_client_id;
    
    -- Si n'existe pas, le créer
    IF v_solde_id IS NULL THEN
        INSERT INTO solde (client_id, total_avances, total_gasoil, solde_actuel)
        VALUES (p_client_id, 0, 0, 0)
        RETURNING id INTO v_solde_id;
    END IF;
    
    RETURN v_solde_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 2: Créer ou récupérer le solde pour une société
-- ============================================

CREATE OR REPLACE FUNCTION get_or_create_solde_societe(p_societe_id UUID)
RETURNS UUID AS $$
DECLARE
    v_solde_id UUID;
BEGIN
    -- Chercher le solde existant
    SELECT id INTO v_solde_id
    FROM solde
    WHERE societe_id = p_societe_id;
    
    -- Si n'existe pas, le créer
    IF v_solde_id IS NULL THEN
        INSERT INTO solde (societe_id, total_avances, total_gasoil, solde_actuel)
        VALUES (p_societe_id, 0, 0, 0)
        RETURNING id INTO v_solde_id;
    END IF;
    
    RETURN v_solde_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 3: Recalculer le solde pour un client
-- ============================================

CREATE OR REPLACE FUNCTION recalculer_solde_client(p_client_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_avances DECIMAL(12,2);
    v_total_gasoil DECIMAL(12,2);
    v_solde DECIMAL(12,2);
BEGIN
    -- Calculer total avances
    SELECT COALESCE(SUM(montant), 0)
    INTO v_total_avances
    FROM avance
    WHERE client_id = p_client_id
      AND deleted_at IS NULL;
    
    -- Calculer total gasoil
    SELECT COALESCE(SUM(montant), 0)
    INTO v_total_gasoil
    FROM gasoil
    WHERE client_id = p_client_id
      AND deleted_at IS NULL;
    
    -- Calculer solde
    v_solde := v_total_avances - v_total_gasoil;
    
    -- Mettre à jour ou créer le solde
    INSERT INTO solde (client_id, total_avances, total_gasoil, solde_actuel)
    VALUES (p_client_id, v_total_avances, v_total_gasoil, v_solde)
    ON CONFLICT (client_id) 
    DO UPDATE SET
        total_avances = v_total_avances,
        total_gasoil = v_total_gasoil,
        solde_actuel = v_solde,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 4: Recalculer le solde pour une société
-- ============================================

CREATE OR REPLACE FUNCTION recalculer_solde_societe(p_societe_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_avances DECIMAL(12,2);
    v_total_gasoil DECIMAL(12,2);
    v_solde DECIMAL(12,2);
BEGIN
    -- Calculer total avances
    SELECT COALESCE(SUM(montant), 0)
    INTO v_total_avances
    FROM avance
    WHERE societe_id = p_societe_id
      AND deleted_at IS NULL;
    
    -- Calculer total gasoil
    SELECT COALESCE(SUM(montant), 0)
    INTO v_total_gasoil
    FROM gasoil
    WHERE societe_id = p_societe_id
      AND deleted_at IS NULL;
    
    -- Calculer solde
    v_solde := v_total_avances - v_total_gasoil;
    
    -- Mettre à jour ou créer le solde
    INSERT INTO solde (societe_id, total_avances, total_gasoil, solde_actuel)
    VALUES (p_societe_id, v_total_avances, v_total_gasoil, v_solde)
    ON CONFLICT (societe_id) 
    DO UPDATE SET
        total_avances = v_total_avances,
        total_gasoil = v_total_gasoil,
        solde_actuel = v_solde,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 5: Obtenir les statistiques d'un client
-- ============================================

CREATE OR REPLACE FUNCTION get_stats_client(p_client_id UUID)
RETURNS TABLE(
    total_avances DECIMAL(12,2),
    total_gasoil DECIMAL(12,2),
    solde_actuel DECIMAL(12,2),
    nombre_avances INTEGER,
    nombre_gasoil INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.total_avances,
        s.total_gasoil,
        s.solde_actuel,
        (SELECT COUNT(*)::INTEGER FROM avance WHERE client_id = p_client_id AND deleted_at IS NULL) as nombre_avances,
        (SELECT COUNT(*)::INTEGER FROM gasoil WHERE client_id = p_client_id AND deleted_at IS NULL) as nombre_gasoil
    FROM solde s
    WHERE s.client_id = p_client_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 6: Obtenir les statistiques d'une société
-- ============================================

CREATE OR REPLACE FUNCTION get_stats_societe(p_societe_id UUID)
RETURNS TABLE(
    total_avances DECIMAL(12,2),
    total_gasoil DECIMAL(12,2),
    solde_actuel DECIMAL(12,2),
    nombre_avances INTEGER,
    nombre_gasoil INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.total_avances,
        s.total_gasoil,
        s.solde_actuel,
        (SELECT COUNT(*)::INTEGER FROM avance WHERE societe_id = p_societe_id AND deleted_at IS NULL) as nombre_avances,
        (SELECT COUNT(*)::INTEGER FROM gasoil WHERE societe_id = p_societe_id AND deleted_at IS NULL) as nombre_gasoil
    FROM solde s
    WHERE s.societe_id = p_societe_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 7: Soft delete d'une avance
-- ============================================

CREATE OR REPLACE FUNCTION soft_delete_avance(p_avance_id UUID)
RETURNS VOID AS $$
DECLARE
    v_client_id UUID;
    v_societe_id UUID;
BEGIN
    -- Récupérer l'entité liée
    SELECT client_id, societe_id INTO v_client_id, v_societe_id
    FROM avance
    WHERE id = p_avance_id;
    
    -- Marquer comme supprimé
    UPDATE avance
    SET deleted_at = NOW()
    WHERE id = p_avance_id;
    
    -- Recalculer le solde
    IF v_client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(v_client_id);
    ELSIF v_societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(v_societe_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 8: Soft delete d'un gasoil
-- ============================================

CREATE OR REPLACE FUNCTION soft_delete_gasoil(p_gasoil_id UUID)
RETURNS VOID AS $$
DECLARE
    v_client_id UUID;
    v_societe_id UUID;
BEGIN
    -- Récupérer l'entité liée
    SELECT client_id, societe_id INTO v_client_id, v_societe_id
    FROM gasoil
    WHERE id = p_gasoil_id;
    
    -- Marquer comme supprimé
    UPDATE gasoil
    SET deleted_at = NOW()
    WHERE id = p_gasoil_id;
    
    -- Recalculer le solde
    IF v_client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(v_client_id);
    ELSIF v_societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(v_societe_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 9: Restaurer une avance soft deleted
-- ============================================

CREATE OR REPLACE FUNCTION restore_avance(p_avance_id UUID)
RETURNS VOID AS $$
DECLARE
    v_client_id UUID;
    v_societe_id UUID;
BEGIN
    -- Récupérer l'entité liée
    SELECT client_id, societe_id INTO v_client_id, v_societe_id
    FROM avance
    WHERE id = p_avance_id;
    
    -- Restaurer
    UPDATE avance
    SET deleted_at = NULL
    WHERE id = p_avance_id;
    
    -- Recalculer le solde
    IF v_client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(v_client_id);
    ELSIF v_societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(v_societe_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 10: Restaurer un gasoil soft deleted
-- ============================================

CREATE OR REPLACE FUNCTION restore_gasoil(p_gasoil_id UUID)
RETURNS VOID AS $$
DECLARE
    v_client_id UUID;
    v_societe_id UUID;
BEGIN
    -- Récupérer l'entité liée
    SELECT client_id, societe_id INTO v_client_id, v_societe_id
    FROM gasoil
    WHERE id = p_gasoil_id;
    
    -- Restaurer
    UPDATE gasoil
    SET deleted_at = NULL
    WHERE id = p_gasoil_id;
    
    -- Recalculer le solde
    IF v_client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(v_client_id);
    ELSIF v_societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(v_societe_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 11: Créer client avec solde initial
-- ============================================

CREATE OR REPLACE FUNCTION create_client_avec_solde(
    p_nom TEXT,
    p_prenom TEXT,
    p_montant_initial DECIMAL(12,2) DEFAULT 0.00
)
RETURNS JSONB AS $$
DECLARE
    v_client_id UUID;
    v_solde_id UUID;
    v_avance_id UUID;
    v_result JSONB;
BEGIN
    -- Créer le client
    INSERT INTO client (nom, prenom)
    VALUES (p_nom, p_prenom)
    RETURNING id INTO v_client_id;
    
    -- Créer le solde
    INSERT INTO solde (client_id, total_avances, total_gasoil, solde_actuel)
    VALUES (v_client_id, p_montant_initial, 0, p_montant_initial)
    RETURNING id INTO v_solde_id;
    
    -- Si montant initial > 0, créer l'avance
    IF p_montant_initial > 0 THEN
        INSERT INTO avance (client_id, montant, mode_paiement)
        VALUES (v_client_id, p_montant_initial, 'CASH')
        RETURNING id INTO v_avance_id;
    END IF;
    
    v_result := jsonb_build_object(
        'success', true,
        'client_id', v_client_id,
        'solde_id', v_solde_id,
        'avance_id', v_avance_id,
        'nom_complet', p_nom || ' ' || p_prenom,
        'solde_initial', p_montant_initial
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 12: Créer société avec solde initial
-- ============================================

CREATE OR REPLACE FUNCTION create_societe_avec_solde(
    p_nom_societe TEXT,
    p_montant_initial DECIMAL(12,2) DEFAULT 0.00
)
RETURNS JSONB AS $$
DECLARE
    v_societe_id UUID;
    v_solde_id UUID;
    v_avance_id UUID;
    v_result JSONB;
BEGIN
    -- Créer la société
    INSERT INTO societe (nom_societe)
    VALUES (p_nom_societe)
    RETURNING id INTO v_societe_id;
    
    -- Créer le solde
    INSERT INTO solde (societe_id, total_avances, total_gasoil, solde_actuel)
    VALUES (v_societe_id, p_montant_initial, 0, p_montant_initial)
    RETURNING id INTO v_solde_id;
    
    -- Si montant initial > 0, créer l'avance
    IF p_montant_initial > 0 THEN
        INSERT INTO avance (societe_id, montant, mode_paiement)
        VALUES (v_societe_id, p_montant_initial, 'CASH')
        RETURNING id INTO v_avance_id;
    END IF;
    
    v_result := jsonb_build_object(
        'success', true,
        'societe_id', v_societe_id,
        'solde_id', v_solde_id,
        'avance_id', v_avance_id,
        'nom_societe', p_nom_societe,
        'solde_initial', p_montant_initial
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FIN FUNCTIONS V2
-- ============================================