/**
 * TYPES POUR LES FORMULAIRES
 * Types dérivés pour la création et modification des entités
 */

import type { Client, Societe, Employe, Vehicule } from './tables';

/**
 * Formulaires de création (sans id, created_at, etc.)
 */
export type ClientFormData = Pick<Client, 'nom' | 'prenom'>;
export type SocieteFormData = Pick<Societe, 'nom_societe'>;
export type EmployeFormData = Pick<Employe, 'societe_id' | 'nom' | 'prenom'>;
export type VehiculeFormData = Pick<Vehicule, 'societe_id' | 'matricule'>;

/**
 * Formulaire pour une transaction AVANCE
 */
export interface TransactionAvanceFormData {
    avance_id: string;
    type_transaction: 'AVANCE';
    montant: number; // Positif
    mode_paiement: 'CASH' | 'CHEQUE';
    numero_cheque?: string; // Requis si mode_paiement = 'CHEQUE'
    date_transaction?: string; // Optionnel, par défaut NOW()
}

/**
 * Formulaire pour une transaction GASOIL
 */
export interface TransactionGasoilFormData {
    avance_id: string;
    type_transaction: 'GASOIL';
    montant: number; // Négatif
    employe_id?: string; // Pour les sociétés
    vehicule_id?: string; // Pour les sociétés
    date_transaction?: string;
}

/**
 * Union type pour les transactions
 */
export type TransactionFormData = TransactionAvanceFormData | TransactionGasoilFormData;

/**
 * Filtres de recherche pour les clients
 */
export interface ClientFilters {
    search?: string; // Recherche par nom/prénom
    statut?: 'CREDIT' | 'AVANCE' | 'EQUILIBRE';
    sortBy?: 'nom' | 'solde' | 'created_at';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Filtres de recherche pour les sociétés
 */
export interface SocieteFilters {
    search?: string;
    statut?: 'CREDIT' | 'AVANCE' | 'EQUILIBRE';
    sortBy?: 'nom_societe' | 'solde' | 'created_at';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Filtres de recherche pour les transactions
 */
export interface TransactionFilters {
    type_transaction?: 'AVANCE' | 'GASOIL';
    mode_paiement?: 'CASH' | 'CHEQUE';
    date_debut?: string;
    date_fin?: string;
    avance_id?: string;
}
