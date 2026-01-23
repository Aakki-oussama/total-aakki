-- ============================================
-- TRIGGERS FINAL - AUTOMATISATION CALCUL SOLDE
-- ============================================

-- ============================================
-- TRIGGER 1: Après INSERT avance
-- ============================================

CREATE OR REPLACE FUNCTION trigger_after_insert_avance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(NEW.client_id);
    ELSIF NEW.societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(NEW.societe_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_insert_avance
AFTER INSERT ON avance
FOR EACH ROW
EXECUTE FUNCTION trigger_after_insert_avance();

-- ============================================
-- TRIGGER 2: Après UPDATE avance
-- ============================================

CREATE OR REPLACE FUNCTION trigger_after_update_avance()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.montant != NEW.montant OR OLD.deleted_at IS DISTINCT FROM NEW.deleted_at THEN
        IF NEW.client_id IS NOT NULL THEN
            PERFORM recalculer_solde_client(NEW.client_id);
        ELSIF NEW.societe_id IS NOT NULL THEN
            PERFORM recalculer_solde_societe(NEW.societe_id);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_update_avance
AFTER UPDATE ON avance
FOR EACH ROW
EXECUTE FUNCTION trigger_after_update_avance();

-- ============================================
-- TRIGGER 3: Après DELETE avance
-- ============================================

CREATE OR REPLACE FUNCTION trigger_after_delete_avance()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(OLD.client_id);
    ELSIF OLD.societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(OLD.societe_id);
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_delete_avance
AFTER DELETE ON avance
FOR EACH ROW
EXECUTE FUNCTION trigger_after_delete_avance();

-- ============================================
-- TRIGGER 4: Après INSERT gasoil
-- ============================================

CREATE OR REPLACE FUNCTION trigger_after_insert_gasoil()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(NEW.client_id);
    ELSIF NEW.societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(NEW.societe_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_insert_gasoil
AFTER INSERT ON gasoil
FOR EACH ROW
EXECUTE FUNCTION trigger_after_insert_gasoil();

-- ============================================
-- TRIGGER 5: Après UPDATE gasoil
-- ============================================

CREATE OR REPLACE FUNCTION trigger_after_update_gasoil()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.montant != NEW.montant OR OLD.deleted_at IS DISTINCT FROM NEW.deleted_at THEN
        IF NEW.client_id IS NOT NULL THEN
            PERFORM recalculer_solde_client(NEW.client_id);
        ELSIF NEW.societe_id IS NOT NULL THEN
            PERFORM recalculer_solde_societe(NEW.societe_id);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_update_gasoil
AFTER UPDATE ON gasoil
FOR EACH ROW
EXECUTE FUNCTION trigger_after_update_gasoil();

-- ============================================
-- TRIGGER 6: Après DELETE gasoil
-- ============================================

CREATE OR REPLACE FUNCTION trigger_after_delete_gasoil()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.client_id IS NOT NULL THEN
        PERFORM recalculer_solde_client(OLD.client_id);
    ELSIF OLD.societe_id IS NOT NULL THEN
        PERFORM recalculer_solde_societe(OLD.societe_id);
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_delete_gasoil
AFTER DELETE ON gasoil
FOR EACH ROW
EXECUTE FUNCTION trigger_after_delete_gasoil();

-- ============================================
-- TRIGGER 7: Soft delete cascade CLIENT
-- ============================================

CREATE OR REPLACE FUNCTION soft_delete_client_cascade()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        UPDATE avance SET deleted_at = NOW()
        WHERE client_id = NEW.id AND deleted_at IS NULL;
        
        UPDATE gasoil SET deleted_at = NOW()
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
-- TRIGGER 8: Soft delete cascade SOCIÉTÉ
-- ============================================

CREATE OR REPLACE FUNCTION soft_delete_societe_cascade()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        UPDATE avance SET deleted_at = NOW()
        WHERE societe_id = NEW.id AND deleted_at IS NULL;
        
        UPDATE gasoil SET deleted_at = NOW()
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
-- TRIGGER 9: Validation avance avant INSERT
-- ============================================

CREATE OR REPLACE FUNCTION validate_avance_before_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.montant <= 0 THEN
        RAISE EXCEPTION 'Le montant de l''avance doit être positif';
    END IF;
    
    IF NEW.mode_paiement = 'CHEQUE' AND NEW.numero_cheque IS NULL THEN
        RAISE EXCEPTION 'Le numéro de chèque est obligatoire';
    END IF;
    
    IF NEW.client_id IS NULL AND NEW.societe_id IS NULL THEN
        RAISE EXCEPTION 'L''avance doit être liée à un client ou une société';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_avance_before_insert
BEFORE INSERT ON avance
FOR EACH ROW
EXECUTE FUNCTION validate_avance_before_insert();

-- ============================================
-- TRIGGER 10: Validation gasoil avant INSERT
-- ============================================

CREATE OR REPLACE FUNCTION validate_gasoil_before_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.montant <= 0 THEN
        RAISE EXCEPTION 'Le montant du gasoil doit être positif';
    END IF;
    
    IF NEW.client_id IS NULL AND NEW.societe_id IS NULL THEN
        RAISE EXCEPTION 'Le gasoil doit être lié à un client ou une société';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_gasoil_before_insert
BEFORE INSERT ON gasoil
FOR EACH ROW
EXECUTE FUNCTION validate_gasoil_before_insert();

-- ============================================
-- FIN TRIGGERS FINAL
-- ============================================