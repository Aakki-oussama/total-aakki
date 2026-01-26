-- ============================================
-- FUNCTIONS FINAL - CALCUL SOLDE
-- ============================================

-- ============================================
-- FUNCTION 1: Recalculer le solde pour un client
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
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- FUNCTION 2: Recalculer le solde pour une société
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
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- FUNCTION 3: Obtenir les stats d'un client
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
        (SELECT COUNT(*)::INTEGER FROM avance WHERE client_id = p_client_id AND deleted_at IS NULL),
        (SELECT COUNT(*)::INTEGER FROM gasoil WHERE client_id = p_client_id AND deleted_at IS NULL)
    FROM solde s
    WHERE s.client_id = p_client_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- FUNCTION 4: Obtenir les stats d'une société
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
        (SELECT COUNT(*)::INTEGER FROM avance WHERE societe_id = p_societe_id AND deleted_at IS NULL),
        (SELECT COUNT(*)::INTEGER FROM gasoil WHERE societe_id = p_societe_id AND deleted_at IS NULL)
    FROM solde s
    WHERE s.societe_id = p_societe_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- FUNCTION 5: Soft delete avance
-- ============================================

CREATE OR REPLACE FUNCTION soft_delete_avance(p_avance_id UUID)
RETURNS VOID AS $$
DECLARE
    v_client_id UUID;
    v_societe_id UUID;
BEGIN
    SELECT client_id, societe_id INTO v_client_id, v_societe_id
    FROM avance
    WHERE id = p_avance_id;
    
    UPDATE avance
    SET deleted_at = NOW()
    WHERE id = p_avance_id;
    
    IF v_client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(v_client_id);
    ELSIF v_societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(v_societe_id);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- FUNCTION 6: Soft delete gasoil
-- ============================================

CREATE OR REPLACE FUNCTION soft_delete_gasoil(p_gasoil_id UUID)
RETURNS VOID AS $$
DECLARE
    v_client_id UUID;
    v_societe_id UUID;
BEGIN
    SELECT client_id, societe_id INTO v_client_id, v_societe_id
    FROM gasoil
    WHERE id = p_gasoil_id;
    
    UPDATE gasoil
    SET deleted_at = NOW()
    WHERE id = p_gasoil_id;
    
    IF v_client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(v_client_id);
    ELSIF v_societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(v_societe_id);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- FUNCTION 7: Restaurer avance
-- ============================================

CREATE OR REPLACE FUNCTION restore_avance(p_avance_id UUID)
RETURNS VOID AS $$
DECLARE
    v_client_id UUID;
    v_societe_id UUID;
BEGIN
    SELECT client_id, societe_id INTO v_client_id, v_societe_id
    FROM avance
    WHERE id = p_avance_id;
    
    UPDATE avance
    SET deleted_at = NULL
    WHERE id = p_avance_id;
    
    IF v_client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(v_client_id);
    ELSIF v_societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(v_societe_id);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- FUNCTION 8: Restaurer gasoil
-- ============================================

CREATE OR REPLACE FUNCTION restore_gasoil(p_gasoil_id UUID)
RETURNS VOID AS $$
DECLARE
    v_client_id UUID;
    v_societe_id UUID;
BEGIN
    SELECT client_id, societe_id INTO v_client_id, v_societe_id
    FROM gasoil
    WHERE id = p_gasoil_id;
    
    UPDATE gasoil
    SET deleted_at = NULL
    WHERE id = p_gasoil_id;
    
    IF v_client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(v_client_id);
    ELSIF v_societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(v_societe_id);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- FUNCTION 9: Créer client avec solde initial
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
BEGIN
    -- Créer client
    INSERT INTO client (nom, prenom)
    VALUES (p_nom, p_prenom)
    RETURNING id INTO v_client_id;
    
    -- Créer solde
    INSERT INTO solde (client_id, total_avances, total_gasoil, solde_actuel)
    VALUES (v_client_id, p_montant_initial, 0, p_montant_initial)
    RETURNING id INTO v_solde_id;
    
    -- Si montant > 0, créer avance
    IF p_montant_initial > 0 THEN
        INSERT INTO avance (client_id, montant, mode_paiement)
        VALUES (v_client_id, p_montant_initial, 'CASH')
        RETURNING id INTO v_avance_id;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'client_id', v_client_id,
        'solde_id', v_solde_id,
        'avance_id', v_avance_id,
        'nom_complet', p_nom || ' ' || p_prenom,
        'solde_initial', p_montant_initial
    );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- FUNCTION 10: Créer société avec solde initial
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
BEGIN
    -- Créer société
    INSERT INTO societe (nom_societe)
    VALUES (p_nom_societe)
    RETURNING id INTO v_societe_id;
    
    -- Créer solde
    INSERT INTO solde (societe_id, total_avances, total_gasoil, solde_actuel)
    VALUES (v_societe_id, p_montant_initial, 0, p_montant_initial)
    RETURNING id INTO v_solde_id;
    
    -- Si montant > 0, créer avance
    IF p_montant_initial > 0 THEN
        INSERT INTO avance (societe_id, montant, mode_paiement)
        VALUES (v_societe_id, p_montant_initial, 'CASH')
        RETURNING id INTO v_avance_id;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'societe_id', v_societe_id,
        'solde_id', v_solde_id,
        'avance_id', v_avance_id,
        'nom_societe', p_nom_societe,
        'solde_initial', p_montant_initial
    );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- FIN FUNCTIONS FINAL
-- ============================================