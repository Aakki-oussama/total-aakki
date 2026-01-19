-- ============================================
-- SCHEMA TABLES V2 - AVANCE + GASOIL SÉPARÉS
-- Application Gestion Gasoil
-- ============================================

-- ============================================
-- TABLES DE BASE (CLIENT, SOCIÉTÉ, EMPLOYÉ, VÉHICULE)
-- ============================================

-- Table: CLIENT
CREATE TABLE client (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_client_deleted ON client(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_client_nom_prenom ON client(nom, prenom);

-- ============================================

-- Table: SOCIETE
CREATE TABLE societe (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_societe VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_societe_deleted ON societe(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_societe_nom ON societe(nom_societe);

-- ============================================

-- Table: EMPLOYE
CREATE TABLE employe (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    societe_id UUID NOT NULL REFERENCES societe(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_employe_societe ON employe(societe_id);
CREATE INDEX idx_employe_deleted ON employe(deleted_at) WHERE deleted_at IS NULL;

-- ============================================

-- Table: VEHICULE
CREATE TABLE vehicule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    societe_id UUID NOT NULL REFERENCES societe(id) ON DELETE CASCADE,
    matricule VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_vehicule_societe ON vehicule(societe_id);
CREATE INDEX idx_vehicule_matricule ON vehicule(matricule);
CREATE INDEX idx_vehicule_deleted ON vehicule(deleted_at) WHERE deleted_at IS NULL;

-- ============================================
-- NOUVELLE TABLE: AVANCE (Historique des avances)
-- ============================================

CREATE TABLE avance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Lié à Client OU Société (pas les deux)
    client_id UUID NULL REFERENCES client(id) ON DELETE CASCADE,
    societe_id UUID NULL REFERENCES societe(id) ON DELETE CASCADE,
    
    -- Montant de l'avance (toujours positif)
    montant DECIMAL(12,2) NOT NULL CHECK (montant > 0),
    
    -- Mode de paiement
    mode_paiement VARCHAR(20) NOT NULL CHECK (mode_paiement IN ('CASH', 'CHEQUE')),
    numero_cheque VARCHAR(50) NULL,
    
    -- Dates
    date_avance TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    
    -- Contraintes
    CONSTRAINT chk_avance_entite CHECK (
        (client_id IS NOT NULL AND societe_id IS NULL) OR
        (client_id IS NULL AND societe_id IS NOT NULL)
    ),
    CONSTRAINT chk_avance_cheque CHECK (
        mode_paiement != 'CHEQUE' OR numero_cheque IS NOT NULL
    )
);

-- Index pour performance
CREATE INDEX idx_avance_client ON avance(client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_avance_societe ON avance(societe_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_avance_date ON avance(date_avance) WHERE deleted_at IS NULL;
CREATE INDEX idx_avance_mode ON avance(mode_paiement) WHERE deleted_at IS NULL;

-- ============================================
-- NOUVELLE TABLE: GASOIL (Historique du gasoil pris)
-- ============================================

CREATE TABLE gasoil (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Lié à Client OU Société (pas les deux)
    client_id UUID NULL REFERENCES client(id) ON DELETE CASCADE,
    societe_id UUID NULL REFERENCES societe(id) ON DELETE CASCADE,
    
    -- Montant du gasoil (toujours positif, on stocke en positif maintenant)
    montant DECIMAL(12,2) NOT NULL CHECK (montant > 0),
    
    -- Pour les sociétés seulement
    employe_id UUID NULL REFERENCES employe(id) ON DELETE SET NULL,
    vehicule_id UUID NULL REFERENCES vehicule(id) ON DELETE SET NULL,
    
    -- Dates
    date_gasoil TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    
    -- Contraintes
    CONSTRAINT chk_gasoil_entite CHECK (
        (client_id IS NOT NULL AND societe_id IS NULL) OR
        (client_id IS NULL AND societe_id IS NOT NULL)
    )
);

-- Index pour performance
CREATE INDEX idx_gasoil_client ON gasoil(client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_gasoil_societe ON gasoil(societe_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_gasoil_date ON gasoil(date_gasoil) WHERE deleted_at IS NULL;
CREATE INDEX idx_gasoil_employe ON gasoil(employe_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_gasoil_vehicule ON gasoil(vehicule_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_gasoil_date_client ON gasoil(date_gasoil, client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_gasoil_date_societe ON gasoil(date_gasoil, societe_id) WHERE deleted_at IS NULL;

-- ============================================
-- NOUVELLE TABLE: SOLDE (Solde actuel calculé)
-- ============================================

CREATE TABLE solde (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Lié à Client OU Société (pas les deux)
    client_id UUID NULL REFERENCES client(id) ON DELETE CASCADE,
    societe_id UUID NULL REFERENCES societe(id) ON DELETE CASCADE,
    
    -- Totaux
    total_avances DECIMAL(12,2) DEFAULT 0.00,
    total_gasoil DECIMAL(12,2) DEFAULT 0.00,
    solde_actuel DECIMAL(12,2) DEFAULT 0.00, -- = total_avances - total_gasoil
    
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT chk_solde_entite CHECK (
        (client_id IS NOT NULL AND societe_id IS NULL) OR
        (client_id IS NULL AND societe_id IS NOT NULL)
    ),
    -- Un seul solde par client ou société
    CONSTRAINT unique_solde_client UNIQUE(client_id),
    CONSTRAINT unique_solde_societe UNIQUE(societe_id)
);

-- Index pour performance
CREATE INDEX idx_solde_client ON solde(client_id);
CREATE INDEX idx_solde_societe ON solde(societe_id);
CREATE INDEX idx_solde_actuel ON solde(solde_actuel);
CREATE INDEX idx_solde_negatif ON solde(solde_actuel) WHERE solde_actuel < 0;

-- ============================================
-- FONCTION: Mise à jour automatique de updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_client_updated_at BEFORE UPDATE ON client
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_societe_updated_at BEFORE UPDATE ON societe
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employe_updated_at BEFORE UPDATE ON employe
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicule_updated_at BEFORE UPDATE ON vehicule
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_avance_updated_at BEFORE UPDATE ON avance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gasoil_updated_at BEFORE UPDATE ON gasoil
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_solde_updated_at BEFORE UPDATE ON solde
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIN SCHEMA V2
-- ============================================