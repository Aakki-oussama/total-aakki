/**
 * HELPERS SUPABASE
 * Fonctions utilitaires pour formater les données
 * 
 * Note: Error handling is done by mapSupabaseError in error-handler.ts
 */


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
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount) + ' DH';
}
