/**
 * TYPES DES TABLES (V2)
 * Correspondent aux tables : client, societe, avance, gasoil, solde
 */

export interface Client {
    id: string;
    nom: string;
    prenom: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Societe {
    id: string;
    nom_societe: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Table: avance
 * Description: Historique des paiements (Argent qui rentre)
 */
export interface Avance {
    id: string;
    client_id: string | null;
    societe_id: string | null;
    montant: number;
    mode_paiement: 'CASH' | 'CHEQUE';
    numero_cheque: string | null;
    date_avance: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Table: gasoil
 * Description: Historique des consommations (Argent qui sort)
 */
export interface Gasoil {
    id: string;
    client_id: string | null;
    societe_id: string | null;
    montant: number;
    date_gasoil: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Table: solde
 * Description: Résumé des soldes calculés
 */
export interface Solde {
    id: string;
    client_id: string | null;
    societe_id: string | null;
    total_avances: number;
    total_gasoil: number;
    solde_actuel: number;
    created_at: string;
    updated_at: string;
}
