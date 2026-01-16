-- ============================================
-- SCHEMA TABLES + INDEX
-- Application Gestion Avance/Crédit Gasoil
-- ============================================

-- Table: CLIENT (Client Simple)
CREATE TABLE client (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Index pour performance
CREATE INDEX idx_client_deleted ON client(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_client_nom_prenom ON client(nom, prenom);

-- ============================================

-- Table: SOCIETE (Entreprise)
CREATE TABLE societe (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_societe VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Index pour performance
CREATE INDEX idx_societe_deleted ON societe(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_societe_nom ON societe(nom_societe);

-- ============================================

-- Table: EMPLOYE (Employé d'une société)
CREATE TABLE employe (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    societe_id UUID NOT NULL REFERENCES societe(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Index pour performance
CREATE INDEX idx_employe_societe ON employe(societe_id);
CREATE INDEX idx_employe_deleted ON employe(deleted_at) WHERE deleted_at IS NULL;

-- ============================================

-- Table: VEHICULE (Véhicule d'une société)
CREATE TABLE vehicule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    societe_id UUID NOT NULL REFERENCES societe(id) ON DELETE CASCADE,
    matricule VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Index pour performance
CREATE INDEX idx_vehicule_societe ON vehicule(societe_id);
CREATE INDEX idx_vehicule_matricule ON vehicule(matricule);
CREATE INDEX idx_vehicule_deleted ON vehicule(deleted_at) WHERE deleted_at IS NULL;

-- ============================================

-- Table: AVANCE (Solde actuel - Client ou Société)
CREATE TABLE avance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NULL REFERENCES client(id) ON DELETE CASCADE,
    societe_id UUID NULL REFERENCES societe(id) ON DELETE CASCADE,
    solde_actuel DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte: soit client, soit société (pas les deux)
    CONSTRAINT chk_avance_type CHECK (
        (client_id IS NOT NULL AND societe_id IS NULL) OR
        (client_id IS NULL AND societe_id IS NOT NULL)
    ),
    -- Contrainte: un seul enregistrement par client ou société
    CONSTRAINT unique_avance_client UNIQUE(client_id),
    CONSTRAINT unique_avance_societe UNIQUE(societe_id)
);

-- Index pour performance
CREATE INDEX idx_avance_client ON avance(client_id);
CREATE INDEX idx_avance_societe ON avance(societe_id);
CREATE INDEX idx_avance_solde ON avance(solde_actuel);
-- Index optimisé pour les requêtes sur les impayés (solde < 0)
CREATE INDEX idx_avance_solde_negatif ON avance(solde_actuel) WHERE solde_actuel < 0;

-- ============================================

-- Table: TRANSACTION (Historique complet)
CREATE TABLE transaction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avance_id UUID NOT NULL REFERENCES avance(id) ON DELETE CASCADE,
    
    -- Type de transaction
    type_transaction VARCHAR(20) NOT NULL CHECK (type_transaction IN ('AVANCE', 'GASOIL')),
    
    -- Montant (positif pour avance, négatif pour gasoil)
    montant DECIMAL(12,2) NOT NULL,
    
    -- Mode de paiement (pour avances seulement)
    mode_paiement VARCHAR(20) NULL CHECK (mode_paiement IN ('CASH', 'CHEQUE')),
    numero_cheque VARCHAR(50) NULL,
    
    -- Pour les sociétés: qui a fait la transaction
    employe_id UUID NULL REFERENCES employe(id) ON DELETE SET NULL,
    vehicule_id UUID NULL REFERENCES vehicule(id) ON DELETE SET NULL,
    
    -- Solde après cette transaction (pour historique)
    solde_apres DECIMAL(12,2) NOT NULL,
    
    date_transaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    
    -- Contraintes métier
    CONSTRAINT chk_avance_mode_paiement CHECK (
        type_transaction = 'GASOIL' OR 
        (type_transaction = 'AVANCE' AND mode_paiement IS NOT NULL)
    ),
    CONSTRAINT chk_cheque_numero CHECK (
        mode_paiement != 'CHEQUE' OR numero_cheque IS NOT NULL
    )
);

-- Index pour performance (TRÈS IMPORTANT pour les rapports)
CREATE INDEX idx_transaction_avance ON transaction(avance_id);
CREATE INDEX idx_transaction_date ON transaction(date_transaction);
CREATE INDEX idx_transaction_type ON transaction(type_transaction);
CREATE INDEX idx_transaction_deleted ON transaction(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_transaction_employe ON transaction(employe_id);
CREATE INDEX idx_transaction_vehicule ON transaction(vehicule_id);
CREATE INDEX idx_transaction_date_type ON transaction(date_transaction, type_transaction);
CREATE INDEX idx_transaction_mode_paiement ON transaction(mode_paiement) WHERE mode_paiement IS NOT NULL;

-- ============================================

-- Fonction pour mettre à jour updated_at automatiquement
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

CREATE TRIGGER update_transaction_updated_at BEFORE UPDATE ON transaction
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIN SCHEMA
-- ============================================