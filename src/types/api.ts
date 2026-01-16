/**
 * TYPES UTILITAIRES POUR L'API
 * Types génériques pour les réponses, pagination, etc.
 */

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
    page: number;
    limit: number;
}

/**
 * Réponse paginée générique
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Réponse d'API avec gestion d'erreur
 */
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

/**
 * État de chargement pour les hooks
 */
export interface LoadingState {
    loading: boolean;
    error: string | null;
}

/**
 * Options de tri
 */
export interface SortOptions {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

/**
 * Réponse Supabase typée
 */
export interface SupabaseResponse<T> {
    data: T | null;
    error: {
        message: string;
        details?: string;
        hint?: string;
    } | null;
}
