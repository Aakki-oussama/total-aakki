-- ============================================
-- TRIGGERS
-- Automatisation des calculs Avance/Crédit
-- Utilise les functions du fichier functions_calcul.sql
-- ============================================

-- ============================================
-- TRIGGER 1: Valider la transaction avant INSERT
-- ============================================

CREATE TRIGGER trg_valider_transaction_before_insert
BEFORE INSERT ON transaction
FOR EACH ROW
EXECUTE FUNCTION valider_transaction();

-- ============================================
-- TRIGGER 2: Valider la transaction avant UPDATE
-- ============================================

CREATE TRIGGER trg_valider_transaction_before_update
BEFORE UPDATE ON transaction
FOR EACH ROW
EXECUTE FUNCTION valider_transaction();

-- ============================================
-- TRIGGER 3: Calculer solde_apres AVANT INSERT
-- ============================================

CREATE OR REPLACE FUNCTION calculer_solde_apres_insert()
RETURNS TRIGGER AS $$
DECLARE
    v_solde_actuel DECIMAL(12,2);
BEGIN
    -- Récupérer le solde actuel de l'avance
    -- FOR UPDATE: Verrouille la ligne pour éviter les race conditions
    -- si deux transactions sont insérées en même temps
    SELECT COALESCE(solde_actuel, 0)
    INTO v_solde_actuel
    FROM avance
    WHERE id = NEW.avance_id
    FOR UPDATE;
    
    -- Calculer le nouveau solde après cette transaction
    NEW.solde_apres := v_solde_actuel + NEW.montant;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculer_solde_apres_insert
BEFORE INSERT ON transaction
FOR EACH ROW
EXECUTE FUNCTION calculer_solde_apres_insert();

-- ============================================
-- TRIGGER 4: Mettre à jour le solde APRÈS INSERT
-- ============================================

CREATE OR REPLACE FUNCTION update_solde_after_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le solde dans la table avance
    PERFORM update_solde_avance(NEW.avance_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_solde_after_insert
AFTER INSERT ON transaction
FOR EACH ROW
EXECUTE FUNCTION update_solde_after_insert();

-- ============================================
-- TRIGGER 5: Recalculer tout APRÈS UPDATE d'une transaction
-- (Si on modifie le montant ou la date, il faut tout recalculer)
-- ============================================

CREATE OR REPLACE FUNCTION recalculer_after_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Si le montant ou la date a changé, recalculer tout
    IF OLD.montant != NEW.montant OR 
       OLD.date_transaction != NEW.date_transaction OR
       OLD.deleted_at IS DISTINCT FROM NEW.deleted_at THEN
        
        -- Recalculer tous les soldes_apres dans l'ordre
        PERFORM recalculer_soldes_apres(NEW.avance_id);
        
        -- Mettre à jour le solde actuel
        PERFORM update_solde_avance(NEW.avance_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalculer_after_update
AFTER UPDATE ON transaction
FOR EACH ROW
EXECUTE FUNCTION recalculer_after_update();

-- ============================================
-- TRIGGER 6: Recalculer tout APRÈS DELETE (soft ou hard)
-- ============================================

CREATE OR REPLACE FUNCTION recalculer_after_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculer tous les soldes_apres
    PERFORM recalculer_soldes_apres(OLD.avance_id);
    
    -- Mettre à jour le solde actuel
    PERFORM update_solde_avance(OLD.avance_id);
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalculer_after_delete
AFTER DELETE ON transaction
FOR EACH ROW
EXECUTE FUNCTION recalculer_after_delete();

-- ============================================
-- TRIGGER 7: Empêcher la suppression hard si pas admin
-- (Optionnel - pour forcer le soft delete)
-- ============================================

CREATE OR REPLACE FUNCTION prevent_hard_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Si la transaction n'est pas déjà soft deleted, empêcher la suppression
    IF OLD.deleted_at IS NULL THEN
        RAISE EXCEPTION 'Suppression interdite. Utilisez soft_delete_transaction() à la place.';
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Décommenter si vous voulez forcer le soft delete
-- CREATE TRIGGER trg_prevent_hard_delete
-- BEFORE DELETE ON transaction
-- FOR EACH ROW
-- EXECUTE FUNCTION prevent_hard_delete();

-- ============================================
-- TRIGGER 8: Soft delete en cascade pour Client
-- Si un client est soft deleted, soft delete toutes ses transactions
-- ============================================

CREATE OR REPLACE FUNCTION soft_delete_client_cascade()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        -- Soft delete toutes les transactions liées à ce client
        UPDATE transaction
        SET deleted_at = NOW()
        WHERE avance_id IN (
            SELECT id FROM avance WHERE client_id = NEW.id
        ) AND deleted_at IS NULL;
        
        -- Soft delete l'avance
        UPDATE avance
        SET deleted_at = NOW()
        WHERE client_id = NEW.id AND deleted_at IS NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_soft_delete_client_cascade
AFTER UPDATE ON client
FOR EACH ROW
EXECUTE FUNCTION soft_delete_client_cascade();

-- ============================================
-- TRIGGER 9: Soft delete en cascade pour Société
-- ============================================

CREATE OR REPLACE FUNCTION soft_delete_societe_cascade()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        -- Soft delete toutes les transactions liées à cette société
        UPDATE transaction
        SET deleted_at = NOW()
        WHERE avance_id IN (
            SELECT id FROM avance WHERE societe_id = NEW.id
        ) AND deleted_at IS NULL;
        
        -- Soft delete l'avance
        UPDATE avance
        SET deleted_at = NOW()
        WHERE societe_id = NEW.id AND deleted_at IS NULL;
        
        -- Soft delete les employés
        UPDATE employe
        SET deleted_at = NOW()
        WHERE societe_id = NEW.id AND deleted_at IS NULL;
        
        -- Soft delete les véhicules
        UPDATE vehicule
        SET deleted_at = NOW()
        WHERE societe_id = NEW.id AND deleted_at IS NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_soft_delete_societe_cascade
AFTER UPDATE ON societe
FOR EACH ROW
EXECUTE FUNCTION soft_delete_societe_cascade();

-- ============================================
-- TRIGGER 10: Ajouter l'avance dans la table avance
-- ============================================

-- Optionnel: créer automatiquement l'avance si elle n'existe pas
-- Décommenter si vous voulez cette fonctionnalité

/*
CREATE OR REPLACE FUNCTION auto_create_avance()
RETURNS TRIGGER AS $$
BEGIN
    -- Si l'avance n'existe pas encore, la créer
    IF NOT EXISTS (SELECT 1 FROM avance WHERE id = NEW.avance_id) THEN
        RAISE EXCEPTION 'L''avance doit être créée manuellement avant d''ajouter des transactions';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_create_avance
BEFORE INSERT ON transaction
FOR EACH ROW
EXECUTE FUNCTION auto_create_avance();
*/

-- ============================================
-- FIN TRIGGERS
-- ============================================

-- ============================================
-- NOTES D'UTILISATION:
-- ============================================
-- 
-- Ces triggers automatisent complètement les calculs:
-- 
-- 1. INSERT transaction → solde_apres calculé auto + solde_actuel mis à jour
-- 2. UPDATE transaction → tout recalculé dans l'ordre chronologique
-- 3. DELETE transaction → tout recalculé
-- 4. Soft delete client/société → cascade sur toutes les données liées
--
-- Vous n'avez PAS besoin de calculer manuellement depuis le frontend!
-- Juste INSERT/UPDATE/DELETE et la base fait le reste.
--
-- ============================================