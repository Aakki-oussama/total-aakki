/**
 * HELPERS SUPABASE
 * Fonctions utilitaires pour gérer les erreurs et les réponses Supabase
 */

import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Extrait le message d'erreur d'une erreur Supabase/PostgreSQL
 * Affiche le message complet avec les détails et hints si disponibles
 * 
 * @param error - L'erreur retournée par Supabase
 * @returns Message d'erreur formaté pour l'utilisateur
 * 
 * @example
 * ```typescript
 * const { error } = await supabase.from('client').insert({ nom: '' });
 * if (error) {
 *   toast.error(getErrorMessage(error));
 * }
 * ```
 */
export function getErrorMessage(error: PostgrestError | Error | null): string {
    if (!error) return 'Une erreur inconnue est survenue';

    // Erreur PostgreSQL (via Supabase)
    if ('code' in error && 'message' in error) {
        const pgError = error as PostgrestError;

        // Construire le message complet
        let message = pgError.message;

        // Ajouter les détails si disponibles
        if (pgError.details) {
            message += `\nDétails: ${pgError.details}`;
        }

        // Ajouter le hint si disponible
        if (pgError.hint) {
            message += `\nSuggestion: ${pgError.hint}`;
        }

        return message;
    }

    // Erreur JavaScript standard
    return error.message || 'Une erreur inconnue est survenue';
}

/**
 * Vérifie si une erreur Supabase est une violation de contrainte unique
 * Utile pour afficher un message personnalisé (ex: "Ce client existe déjà")
 * 
 * @param error - L'erreur retournée par Supabase
 * @returns true si c'est une violation de contrainte unique
 */
export function isUniqueConstraintError(error: PostgrestError | null): boolean {
    if (!error) return false;
    return error.code === '23505'; // Code PostgreSQL pour unique_violation
}

/**
 * Vérifie si une erreur Supabase est une violation de clé étrangère
 * Utile pour afficher un message personnalisé (ex: "Impossible de supprimer, des données liées existent")
 * 
 * @param error - L'erreur retournée par Supabase
 * @returns true si c'est une violation de clé étrangère
 */
export function isForeignKeyError(error: PostgrestError | null): boolean {
    if (!error) return false;
    return error.code === '23503'; // Code PostgreSQL pour foreign_key_violation
}

/**
 * Vérifie si une erreur Supabase est une violation de contrainte CHECK
 * Utile pour les validations métier (ex: "Le montant doit être positif")
 * 
 * @param error - L'erreur retournée par Supabase
 * @returns true si c'est une violation de contrainte CHECK
 */
export function isCheckConstraintError(error: PostgrestError | null): boolean {
    if (!error) return false;
    return error.code === '23514'; // Code PostgreSQL pour check_violation
}

/**
 * Gère une erreur Supabase et retourne un message utilisateur approprié
 * Combine toutes les vérifications ci-dessus
 * 
 * @param error - L'erreur retournée par Supabase
 * @param customMessages - Messages personnalisés pour chaque type d'erreur
 * @returns Message d'erreur formaté
 * 
 * @example
 * ```typescript
 * const { error } = await supabase.from('client').insert(data);
 * if (error) {
 *   const message = handleSupabaseError(error, {
 *     unique: 'Ce client existe déjà',
 *     foreignKey: 'Impossible de supprimer, des données liées existent',
 *   });
 *   toast.error(message);
 * }
 * ```
 */
export function handleSupabaseError(
    error: PostgrestError | Error | null,
    customMessages?: {
        unique?: string;
        foreignKey?: string;
        check?: string;
    }
): string {
    if (!error) return 'Une erreur inconnue est survenue';

    // Vérifier le type d'erreur PostgreSQL
    if ('code' in error) {
        const pgError = error as PostgrestError;

        if (isUniqueConstraintError(pgError)) {
            return customMessages?.unique || 'Cette entrée existe déjà';
        }

        if (isForeignKeyError(pgError)) {
            return customMessages?.foreignKey || 'Impossible de supprimer, des données liées existent';
        }

        if (isCheckConstraintError(pgError)) {
            return customMessages?.check || getErrorMessage(pgError);
        }
    }

    // Retourner le message par défaut
    return getErrorMessage(error);
}

/**
 * Formate une date ISO en format français lisible
 * 
 * @param isoDate - Date au format ISO (ex: "2024-01-15T10:30:00Z")
 * @returns Date formatée (ex: "15/01/2024 à 10:30")
 */
export function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

/**
 * Formate une date ISO en format court (juste la date)
 * 
 * @param isoDate - Date au format ISO
 * @returns Date formatée (ex: "15/01/2024")
 */
export function formatDateShort(isoDate: string): string {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}

/**
 * Formate un montant en devise (DH - Dirham Marocain)
 * 
 * @param amount - Montant numérique
 * @returns Montant formaté (ex: "1 500,00 DH")
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(amount);
}
