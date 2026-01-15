/**
 * TYPES DES TABLES
 * Correspondent exactement aux colonnes des tables PostgreSQL
 */

/**
 * Table: client
 * Description: Client simple (personne physique)
 */
export interface Client {
    id: string;
    nom: string;
    prenom: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Table: societe
 * Description: Entreprise/Société
 */
export interface Societe {
    id: string;
    nom_societe: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Table: employe
 * Description: Employé d'une société
 */
export interface Employe {
    id: string;
    societe_id: string;
    nom: string;
    prenom: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Table: vehicule
 * Description: Véhicule d'une société
 */
export interface Vehicule {
    id: string;
    societe_id: string;
    matricule: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Table: avance
 * Description: Solde actuel d'un client ou d'une société
 * Note: Soit client_id, soit societe_id (jamais les deux)
 */
export interface Avance {
    id: string;
    client_id: string | null;
    societe_id: string | null;
    solde_actuel: number;
    created_at: string;
    updated_at: string;
}

/**
 * Table: transaction
 * Description: Historique complet des avances et crédits gasoil
 */
export interface Transaction {
    id: string;
    avance_id: string;
    type_transaction: 'AVANCE' | 'GASOIL';
    montant: number;
    mode_paiement: 'CASH' | 'CHEQUE' | null;
    numero_cheque: string | null;
    employe_id: string | null;
    vehicule_id: string | null;
    solde_apres: number; // ⚠️ Calculé AUTO par trigger
    date_transaction: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
