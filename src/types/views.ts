/**
 * TYPES DES VIEWS
 * Données enrichies provenant des vues PostgreSQL
 */

/**
 * View: view_clients_avec_solde
 * Description: Liste des clients avec leur solde actuel
 */
export interface ClientAvecSolde {
    client_id: string;
    nom: string;
    prenom: string;
    nom_complet: string;
    solde: number;
    statut: 'CREDIT' | 'AVANCE' | 'EQUILIBRE';
    created_at: string;
    updated_at: string;
}

/**
 * View: view_societes_avec_solde
 * Description: Liste des sociétés avec leur solde actuel
 */
export interface SocieteAvecSolde {
    societe_id: string;
    nom_societe: string;
    solde: number;
    statut: 'CREDIT' | 'AVANCE' | 'EQUILIBRE';
    nombre_vehicules: number;
    nombre_employes: number;
    created_at: string;
    updated_at: string;
}

/**
 * View: view_impayes
 * Description: Tous les clients/sociétés avec solde négatif
 */
export interface Impaye {
    avance_id: string;
    type_entite: 'CLIENT' | 'SOCIETE';
    nom: string;
    montant_du: number; // Négatif
    montant_du_positif: number; // Valeur absolue
    derniere_modification: string;
}

/**
 * View: view_avances_par_jour
 * Description: Total des avances par jour
 */
export interface AvancesParJour {
    jour: string; // Format: YYYY-MM-DD
    nombre_avances: number;
    total_cash: number;
    total_cheque: number;
    total_avances: number;
}

/**
 * View: view_avances_par_mois
 * Description: Total des avances par mois
 */
export interface AvancesParMois {
    mois: string; // Format: YYYY-MM-DD (premier jour du mois)
    mois_format: string; // Format: YYYY-MM
    nombre_avances: number;
    total_cash: number;
    total_cheque: number;
    total_avances: number;
}

/**
 * View: view_credits_par_jour
 * Description: Total des crédits gasoil par jour
 */
export interface CreditsParJour {
    jour: string;
    nombre_transactions: number;
    total_gasoil: number;
}

/**
 * View: view_credits_par_mois
 * Description: Total des crédits gasoil par mois
 */
export interface CreditsParMois {
    mois: string;
    mois_format: string;
    nombre_transactions: number;
    total_gasoil: number;
}

/**
 * View: view_dashboard_global
 * Description: Statistiques globales pour le dashboard
 */
export interface DashboardGlobal {
    total_clients: number;
    total_societes: number;
    total_impayes: number;
    montant_total_impayes: number;
    avances_aujourdhui: number;
    gasoil_aujourdhui: number;
    avances_mois: number;
    gasoil_mois: number;
}

/**
 * View: view_consommation_vehicule
 * Description: Consommation par véhicule avec périodes
 */
export interface ConsommationVehicule {
    vehicule_id: string;
    matricule: string;
    nom_societe: string;
    jour: string;
    semaine: string;
    mois: string;
    nombre_transactions: number;
    total_gasoil: number;
}

/**
 * View: view_consommation_employe
 * Description: Consommation par employé avec périodes
 */
export interface ConsommationEmploye {
    employe_id: string;
    nom_employe: string;
    nom_societe: string;
    jour: string;
    semaine: string;
    mois: string;
    nombre_transactions: number;
    total_gasoil: number;
}

/**
 * Fonction: get_stats_avance
 * Description: Statistiques d'une avance
 */
export interface StatsAvance {
    total_avances: number;
    total_gasoil: number;
    solde_actuel: number;
    nombre_transactions: number;
}

/**
 * View: view_releve_compte
 * Description: Historique fusionné (Gasoil + Avances) avec solde progressif
 */
export interface HistoryItem {
    id: string;
    date_operation: string;
    type: 'GASOIL' | 'PAIEMENT';
    description: string;
    debit: number;
    credit: number;
    solde_ligne: number;
    client_id: string | null;
    societe_id: string | null;
    created_at: string;
}
