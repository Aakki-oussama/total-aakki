-- ============================================
-- FUNCTIONS CALCUL
-- Logique pour calculer Avance et Crédit
-- ============================================

-- ============================================
-- FUNCTION 1: Calculer le solde actuel d'une avance
-- Utilisée par les triggers pour mettre à jour automatiquement
-- ============================================

CREATE OR REPLACE FUNCTION calculer_solde_avance(p_avance_id UUID)
RETURNS DECIMAL(12,2) AS $$
DECLARE
    v_solde DECIMAL(12,2);
BEGIN
    -- Calcul du solde: 
    -- Somme de tous les montants (avances positives + gasoil négatif)
    -- On ignore les transactions supprimées (soft delete)
    SELECT COALESCE(SUM(montant), 0)
    INTO v_solde
    FROM transaction
    WHERE avance_id = p_avance_id
      AND deleted_at IS NULL;
    
    RETURN v_solde;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 2: Mettre à jour le solde dans la table avance
-- Appelée après chaque modification de transaction
-- ============================================

CREATE OR REPLACE FUNCTION update_solde_avance(p_avance_id UUID)
RETURNS VOID AS $$
DECLARE
    v_nouveau_solde DECIMAL(12,2);
BEGIN
    -- Calculer le nouveau solde
    v_nouveau_solde := calculer_solde_avance(p_avance_id);
    
    -- Mettre à jour la table avance
    UPDATE avance
    SET solde_actuel = v_nouveau_solde,
        updated_at = NOW()
    WHERE id = p_avance_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 3: Recalculer tous les soldes après transaction
-- Utilisée pour recalculer les soldes_apres dans l'historique
-- (Important quand on modifie/supprime une transaction ancienne)
-- ============================================

CREATE OR REPLACE FUNCTION recalculer_soldes_apres(p_avance_id UUID)
RETURNS VOID AS $$
DECLARE
    v_solde_courant DECIMAL(12,2);
    v_transaction RECORD;
BEGIN
    v_solde_courant := 0;
    
    -- Parcourir toutes les transactions dans l'ordre chronologique
    FOR v_transaction IN 
        SELECT id, montant
        FROM transaction
        WHERE avance_id = p_avance_id
          AND deleted_at IS NULL
        ORDER BY date_transaction ASC, created_at ASC
    LOOP
        -- Ajouter le montant au solde courant
        v_solde_courant := v_solde_courant + v_transaction.montant;
        
        -- Mettre à jour le solde_apres pour cette transaction
        UPDATE transaction
        SET solde_apres = v_solde_courant
        WHERE id = v_transaction.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 4: Créer automatiquement une avance si elle n'existe pas
-- Appelée avant d'insérer une transaction
-- ============================================

CREATE OR REPLACE FUNCTION ensure_avance_exists()
RETURNS TRIGGER AS $$
BEGIN
    -- Si avance_id est fourni, vérifier qu'elle existe
    IF NEW.avance_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM avance WHERE id = NEW.avance_id) THEN
            RAISE EXCEPTION 'Avance avec ID % n''existe pas', NEW.avance_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 5: Obtenir les statistiques d'une avance
-- Utile pour l'interface (total avances, total gasoil, solde)
-- ============================================

CREATE OR REPLACE FUNCTION get_stats_avance(p_avance_id UUID)
RETURNS TABLE(
    total_avances DECIMAL(12,2),
    total_gasoil DECIMAL(12,2),
    solde_actuel DECIMAL(12,2),
    nombre_transactions INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN type_transaction = 'AVANCE' THEN montant ELSE 0 END), 0) as total_avances,
        COALESCE(ABS(SUM(CASE WHEN type_transaction = 'GASOIL' THEN montant ELSE 0 END)), 0) as total_gasoil,
        COALESCE(SUM(montant), 0) as solde_actuel,
        COUNT(*)::INTEGER as nombre_transactions
    FROM transaction
    WHERE avance_id = p_avance_id
      AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 6: Valider une transaction avant insertion/modification
-- Vérifie la cohérence des données
-- ============================================

CREATE OR REPLACE FUNCTION valider_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Vérifier que le montant d'avance est positif
    IF NEW.type_transaction = 'AVANCE' AND NEW.montant <= 0 THEN
        RAISE EXCEPTION 'Le montant d''une avance doit être positif';
    END IF;
    
    -- Vérifier que le montant de gasoil est négatif
    IF NEW.type_transaction = 'GASOIL' AND NEW.montant >= 0 THEN
        RAISE EXCEPTION 'Le montant de gasoil doit être négatif';
    END IF;
    
    -- Vérifier que mode_paiement est renseigné pour les avances
    IF NEW.type_transaction = 'AVANCE' AND NEW.mode_paiement IS NULL THEN
        RAISE EXCEPTION 'Le mode de paiement est obligatoire pour une avance';
    END IF;
    
    -- Vérifier que numero_cheque est renseigné si mode_paiement = CHEQUE
    IF NEW.mode_paiement = 'CHEQUE' AND NEW.numero_cheque IS NULL THEN
        RAISE EXCEPTION 'Le numéro de chèque est obligatoire';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 7: Soft delete d'une transaction
-- Marque comme supprimé au lieu de supprimer réellement
-- ============================================

CREATE OR REPLACE FUNCTION soft_delete_transaction(p_transaction_id UUID)
RETURNS VOID AS $$
DECLARE
    v_avance_id UUID;
BEGIN
    -- Récupérer l'avance_id
    SELECT avance_id INTO v_avance_id
    FROM transaction
    WHERE id = p_transaction_id;
    
    -- Marquer comme supprimé
    UPDATE transaction
    SET deleted_at = NOW()
    WHERE id = p_transaction_id;
    
    -- Recalculer le solde
    PERFORM update_solde_avance(v_avance_id);
    PERFORM recalculer_soldes_apres(v_avance_id);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 8: Restaurer une transaction soft deleted
-- ============================================

CREATE OR REPLACE FUNCTION restore_transaction(p_transaction_id UUID)
RETURNS VOID AS $$
DECLARE
    v_avance_id UUID;
BEGIN
    -- Récupérer l'avance_id
    SELECT avance_id INTO v_avance_id
    FROM transaction
    WHERE id = p_transaction_id;
    
    -- Restaurer
    UPDATE transaction
    SET deleted_at = NULL
    WHERE id = p_transaction_id;
    
    -- Recalculer le solde
    PERFORM update_solde_avance(v_avance_id);
    PERFORM recalculer_soldes_apres(v_avance_id);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FIN FUNCTIONS CALCUL
-- ============================================